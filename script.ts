// Sistema de logging condicional
class Logger {
    private static isDev = 
        typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost'));

    static log(...args: any[]): void {
        if (this.isDev) {
            console.log('[Pomodoro]', ...args);
        }
    }

    static error(...args: any[]): void {
        // Erros sempre logados para debug, mas formatados
        console.error('[Pomodoro Error]', ...args);
    }

    static warn(...args: any[]): void {
        if (this.isDev) {
            console.warn('[Pomodoro]', ...args);
        }
    }
}

// Tipos e Interfaces
type SessionType = 'work' | 'shortBreak' | 'longBreak';
type Theme = 'light' | 'dark';
type ModalType = 'settings' | 'stats';

interface PomodoroSettings {
    workDuration: number;
    shortBreak: number;
    longBreak: number;
    soundEnabled: boolean;
}

interface PomodoroStats {
    completedPomodoros: number;
    totalTime: number;
    sessionCount: number;
}

interface SessionState {
    currentTime: number;
    isRunning: boolean;
    currentSessionType: SessionType;
    sessionCount: number;
    completedPomodoros: number;
    totalTime: number;
    timestamp: number;
    workDuration: number;
    shortBreak: number;
    longBreak: number;
}

class PomodoroTimer {
    // Propriedades de configuração
    private workDuration: number;
    private shortBreak: number;
    private longBreak: number;
    
    // Estado do timer
    private currentTime: number; // em segundos
    private isRunning: boolean;
    private isPaused: boolean;
    private intervalId: ReturnType<typeof setInterval> | null;
    private currentSessionType: SessionType;
    private sessionStartTime: number | null;
    
    // Estatísticas
    private sessionCount: number;
    private completedPomodoros: number;
    private totalTime: number; // em minutos
    
    // Configurações
    private soundEnabled: boolean;
    
    // Elementos DOM - Timer
    private timerDisplay: HTMLElement;
    private startBtn: HTMLElement;
    private pauseBtn: HTMLElement;
    private resetBtn: HTMLElement;
    private sessionTypeDisplay: HTMLElement;
    private sessionCountDisplay: HTMLElement;
    private progressCircle: SVGCircleElement | null;
    
    // Elementos DOM - Estatísticas
    private completedPomodorosDisplay: HTMLElement;
    private totalTimeDisplay: HTMLElement;
    
    // Elementos DOM - Configurações
    private workDurationInput: HTMLInputElement;
    private shortBreakInput: HTMLInputElement;
    private longBreakInput: HTMLInputElement;
    private soundNotificationInput: HTMLInputElement;
    
    // Elementos DOM - Presets
    private presetButtons: NodeListOf<HTMLElement>;
    
    // Elementos DOM - Tema
    private themeToggle: HTMLElement;
    private themeIcon: HTMLElement;
    
    // Elementos DOM - Modais
    private settingsModal: HTMLElement;
    private statsModal: HTMLElement;
    private settingsToggle: HTMLElement;
    private statsToggle: HTMLElement;
    private statsCompletedPomodoros: HTMLElement;
    private statsTotalTime: HTMLElement;
    
    // Otimização: debounce para salvamentos
    private saveStateTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        this.workDuration = 25; // minutos
        this.shortBreak = 5;
        this.longBreak = 15;
        this.currentTime = this.workDuration * 60; // em segundos
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        this.sessionCount = 0;
        this.completedPomodoros = 0;
        this.totalTime = 0; // em minutos
        this.currentSessionType = 'work';
        this.soundEnabled = true;
        this.sessionStartTime = null;

        this.initializeElements();
        this.initTheme();
        this.loadSettings();
        this.loadStats();
        this.loadSessionState();
        this.updateDisplay();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    private initializeElements(): void {
        // Timer elements
        this.timerDisplay = this.getElementOrThrow('timer');
        this.startBtn = this.getElementOrThrow('start-btn');
        this.pauseBtn = this.getElementOrThrow('pause-btn');
        this.resetBtn = this.getElementOrThrow('reset-btn');
        this.sessionTypeDisplay = this.getElementOrThrow('session-type');
        this.sessionCountDisplay = this.getElementOrThrow('session-count');
        this.completedPomodorosDisplay = this.getElementOrThrow('completed-pomodoros');
        this.totalTimeDisplay = this.getElementOrThrow('total-time');
        
        // Input elements
        this.workDurationInput = this.getInputElementOrThrow('work-duration');
        this.shortBreakInput = this.getInputElementOrThrow('short-break');
        this.longBreakInput = this.getInputElementOrThrow('long-break');
        this.soundNotificationInput = this.getInputElementOrThrow('sound-notification') as HTMLInputElement;
        
        // Preset buttons
        this.presetButtons = document.querySelectorAll<HTMLElement>('.preset-btn');
        
        // Theme elements
        this.themeToggle = this.getElementOrThrow('theme-toggle');
        this.themeIcon = this.getElementOrThrow('theme-icon');
        
        // Progress circle
        this.progressCircle = document.querySelector<SVGCircleElement>('.progress-ring-circle');
        
        // Modal elements
        this.settingsModal = this.getElementOrThrow('settings-modal');
        this.statsModal = this.getElementOrThrow('stats-modal');
        this.settingsToggle = this.getElementOrThrow('settings-toggle');
        this.statsToggle = this.getElementOrThrow('stats-toggle');
        this.statsCompletedPomodoros = this.getElementOrThrow('stats-completed-pomodoros');
        this.statsTotalTime = this.getElementOrThrow('stats-total-time');
    }

    private getElementOrThrow(id: string): HTMLElement {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }

    private getInputElementOrThrow(id: string): HTMLInputElement {
        const element = document.getElementById(id);
        if (!element || !(element instanceof HTMLInputElement)) {
            throw new Error(`Input element with id "${id}" not found`);
        }
        return element;
    }

    private setupEventListeners(): void {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes || '0', 10);
                this.setPreset(minutes);
            });
        });

        this.workDurationInput.addEventListener('change', () => {
            this.workDuration = parseInt(this.workDurationInput.value, 10);
            if (this.currentSessionType === 'work' && !this.isRunning) {
                this.currentTime = this.workDuration * 60;
                this.updateDisplay();
            }
            this.saveSettings();
        });

        this.shortBreakInput.addEventListener('change', () => {
            this.shortBreak = parseInt(this.shortBreakInput.value, 10);
            if (this.currentSessionType === 'shortBreak' && !this.isRunning) {
                this.currentTime = this.shortBreak * 60;
                this.updateDisplay();
            }
            this.saveSettings();
        });

        this.longBreakInput.addEventListener('change', () => {
            this.longBreak = parseInt(this.longBreakInput.value, 10);
            if (this.currentSessionType === 'longBreak' && !this.isRunning) {
                this.currentTime = this.longBreak * 60;
                this.updateDisplay();
            }
            this.saveSettings();
        });

        this.soundNotificationInput.addEventListener('change', () => {
            this.soundEnabled = this.soundNotificationInput.checked;
            this.saveSettings();
        });

        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Modais
        this.settingsToggle.addEventListener('click', () => this.openModal('settings'));
        this.statsToggle.addEventListener('click', () => this.openModal('stats'));
        
        // Fechar modais
        const closeButtons = document.querySelectorAll<HTMLElement>('.modal-close, .modal-backdrop');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;
                if (target === btn || target.closest('.modal-close')) {
                    this.closeModals();
                }
            });
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }
    
    private openModal(type: ModalType): void {
        if (type === 'settings') {
            this.settingsModal.setAttribute('aria-hidden', 'false');
            this.workDurationInput.focus();
        } else if (type === 'stats') {
            this.updateStatsModal();
            this.statsModal.setAttribute('aria-hidden', 'false');
        }
    }
    
    private closeModals(): void {
        this.settingsModal.setAttribute('aria-hidden', 'true');
        this.statsModal.setAttribute('aria-hidden', 'true');
    }
    
    private updateStatsModal(): void {
        this.statsCompletedPomodoros.textContent = this.completedPomodoros.toString();
        const hours = Math.floor(this.totalTime / 60);
        const minutes = this.totalTime % 60;
        if (hours > 0) {
            this.statsTotalTime.textContent = `${hours}h ${minutes}min`;
        } else {
            this.statsTotalTime.textContent = `${minutes}min`;
        }
    }

    private initTheme(): void {
        const savedTheme = (localStorage.getItem('pomodoroTheme') || 'light') as Theme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    private toggleTheme(): void {
        const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
        const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('pomodoroTheme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    private updateThemeIcon(theme: Theme): void {
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    private setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            // Ignorar se estiver digitando em input
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    if (this.isRunning) {
                        this.pause();
                    } else {
                        this.start();
                    }
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.reset();
                    break;
                case '1':
                    e.preventDefault();
                    this.setPreset(25);
                    break;
                case '2':
                    e.preventDefault();
                    this.setPreset(5);
                    break;
                case '3':
                    e.preventDefault();
                    this.setPreset(15);
                    break;
            }
        });
    }

    private setPreset(minutes: number): void {
        if (this.isRunning) return;

        this.presetButtons.forEach(btn => btn.classList.remove('active'));
        
        const targetBtn = Array.from(this.presetButtons).find(btn => 
            parseInt(btn.dataset.minutes || '0', 10) === minutes
        );
        
        if (minutes === 25) {
            this.currentSessionType = 'work';
            this.currentTime = this.workDuration * 60;
        } else if (minutes === 5) {
            this.currentSessionType = 'shortBreak';
            this.currentTime = this.shortBreak * 60;
        } else if (minutes === 15) {
            this.currentSessionType = 'longBreak';
            this.currentTime = this.longBreak * 60;
        }
        
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        this.updateDisplay();
    }

    private start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;
        this.sessionStartTime = Date.now();
        (this.startBtn as HTMLElement).style.display = 'none';
        (this.pauseBtn as HTMLElement).style.display = 'flex';
        
        const timerWrapper = document.querySelector<HTMLElement>('.timer-wrapper');
        timerWrapper?.classList.add('timer-running');

        // Salvar estado imediatamente
        this.saveSessionState();

        this.intervalId = setInterval(() => {
            if (this.currentTime > 0) {
                this.currentTime--;
                this.updateDisplay();
                // Salvar estado com debounce (a cada 2 segundos) para melhor performance
                this.saveSessionStateDebounced();
            } else {
                this.completeSession();
            }
        }, 1000);
    }

    private pause(): void {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.isPaused = true;
        (this.startBtn as HTMLElement).style.display = 'flex';
        (this.pauseBtn as HTMLElement).style.display = 'none';
        
        const timerWrapper = document.querySelector<HTMLElement>('.timer-wrapper');
        timerWrapper?.classList.remove('timer-running');

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Limpar timeout de salvamento se existir
        if (this.saveStateTimeout) {
            clearTimeout(this.saveStateTimeout);
            this.saveStateTimeout = null;
        }

        // Salvar estado ao pausar (imediatamente, sem debounce)
        this.saveSessionState();
    }

    private reset(): void {
        this.isRunning = false;
        this.isPaused = false;
        this.sessionStartTime = null;
        (this.startBtn as HTMLElement).style.display = 'flex';
        (this.pauseBtn as HTMLElement).style.display = 'none';
        
        const timerWrapper = document.querySelector<HTMLElement>('.timer-wrapper');
        timerWrapper?.classList.remove('timer-running');

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Resetar para o tempo padrão do tipo de sessão atual
        if (this.currentSessionType === 'work') {
            this.currentTime = this.workDuration * 60;
        } else if (this.currentSessionType === 'shortBreak') {
            this.currentTime = this.shortBreak * 60;
        } else {
            this.currentTime = this.longBreak * 60;
        }

        // Remover estado salvo
        localStorage.removeItem('pomodoroSessionState');
        this.updateDisplay();
    }

    private completeSession(): void {
        this.pause();
        
        // Animação de completo
        const timeWrapper = document.querySelector<HTMLElement>('.time-wrapper');
        timeWrapper?.classList.add('timer-complete');
        setTimeout(() => timeWrapper?.classList.remove('timer-complete'), 600);
        
        // Mostrar confetti
        this.showConfetti();
        
        if (this.currentSessionType === 'work') {
            this.completedPomodoros++;
            this.totalTime += this.workDuration;
            this.sessionCount++;
            
            // Após 4 pomodoros, sugerir pausa longa
            if (this.completedPomodoros % 4 === 0) {
                this.currentSessionType = 'longBreak';
                this.currentTime = this.longBreak * 60;
                this.showToast('🎉 4 Pomodoros completos! Hora de uma pausa longa!');
            } else {
                this.currentSessionType = 'shortBreak';
                this.currentTime = this.shortBreak * 60;
                this.showToast('✅ Pomodoro completo! Hora de uma pausa.');
            }
        } else {
            // Após pausa, voltar ao trabalho
            this.currentSessionType = 'work';
            this.currentTime = this.workDuration * 60;
            this.showToast('💪 Pausa concluída! Hora de focar novamente.');
        }

        // Remover estado salvo ao completar
        localStorage.removeItem('pomodoroSessionState');
        this.updateDisplay();
        this.updateStats();
        this.saveStats();
        this.showNotification();
        this.playSound();
    }

    private updateDisplay(): void {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Atualizar barra de progresso
        this.updateProgressRing();

        // Atualizar tipo de sessão
        const sessionTypeNames: Record<SessionType, string> = {
            'work': 'Trabalho',
            'shortBreak': 'Pausa Curta',
            'longBreak': 'Pausa Longa'
        };
        this.sessionTypeDisplay.textContent = sessionTypeNames[this.currentSessionType];
        this.sessionCountDisplay.textContent = (this.sessionCount + 1).toString();

        // Atualizar botões preset ativos
        this.presetButtons.forEach(btn => {
            btn.classList.remove('active');
            const minutes = parseInt(btn.dataset.minutes || '0', 10);
            if ((this.currentSessionType === 'work' && minutes === 25) ||
                (this.currentSessionType === 'shortBreak' && minutes === 5) ||
                (this.currentSessionType === 'longBreak' && minutes === 15)) {
                btn.classList.add('active');
            }
        });
    }

    private updateProgressRing(): void {
        if (!this.progressCircle) return;
        
        const totalTime = this.getTotalTimeForCurrentSession();
        const elapsed = totalTime - this.currentTime;
        const progress = Math.max(0, Math.min(1, elapsed / totalTime));
        
        const radius = this.progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (progress * circumference);
        
        // Atualizar apenas se o valor mudou significativamente (otimização)
        // Usar requestAnimationFrame para atualizações suaves
        const currentOffset = parseFloat(this.progressCircle.style.strokeDashoffset) || circumference;
        if (Math.abs(currentOffset - offset) > 0.1) {
            requestAnimationFrame(() => {
                this.progressCircle!.style.strokeDasharray = `${circumference} ${circumference}`;
                this.progressCircle!.style.strokeDashoffset = offset.toString();
            });
        }
        
        // Mudar cor baseado no tipo de sessão
        if (this.currentSessionType === 'work') {
            this.progressCircle.style.stroke = '#FF6347';
        } else {
            this.progressCircle.style.stroke = '#FF6347';
        }
    }

    private getTotalTimeForCurrentSession(): number {
        if (this.currentSessionType === 'work') {
            return this.workDuration * 60;
        } else if (this.currentSessionType === 'shortBreak') {
            return this.shortBreak * 60;
        } else {
            return this.longBreak * 60;
        }
    }

    private updateStats(): void {
        this.completedPomodorosDisplay.textContent = this.completedPomodoros.toString();
        const hours = Math.floor(this.totalTime / 60);
        const minutes = this.totalTime % 60;
        if (hours > 0) {
            this.totalTimeDisplay.textContent = `${hours}h ${minutes}min`;
        } else {
            this.totalTimeDisplay.textContent = `${minutes}min`;
        }
        
        // Atualizar modal de stats se estiver aberto
        if (this.statsModal && this.statsModal.getAttribute('aria-hidden') === 'false') {
            this.updateStatsModal();
        }
    }

    private showNotification(): void {
        if ('Notification' in window && Notification.permission === 'granted') {
            const message = this.currentSessionType === 'work' 
                ? 'Pausa concluída! Hora de voltar ao trabalho.' 
                : 'Pomodoro completo! Hora de uma pausa.';
            
            new Notification('🍅 Pomodoro Timer', {
                body: message,
                icon: '🍅'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission: NotificationPermission) => {
                if (permission === 'granted') {
                    this.showNotification();
                }
            });
        }
    }

    private playSound(): void {
        if (!this.soundEnabled) return;

        // Criar um som simples usando Web Audio API
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    private showConfetti(): void {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);
        
        const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            container.appendChild(confetti);
        }
        
        setTimeout(() => container.remove(), 3000);
    }

    private showToast(message: string): void {
        // Remover toast existente se houver
        const existingToast = document.querySelector<HTMLElement>('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remover após 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    private saveSessionState(): void {
        if (!this.isRunning) return;
        
        const state: SessionState = {
            currentTime: this.currentTime,
            isRunning: this.isRunning,
            currentSessionType: this.currentSessionType,
            sessionCount: this.sessionCount,
            completedPomodoros: this.completedPomodoros,
            totalTime: this.totalTime,
            timestamp: Date.now(),
            workDuration: this.workDuration,
            shortBreak: this.shortBreak,
            longBreak: this.longBreak
        };
        localStorage.setItem('pomodoroSessionState', JSON.stringify(state));
    }

    // Versão debounced para reduzir escritas no LocalStorage
    private saveSessionStateDebounced(): void {
        if (this.saveStateTimeout) {
            clearTimeout(this.saveStateTimeout);
        }
        this.saveStateTimeout = setTimeout(() => {
            this.saveSessionState();
            this.saveStateTimeout = null;
        }, 2000); // Salvar a cada 2 segundos ao invés de cada segundo
    }

    private loadSessionState(): void {
        const saved = localStorage.getItem('pomodoroSessionState');
        if (!saved) return;
        
        try {
            const state: SessionState = JSON.parse(saved);
            const timeElapsed = Math.floor((Date.now() - state.timestamp) / 1000);
            
            // Restaurar configurações se necessário
            if (state.workDuration) this.workDuration = state.workDuration;
            if (state.shortBreak) this.shortBreak = state.shortBreak;
            if (state.longBreak) this.longBreak = state.longBreak;
            
            // Verificar se sessão ainda é válida (não expirou)
            if (state.isRunning && timeElapsed < state.currentTime && timeElapsed >= 0) {
                // Recuperar sessão ativa
                this.currentTime = state.currentTime - timeElapsed;
                this.currentSessionType = state.currentSessionType;
                this.sessionCount = state.sessionCount || 0;
                this.completedPomodoros = state.completedPomodoros || 0;
                this.totalTime = state.totalTime || 0;
                
                // Continuar automaticamente se ainda tiver tempo
                if (this.currentTime > 0) {
                    this.updateDisplay();
                    this.updateStats();
                    this.showToast('⏱️ Sessão anterior recuperada!');
                } else {
                    // Sessão expirou, completar
                    this.completeSession();
                }
            } else {
                // Sessão expirou ou estava pausada, limpar
                localStorage.removeItem('pomodoroSessionState');
            }
        } catch (e) {
            Logger.error('Erro ao carregar estado da sessão:', e);
            localStorage.removeItem('pomodoroSessionState');
        }
    }

    private saveSettings(): void {
        const settings: PomodoroSettings = {
            workDuration: this.workDuration,
            shortBreak: this.shortBreak,
            longBreak: this.longBreak,
            soundEnabled: this.soundEnabled
        };
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }

    private loadSettings(): void {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            try {
                const settings: PomodoroSettings = JSON.parse(saved);
                this.workDuration = settings.workDuration || 25;
                this.shortBreak = settings.shortBreak || 5;
                this.longBreak = settings.longBreak || 15;
                this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
            } catch (e) {
                Logger.error('Erro ao carregar configurações:', e);
            }
        }

        this.workDurationInput.value = this.workDuration.toString();
        this.shortBreakInput.value = this.shortBreak.toString();
        this.longBreakInput.value = this.longBreak.toString();
        this.soundNotificationInput.checked = this.soundEnabled;

        if (this.currentSessionType === 'work') {
            this.currentTime = this.workDuration * 60;
        }
    }

    private saveStats(): void {
        const stats: PomodoroStats = {
            completedPomodoros: this.completedPomodoros,
            totalTime: this.totalTime,
            sessionCount: this.sessionCount
        };
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }

    private loadStats(): void {
        const saved = localStorage.getItem('pomodoroStats');
        if (saved) {
            try {
                const stats: PomodoroStats = JSON.parse(saved);
                this.completedPomodoros = stats.completedPomodoros || 0;
                this.totalTime = stats.totalTime || 0;
                this.sessionCount = stats.sessionCount || 0;
            } catch (e) {
                Logger.error('Erro ao carregar estatísticas:', e);
            }
        }
        this.updateStats();
    }
}

// Solicitar permissão de notificação quando a página carregar
if ('Notification' in window && Notification.permission === 'default') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            Notification.requestPermission();
        }, 1000);
    });
}

// Inicializar o timer quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
