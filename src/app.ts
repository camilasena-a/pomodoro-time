// Arquivo principal que integra todos os serviços e componentes
// Este arquivo será compilado para script.js

import { SessionType, PomodoroSettings } from './types';
import { StorageService } from './services/StorageService';
import { NotificationService } from './services/NotificationService';
import { SoundService } from './services/SoundService';
import { HistoryService } from './services/HistoryService';
import { TaskService } from './services/TaskService';
import { GoalService } from './services/GoalService';
import { AchievementService } from './services/AchievementService';
import { XPService } from './services/XPService';
import { Toast } from './components/Toast';
import { Confetti } from './components/Confetti';
import { formatTime, formatDuration, minutesToSeconds, getDateString } from './utils/timeUtils';
import { debounce } from './utils/debounce';
import { getRandomMessage } from './utils/motivationalMessages';

// Re-exportar tipos para uso no script.ts
export * from './types';

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
    private currentTaskId: string | null;
    
    // Estatísticas
    private sessionCount: number;
    private completedPomodoros: number;
    private totalTime: number; // em minutos
    
    // Configurações
    private soundEnabled: boolean;
    private autoStartBreaks: boolean;
    private autoStartPomodoros: boolean;
    
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
    private goalProgressDisplay: HTMLElement | null;
    private streakDisplay: HTMLElement | null;
    
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

    // Debounced save
    private saveSessionStateDebounced: () => void;

    constructor() {
        this.workDuration = 25;
        this.shortBreak = 5;
        this.longBreak = 15;
        this.currentTime = this.workDuration * 60;
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        this.sessionCount = 0;
        this.completedPomodoros = 0;
        this.totalTime = 0;
        this.currentSessionType = 'work';
        this.soundEnabled = true;
        this.autoStartBreaks = false;
        this.autoStartPomodoros = false;
        this.sessionStartTime = null;
        this.currentTaskId = null;

        // Criar função debounced para salvar estado
        this.saveSessionStateDebounced = debounce(() => {
            this.saveSessionState();
        }, 5000);

        this.initializeElements();
        this.initTheme();
        this.loadSettings();
        this.loadStats();
        this.loadSessionState();
        this.updateDisplay();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.updateGoalDisplay();
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
        const progressCircleBg = document.querySelector<SVGCircleElement>('.progress-ring-circle-bg');
        
        // Aplicar cor vermelha tomate imediatamente em ambos os círculos
        if (this.progressCircle) {
            this.progressCircle.style.stroke = '#FF6347';
        }
        if (progressCircleBg) {
            progressCircleBg.style.stroke = '#FF6347';
        }
        
        // Modal elements
        this.settingsModal = this.getElementOrThrow('settings-modal');
        this.statsModal = this.getElementOrThrow('stats-modal');
        this.settingsToggle = this.getElementOrThrow('settings-toggle');
        this.statsToggle = this.getElementOrThrow('stats-toggle');
        this.statsCompletedPomodoros = this.getElementOrThrow('stats-completed-pomodoros');
        this.statsTotalTime = this.getElementOrThrow('stats-total-time');

        // Goal elements (criar se não existirem)
        this.goalProgressDisplay = document.getElementById('goal-progress');
        this.streakDisplay = document.getElementById('streak-display');
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
            SoundService.setEnabled(this.soundEnabled);
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
    
    private openModal(type: 'settings' | 'stats'): void {
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
        this.statsTotalTime.textContent = formatDuration(this.totalTime);
    }

    private initTheme(): void {
        const savedTheme = StorageService.loadTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme as 'light' | 'dark');
    }

    private toggleTheme(): void {
        const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        StorageService.saveTheme(newTheme);
        this.updateThemeIcon(newTheme);
    }

    private updateThemeIcon(theme: 'light' | 'dark'): void {
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    private setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
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
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'flex';
        
        const timerWrapper = document.querySelector<HTMLElement>('.timer-wrapper');
        timerWrapper?.classList.add('timer-running');

        SoundService.playStartSound();
        this.saveSessionState();

        this.intervalId = setInterval(() => {
            if (this.currentTime > 0) {
                this.currentTime--;
                this.updateDisplay();
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
        this.startBtn.style.display = 'flex';
        this.pauseBtn.style.display = 'none';
        
        const timerWrapper = document.querySelector<HTMLElement>('.timer-wrapper');
        timerWrapper?.classList.remove('timer-running');

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.saveSessionState();
    }

    private reset(): void {
        this.isRunning = false;
        this.isPaused = false;
        this.sessionStartTime = null;
        this.startBtn.style.display = 'flex';
        this.pauseBtn.style.display = 'none';
        
        const timerWrapper = document.querySelector<HTMLElement>('.timer-wrapper');
        timerWrapper?.classList.remove('timer-running');

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        if (this.currentSessionType === 'work') {
            this.currentTime = this.workDuration * 60;
        } else if (this.currentSessionType === 'shortBreak') {
            this.currentTime = this.shortBreak * 60;
        } else {
            this.currentTime = this.longBreak * 60;
        }

        StorageService.clearSessionState();
        this.updateDisplay();
    }

    private completeSession(): void {
        this.pause();
        
        // Animação de completo
        const timeWrapper = document.querySelector<HTMLElement>('.time-wrapper');
        timeWrapper?.classList.add('timer-complete');
        setTimeout(() => timeWrapper?.classList.remove('timer-complete'), 600);
        
        // Mostrar confetti
        Confetti.show();
        
        if (this.currentSessionType === 'work') {
            const duration = this.workDuration;
            this.completedPomodoros++;
            this.totalTime += duration;
            this.sessionCount++;
            
            // Adicionar ao histórico
            HistoryService.addSession('work', duration, this.currentTaskId || undefined);
            
            // Atualizar meta
            GoalService.incrementTodayPomodoros();
            
            // Adicionar XP
            const { leveledUp, newLevel } = XPService.addPomodoroXP();
            if (leveledUp && newLevel) {
                Toast.success(`🎉 Nível ${newLevel} alcançado!`, 5000);
            }
            
            // Verificar conquistas
            const newAchievements = AchievementService.checkAchievements();
            newAchievements.forEach(achievement => {
                Toast.success(`${achievement.icon} ${achievement.name}! ${achievement.description}`, 5000);
            });
            
            // Verificar se meta foi alcançada
            if (GoalService.isGoalReached()) {
                Toast.success(getRandomMessage('goalReached'), 5000);
                NotificationService.showGoalReached();
            }
            
            // Após 4 pomodoros, sugerir pausa longa
            if (this.completedPomodoros % 4 === 0) {
                this.currentSessionType = 'longBreak';
                this.currentTime = this.longBreak * 60;
                Toast.info('🎉 4 Pomodoros completos! Hora de uma pausa longa!');
            } else {
                this.currentSessionType = 'shortBreak';
                this.currentTime = this.shortBreak * 60;
                Toast.success(getRandomMessage('pomodoroComplete'));
            }
            
            // Auto-start break se configurado
            if (this.autoStartBreaks) {
                setTimeout(() => this.start(), 1000);
            }
        } else {
            // Após pausa, voltar ao trabalho
            this.currentSessionType = 'work';
            this.currentTime = this.workDuration * 60;
            Toast.info(getRandomMessage('breakComplete'));
            
            // Auto-start pomodoro se configurado
            if (this.autoStartPomodoros) {
                setTimeout(() => this.start(), 1000);
            }
        }

        // Remover estado salvo ao completar
        StorageService.clearSessionState();
        this.updateDisplay();
        this.updateStats();
        this.saveStats();
        this.updateGoalDisplay();
        this.showNotification();
        SoundService.playCompleteSound();
    }

    private updateDisplay(): void {
        this.timerDisplay.textContent = formatTime(this.currentTime);
        this.updateProgressRing();

        const sessionTypeNames: Record<SessionType, string> = {
            'work': 'Trabalho',
            'shortBreak': 'Pausa Curta',
            'longBreak': 'Pausa Longa'
        };
        this.sessionTypeDisplay.textContent = sessionTypeNames[this.currentSessionType];
        this.sessionCountDisplay.textContent = (this.sessionCount + 1).toString();

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
        
        // Calcular o offset: quando progress = 0, offset = circumference (vazio)
        // quando progress = 1, offset = 0 (completo)
        const offset = circumference - (progress * circumference);
        
        // SEMPRE atualizar o stroke-dasharray e stroke-dashoffset para animação suave
        this.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        this.progressCircle.style.strokeDashoffset = offset.toString();
        
        // SEMPRE aplicar cor vermelha tomate
        this.progressCircle.style.stroke = '#FF6347';
        
        // Também atualizar o círculo de fundo (sempre visível, mais transparente)
        const progressCircleBg = document.querySelector<SVGCircleElement>('.progress-ring-circle-bg');
        if (progressCircleBg) {
            progressCircleBg.style.stroke = '#FF6347';
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
        this.totalTimeDisplay.textContent = formatDuration(this.totalTime);
        
        if (this.statsModal && this.statsModal.getAttribute('aria-hidden') === 'false') {
            this.updateStatsModal();
        }
    }

    private updateGoalDisplay(): void {
        const progress = GoalService.getProgress();
        const remaining = GoalService.getRemainingPomodoros();
        const streak = GoalService.getCurrentStreak();
        
        if (this.goalProgressDisplay) {
            this.goalProgressDisplay.textContent = `${Math.round(progress)}%`;
        }
        
        if (this.streakDisplay) {
            this.streakDisplay.textContent = `🔥 ${streak}`;
        }
    }

    private showNotification(): void {
        if (this.currentSessionType === 'work') {
            NotificationService.showBreakComplete();
        } else {
            NotificationService.showPomodoroComplete();
        }
    }

    private saveSessionState(): void {
        if (!this.isRunning) return;
        
        const state = {
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
        StorageService.saveSessionState(state);
    }

    private loadSessionState(): void {
        const saved = StorageService.loadSessionState();
        if (!saved) return;
        
        try {
            const timeElapsed = Math.floor((Date.now() - saved.timestamp) / 1000);
            
            if (saved.workDuration) this.workDuration = saved.workDuration;
            if (saved.shortBreak) this.shortBreak = saved.shortBreak;
            if (saved.longBreak) this.longBreak = saved.longBreak;
            
            if (saved.isRunning && timeElapsed < saved.currentTime && timeElapsed >= 0) {
                this.currentTime = saved.currentTime - timeElapsed;
                this.currentSessionType = saved.currentSessionType;
                this.sessionCount = saved.sessionCount || 0;
                this.completedPomodoros = saved.completedPomodoros || 0;
                this.totalTime = saved.totalTime || 0;
                
                if (this.currentTime > 0) {
                    this.updateDisplay();
                    this.updateStats();
                    Toast.info('⏱️ Sessão anterior recuperada!');
                } else {
                    this.completeSession();
                }
            } else {
                StorageService.clearSessionState();
            }
        } catch (e) {
            console.error('Erro ao carregar estado da sessão:', e);
            StorageService.clearSessionState();
        }
    }

    private saveSettings(): void {
        const settings: PomodoroSettings = {
            workDuration: this.workDuration,
            shortBreak: this.shortBreak,
            longBreak: this.longBreak,
            soundEnabled: this.soundEnabled,
            autoStartBreaks: this.autoStartBreaks,
            autoStartPomodoros: this.autoStartPomodoros
        };
        StorageService.saveSettings(settings);
    }

    private loadSettings(): void {
        const saved = StorageService.loadSettings();
        if (saved) {
            this.workDuration = saved.workDuration || 25;
            this.shortBreak = saved.shortBreak || 5;
            this.longBreak = saved.longBreak || 15;
            this.soundEnabled = saved.soundEnabled !== undefined ? saved.soundEnabled : true;
            this.autoStartBreaks = saved.autoStartBreaks || false;
            this.autoStartPomodoros = saved.autoStartPomodoros || false;
            
            SoundService.setEnabled(this.soundEnabled);
            if (saved.soundVolume !== undefined) {
                SoundService.setVolume(saved.soundVolume);
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
        const stats = {
            completedPomodoros: this.completedPomodoros,
            totalTime: this.totalTime,
            sessionCount: this.sessionCount
        };
        StorageService.saveStats(stats);
    }

    private loadStats(): void {
        const saved = StorageService.loadStats();
        if (saved) {
            this.completedPomodoros = saved.completedPomodoros || 0;
            this.totalTime = saved.totalTime || 0;
            this.sessionCount = saved.sessionCount || 0;
        }
        this.updateStats();
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
