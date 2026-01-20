class PomodoroTimer {
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
        this.currentSessionType = 'work'; // 'work', 'shortBreak', 'longBreak'
        this.soundEnabled = true;
        this.sessionStartTime = null; // timestamp quando sessão iniciou

        this.initializeElements();
        this.initTheme();
        this.loadSettings();
        this.loadStats();
        this.loadSessionState(); // Carregar sessão ativa se existir
        this.updateDisplay();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    initializeElements() {
        this.timerDisplay = document.getElementById('timer');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.sessionTypeDisplay = document.getElementById('session-type');
        this.sessionCountDisplay = document.getElementById('session-count');
        this.completedPomodorosDisplay = document.getElementById('completed-pomodoros');
        this.totalTimeDisplay = document.getElementById('total-time');
        this.workDurationInput = document.getElementById('work-duration');
        this.shortBreakInput = document.getElementById('short-break');
        this.longBreakInput = document.getElementById('long-break');
        this.soundNotificationInput = document.getElementById('sound-notification');
        this.presetButtons = document.querySelectorAll('.preset-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.progressCircle = document.querySelector('.progress-ring-circle');
        
        // Modais
        this.settingsModal = document.getElementById('settings-modal');
        this.statsModal = document.getElementById('stats-modal');
        this.settingsToggle = document.getElementById('settings-toggle');
        this.statsToggle = document.getElementById('stats-toggle');
        this.statsCompletedPomodoros = document.getElementById('stats-completed-pomodoros');
        this.statsTotalTime = document.getElementById('stats-total-time');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes);
                this.setPreset(minutes);
            });
        });

        this.workDurationInput.addEventListener('change', () => {
            this.workDuration = parseInt(this.workDurationInput.value);
            if (this.currentSessionType === 'work' && !this.isRunning) {
                this.currentTime = this.workDuration * 60;
                this.updateDisplay();
            }
            this.saveSettings();
        });

        this.shortBreakInput.addEventListener('change', () => {
            this.shortBreak = parseInt(this.shortBreakInput.value);
            if (this.currentSessionType === 'shortBreak' && !this.isRunning) {
                this.currentTime = this.shortBreak * 60;
                this.updateDisplay();
            }
            this.saveSettings();
        });

        this.longBreakInput.addEventListener('change', () => {
            this.longBreak = parseInt(this.longBreakInput.value);
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
        const closeButtons = document.querySelectorAll('.modal-close, .modal-backdrop');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target === btn || e.target.closest('.modal-close')) {
                    this.closeModals();
                }
            });
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }
    
    openModal(type) {
        if (type === 'settings') {
            this.settingsModal.setAttribute('aria-hidden', 'false');
            this.workDurationInput.focus();
        } else if (type === 'stats') {
            this.updateStatsModal();
            this.statsModal.setAttribute('aria-hidden', 'false');
        }
    }
    
    closeModals() {
        this.settingsModal.setAttribute('aria-hidden', 'true');
        this.statsModal.setAttribute('aria-hidden', 'true');
    }
    
    updateStatsModal() {
        this.statsCompletedPomodoros.textContent = this.completedPomodoros;
        const hours = Math.floor(this.totalTime / 60);
        const minutes = this.totalTime % 60;
        if (hours > 0) {
            this.statsTotalTime.textContent = `${hours}h ${minutes}min`;
        } else {
            this.statsTotalTime.textContent = `${minutes}min`;
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem('pomodoroTheme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('pomodoroTheme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignorar se estiver digitando em input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
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

    setPreset(minutes) {
        if (this.isRunning) return;

        this.presetButtons.forEach(btn => btn.classList.remove('active'));
        
        const targetBtn = Array.from(this.presetButtons).find(btn => parseInt(btn.dataset.minutes) === minutes);
        
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

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;
        this.sessionStartTime = Date.now();
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'flex';
        document.querySelector('.timer-wrapper').classList.add('timer-running');

        // Salvar estado imediatamente
        this.saveSessionState();

        this.intervalId = setInterval(() => {
            if (this.currentTime > 0) {
                this.currentTime--;
                this.updateDisplay();
                // Salvar estado a cada segundo para persistência
                this.saveSessionState();
            } else {
                this.completeSession();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.isPaused = true;
        this.startBtn.style.display = 'flex';
        this.pauseBtn.style.display = 'none';
        document.querySelector('.timer-wrapper').classList.remove('timer-running');

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Salvar estado ao pausar
        this.saveSessionState();
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.sessionStartTime = null;
        this.startBtn.style.display = 'flex';
        this.pauseBtn.style.display = 'none';
        document.querySelector('.timer-wrapper').classList.remove('timer-running');

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

    completeSession() {
        this.pause();
        
        // Animação de completo
        const timeWrapper = document.querySelector('.time-wrapper');
        timeWrapper.classList.add('timer-complete');
        setTimeout(() => timeWrapper.classList.remove('timer-complete'), 600);
        
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

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Atualizar barra de progresso
        this.updateProgressRing();

        // Atualizar tipo de sessão
        const sessionTypeNames = {
            'work': 'Trabalho',
            'shortBreak': 'Pausa Curta',
            'longBreak': 'Pausa Longa'
        };
        this.sessionTypeDisplay.textContent = sessionTypeNames[this.currentSessionType];
        this.sessionCountDisplay.textContent = this.sessionCount + 1;

        // Atualizar botões preset ativos
        this.presetButtons.forEach(btn => {
            btn.classList.remove('active');
            const minutes = parseInt(btn.dataset.minutes);
            if ((this.currentSessionType === 'work' && minutes === 25) ||
                (this.currentSessionType === 'shortBreak' && minutes === 5) ||
                (this.currentSessionType === 'longBreak' && minutes === 15)) {
                btn.classList.add('active');
            }
        });
    }

    updateProgressRing() {
        if (!this.progressCircle) return;
        
        const totalTime = this.getTotalTimeForCurrentSession();
        const elapsed = totalTime - this.currentTime;
        const progress = Math.max(0, Math.min(1, elapsed / totalTime));
        
        const radius = this.progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (progress * circumference);
        
        // Atualizar apenas se o valor mudou significativamente (otimização)
        const currentOffset = parseFloat(this.progressCircle.style.strokeDashoffset) || circumference;
        if (Math.abs(currentOffset - offset) > 0.1) {
            this.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            this.progressCircle.style.strokeDashoffset = offset;
        }
        
        // Mudar cor baseado no tipo de sessão
        if (this.currentSessionType === 'work') {
            this.progressCircle.style.stroke = 'var(--primary-color)';
        } else {
            this.progressCircle.style.stroke = 'var(--accent-color)';
        }
    }

    getTotalTimeForCurrentSession() {
        if (this.currentSessionType === 'work') {
            return this.workDuration * 60;
        } else if (this.currentSessionType === 'shortBreak') {
            return this.shortBreak * 60;
        } else {
            return this.longBreak * 60;
        }
    }

    updateStats() {
        this.completedPomodorosDisplay.textContent = this.completedPomodoros;
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

    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            const message = this.currentSessionType === 'work' 
                ? 'Pausa concluída! Hora de voltar ao trabalho.' 
                : 'Pomodoro completo! Hora de uma pausa.';
            
            new Notification('🍅 Pomodoro Timer', {
                body: message,
                icon: '🍅'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification();
                }
            });
        }
    }

    playSound() {
        if (!this.soundEnabled) return;

        // Criar um som simples usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

    showConfetti() {
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

    showToast(message) {
        // Remover toast existente se houver
        const existingToast = document.querySelector('.toast');
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

    saveSessionState() {
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
        localStorage.setItem('pomodoroSessionState', JSON.stringify(state));
    }

    loadSessionState() {
        const saved = localStorage.getItem('pomodoroSessionState');
        if (!saved) return;
        
        try {
            const state = JSON.parse(saved);
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
            console.error('Erro ao carregar estado da sessão:', e);
            localStorage.removeItem('pomodoroSessionState');
        }
    }

    saveSettings() {
        const settings = {
            workDuration: this.workDuration,
            shortBreak: this.shortBreak,
            longBreak: this.longBreak,
            soundEnabled: this.soundEnabled
        };
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.workDuration = settings.workDuration || 25;
            this.shortBreak = settings.shortBreak || 5;
            this.longBreak = settings.longBreak || 15;
            this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
        }

        this.workDurationInput.value = this.workDuration;
        this.shortBreakInput.value = this.shortBreak;
        this.longBreakInput.value = this.longBreak;
        this.soundNotificationInput.checked = this.soundEnabled;

        if (this.currentSessionType === 'work') {
            this.currentTime = this.workDuration * 60;
        }
    }

    saveStats() {
        const stats = {
            completedPomodoros: this.completedPomodoros,
            totalTime: this.totalTime,
            sessionCount: this.sessionCount
        };
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }

    loadStats() {
        const saved = localStorage.getItem('pomodoroStats');
        if (saved) {
            const stats = JSON.parse(saved);
            this.completedPomodoros = stats.completedPomodoros || 0;
            this.totalTime = stats.totalTime || 0;
            this.sessionCount = stats.sessionCount || 0;
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
