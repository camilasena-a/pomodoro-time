// Arquivo principal que integra todos os serviços e componentes
// Este arquivo será compilado para script.js
import { StorageService } from './services/StorageService';
import { NotificationService } from './services/NotificationService';
import { SoundService } from './services/SoundService';
import { HistoryService } from './services/HistoryService';
import { GoalService } from './services/GoalService';
import { AchievementService } from './services/AchievementService';
import { XPService } from './services/XPService';
import { Toast } from './components/Toast';
import { Confetti } from './components/Confetti';
import { formatTime, formatDuration } from './utils/timeUtils';
import { debounce } from './utils/debounce';
import { getRandomMessage } from './utils/motivationalMessages';
import { Logger } from './utils/Logger';
import { validateWorkDuration, validateShortBreak, validateLongBreak, sanitizeSettings, validateSettings } from './utils/validationUtils';
// Re-exportar tipos para uso no script.ts
export * from './types';
class PomodoroTimer {
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
    initializeElements() {
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
        this.soundNotificationInput = this.getInputElementOrThrow('sound-notification');
        // Preset buttons
        this.presetButtons = document.querySelectorAll('.preset-btn');
        // Theme elements
        this.themeToggle = this.getElementOrThrow('theme-toggle');
        this.themeIcon = this.getElementOrThrow('theme-icon');
        // Progress circle
        this.progressCircle = document.querySelector('.progress-ring-circle');
        const progressCircleBg = document.querySelector('.progress-ring-circle-bg');
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
    getElementOrThrow(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }
    getInputElementOrThrow(id) {
        const element = document.getElementById(id);
        if (!element || !(element instanceof HTMLInputElement)) {
            throw new Error(`Input element with id "${id}" not found`);
        }
        return element;
    }
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes || '0', 10);
                this.setPreset(minutes);
            });
        });
        // Validação em tempo real para work duration
        this.workDurationInput.addEventListener('input', () => {
            this.validateAndUpdateInput(this.workDurationInput, validateWorkDuration, (value) => {
                this.workDuration = value;
                if (this.currentSessionType === 'work' && !this.isRunning) {
                    this.currentTime = this.workDuration * 60;
                    this.updateDisplay();
                }
                this.saveSettings();
            });
        });
        this.workDurationInput.addEventListener('change', () => {
            if (this.validateInput(this.workDurationInput, validateWorkDuration)) {
                this.workDuration = parseInt(this.workDurationInput.value, 10);
                if (this.currentSessionType === 'work' && !this.isRunning) {
                    this.currentTime = this.workDuration * 60;
                    this.updateDisplay();
                }
                this.saveSettings();
            }
        });
        // Validação em tempo real para short break
        this.shortBreakInput.addEventListener('input', () => {
            this.validateAndUpdateInput(this.shortBreakInput, validateShortBreak, (value) => {
                this.shortBreak = value;
                if (this.currentSessionType === 'shortBreak' && !this.isRunning) {
                    this.currentTime = this.shortBreak * 60;
                    this.updateDisplay();
                }
                this.saveSettings();
            });
        });
        this.shortBreakInput.addEventListener('change', () => {
            if (this.validateInput(this.shortBreakInput, validateShortBreak)) {
                this.shortBreak = parseInt(this.shortBreakInput.value, 10);
                if (this.currentSessionType === 'shortBreak' && !this.isRunning) {
                    this.currentTime = this.shortBreak * 60;
                    this.updateDisplay();
                }
                this.saveSettings();
            }
        });
        // Validação em tempo real para long break
        this.longBreakInput.addEventListener('input', () => {
            this.validateAndUpdateInput(this.longBreakInput, validateLongBreak, (value) => {
                this.longBreak = value;
                if (this.currentSessionType === 'longBreak' && !this.isRunning) {
                    this.currentTime = this.longBreak * 60;
                    this.updateDisplay();
                }
                this.saveSettings();
            });
        });
        this.longBreakInput.addEventListener('change', () => {
            if (this.validateInput(this.longBreakInput, validateLongBreak)) {
                this.longBreak = parseInt(this.longBreakInput.value, 10);
                if (this.currentSessionType === 'longBreak' && !this.isRunning) {
                    this.currentTime = this.longBreak * 60;
                    this.updateDisplay();
                }
                this.saveSettings();
            }
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
        const closeButtons = document.querySelectorAll('.modal-close, .modal-backdrop');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target;
                if (target === btn || target.closest('.modal-close')) {
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
        }
        else if (type === 'stats') {
            this.updateStatsModal();
            this.statsModal.setAttribute('aria-hidden', 'false');
        }
    }
    closeModals() {
        this.settingsModal.setAttribute('aria-hidden', 'true');
        this.statsModal.setAttribute('aria-hidden', 'true');
    }
    updateStatsModal() {
        this.statsCompletedPomodoros.textContent = this.completedPomodoros.toString();
        this.statsTotalTime.textContent = formatDuration(this.totalTime);
    }
    initTheme() {
        const savedTheme = StorageService.loadTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        StorageService.saveTheme(newTheme);
        this.updateThemeIcon(newTheme);
    }
    updateThemeIcon(theme) {
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const target = e.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
                return;
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    if (this.isRunning) {
                        this.pause();
                    }
                    else {
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
        if (this.isRunning)
            return;
        this.presetButtons.forEach(btn => btn.classList.remove('active'));
        const targetBtn = Array.from(this.presetButtons).find(btn => parseInt(btn.dataset.minutes || '0', 10) === minutes);
        if (minutes === 25) {
            this.currentSessionType = 'work';
            this.currentTime = this.workDuration * 60;
        }
        else if (minutes === 5) {
            this.currentSessionType = 'shortBreak';
            this.currentTime = this.shortBreak * 60;
        }
        else if (minutes === 15) {
            this.currentSessionType = 'longBreak';
            this.currentTime = this.longBreak * 60;
        }
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        this.updateDisplay();
    }
    start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        this.isPaused = false;
        this.sessionStartTime = Date.now();
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'flex';
        const timerWrapper = document.querySelector('.timer-wrapper');
        timerWrapper?.classList.add('timer-running');
        SoundService.playStartSound();
        this.saveSessionState();
        this.intervalId = setInterval(() => {
            if (this.currentTime > 0) {
                this.currentTime--;
                this.updateDisplay();
                this.saveSessionStateDebounced();
            }
            else {
                this.completeSession();
            }
        }, 1000);
    }
    pause() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        this.isPaused = true;
        this.startBtn.style.display = 'flex';
        this.pauseBtn.style.display = 'none';
        const timerWrapper = document.querySelector('.timer-wrapper');
        timerWrapper?.classList.remove('timer-running');
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.saveSessionState();
    }
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.sessionStartTime = null;
        this.startBtn.style.display = 'flex';
        this.pauseBtn.style.display = 'none';
        const timerWrapper = document.querySelector('.timer-wrapper');
        timerWrapper?.classList.remove('timer-running');
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.currentSessionType === 'work') {
            this.currentTime = this.workDuration * 60;
        }
        else if (this.currentSessionType === 'shortBreak') {
            this.currentTime = this.shortBreak * 60;
        }
        else {
            this.currentTime = this.longBreak * 60;
        }
        StorageService.clearSessionState();
        this.updateDisplay();
    }
    completeSession() {
        this.pause();
        // Animação de completo
        const timeWrapper = document.querySelector('.time-wrapper');
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
            }
            else {
                this.currentSessionType = 'shortBreak';
                this.currentTime = this.shortBreak * 60;
                Toast.success(getRandomMessage('pomodoroComplete'));
            }
            // Auto-start break se configurado
            if (this.autoStartBreaks) {
                setTimeout(() => this.start(), 1000);
            }
        }
        else {
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
    updateDisplay() {
        this.timerDisplay.textContent = formatTime(this.currentTime);
        this.updateProgressRing();
        const sessionTypeNames = {
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
    updateProgressRing() {
        if (!this.progressCircle)
            return;
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
        const progressCircleBg = document.querySelector('.progress-ring-circle-bg');
        if (progressCircleBg) {
            progressCircleBg.style.stroke = '#FF6347';
        }
    }
    getTotalTimeForCurrentSession() {
        if (this.currentSessionType === 'work') {
            return this.workDuration * 60;
        }
        else if (this.currentSessionType === 'shortBreak') {
            return this.shortBreak * 60;
        }
        else {
            return this.longBreak * 60;
        }
    }
    updateStats() {
        this.completedPomodorosDisplay.textContent = this.completedPomodoros.toString();
        this.totalTimeDisplay.textContent = formatDuration(this.totalTime);
        if (this.statsModal && this.statsModal.getAttribute('aria-hidden') === 'false') {
            this.updateStatsModal();
        }
    }
    updateGoalDisplay() {
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
    showNotification() {
        if (this.currentSessionType === 'work') {
            NotificationService.showBreakComplete();
        }
        else {
            NotificationService.showPomodoroComplete();
        }
    }
    saveSessionState() {
        if (!this.isRunning)
            return;
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
    loadSessionState() {
        const saved = StorageService.loadSessionState();
        if (!saved)
            return;
        try {
            const timeElapsed = Math.floor((Date.now() - saved.timestamp) / 1000);
            if (saved.workDuration)
                this.workDuration = saved.workDuration;
            if (saved.shortBreak)
                this.shortBreak = saved.shortBreak;
            if (saved.longBreak)
                this.longBreak = saved.longBreak;
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
                }
                else {
                    this.completeSession();
                }
            }
            else {
                StorageService.clearSessionState();
            }
        }
        catch (e) {
            Logger.error('Erro ao carregar estado da sessão:', e);
            StorageService.clearSessionState();
        }
    }
    saveSettings() {
        const settings = {
            workDuration: this.workDuration,
            shortBreak: this.shortBreak,
            longBreak: this.longBreak,
            soundEnabled: this.soundEnabled,
            autoStartBreaks: this.autoStartBreaks,
            autoStartPomodoros: this.autoStartPomodoros
        };
        StorageService.saveSettings(settings);
    }
    loadSettings() {
        const saved = StorageService.loadSettings();
        if (saved) {
            // Validar e sanitizar configurações carregadas
            const validationResult = validateSettings(saved);
            if (!validationResult.isValid) {
                Logger.warn('Configurações inválidas detectadas:', validationResult.error);
                // Sanitizar configurações inválidas
                const sanitized = sanitizeSettings(saved);
                this.workDuration = sanitized.workDuration || 25;
                this.shortBreak = sanitized.shortBreak || 5;
                this.longBreak = sanitized.longBreak || 15;
                this.soundEnabled = sanitized.soundEnabled !== undefined ? sanitized.soundEnabled : true;
                this.autoStartBreaks = sanitized.autoStartBreaks || false;
                this.autoStartPomodoros = sanitized.autoStartPomodoros || false;
                // Salvar configurações sanitizadas
                this.saveSettings();
            }
            else {
                this.workDuration = saved.workDuration || 25;
                this.shortBreak = saved.shortBreak || 5;
                this.longBreak = saved.longBreak || 15;
                this.soundEnabled = saved.soundEnabled !== undefined ? saved.soundEnabled : true;
                this.autoStartBreaks = saved.autoStartBreaks || false;
                this.autoStartPomodoros = saved.autoStartPomodoros || false;
            }
            SoundService.setEnabled(this.soundEnabled);
            if (saved.soundVolume !== undefined) {
                SoundService.setVolume(saved.soundVolume);
            }
        }
        this.workDurationInput.value = this.workDuration.toString();
        this.shortBreakInput.value = this.shortBreak.toString();
        this.longBreakInput.value = this.longBreak.toString();
        this.soundNotificationInput.checked = this.soundEnabled;
        // Limpar estados de validação ao carregar
        this.clearValidationError(this.workDurationInput);
        this.clearValidationError(this.shortBreakInput);
        this.clearValidationError(this.longBreakInput);
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
        StorageService.saveStats(stats);
    }
    loadStats() {
        const saved = StorageService.loadStats();
        if (saved) {
            this.completedPomodoros = saved.completedPomodoros || 0;
            this.totalTime = saved.totalTime || 0;
            this.sessionCount = saved.sessionCount || 0;
        }
        this.updateStats();
    }
    /**
     * Valida um input e mostra feedback visual
     */
    validateInput(input, validator) {
        const value = input.value.trim();
        // Se vazio, não validar ainda (aguardar blur)
        if (value === '') {
            return true;
        }
        const result = validator(value);
        const errorElement = document.getElementById(`${input.id}-error`);
        if (!result.isValid) {
            input.classList.add('invalid');
            if (errorElement) {
                errorElement.textContent = result.error || '';
                errorElement.classList.add('show');
            }
            return false;
        }
        else {
            input.classList.remove('invalid');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
            return true;
        }
    }
    /**
     * Valida e atualiza input em tempo real (durante digitação)
     */
    validateAndUpdateInput(input, validator, onValid) {
        const value = input.value.trim();
        // Se vazio, limpar validação mas não executar callback
        if (value === '') {
            this.clearValidationError(input);
            return;
        }
        const result = validator(value);
        const errorElement = document.getElementById(`${input.id}-error`);
        if (!result.isValid) {
            input.classList.add('invalid');
            if (errorElement) {
                errorElement.textContent = result.error || '';
                errorElement.classList.add('show');
            }
        }
        else {
            input.classList.remove('invalid');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
            // Executar callback apenas se válido
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue)) {
                onValid(numValue);
            }
        }
    }
    /**
     * Limpa estado de erro de validação
     */
    clearValidationError(input) {
        input.classList.remove('invalid');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
}
// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
//# sourceMappingURL=app.js.map