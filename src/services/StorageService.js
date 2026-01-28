import { Logger } from '../utils/Logger';
/**
 * Serviço para gerenciar armazenamento no LocalStorage
 */
export class StorageService {
    // Settings
    static saveSettings(settings) {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
        }
        catch (e) {
            Logger.error('Erro ao salvar configurações:', e);
        }
    }
    static loadSettings() {
        try {
            const saved = localStorage.getItem(this.KEYS.SETTINGS);
            return saved ? JSON.parse(saved) : null;
        }
        catch (e) {
            Logger.error('Erro ao carregar configurações:', e);
            return null;
        }
    }
    // Stats
    static saveStats(stats) {
        try {
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
        }
        catch (e) {
            Logger.error('Erro ao salvar estatísticas:', e);
        }
    }
    static loadStats() {
        try {
            const saved = localStorage.getItem(this.KEYS.STATS);
            return saved ? JSON.parse(saved) : null;
        }
        catch (e) {
            Logger.error('Erro ao carregar estatísticas:', e);
            return null;
        }
    }
    // Session State
    static saveSessionState(state) {
        try {
            localStorage.setItem(this.KEYS.SESSION_STATE, JSON.stringify(state));
        }
        catch (e) {
            Logger.error('Erro ao salvar estado da sessão:', e);
        }
    }
    static loadSessionState() {
        try {
            const saved = localStorage.getItem(this.KEYS.SESSION_STATE);
            return saved ? JSON.parse(saved) : null;
        }
        catch (e) {
            Logger.error('Erro ao carregar estado da sessão:', e);
            return null;
        }
    }
    static clearSessionState() {
        localStorage.removeItem(this.KEYS.SESSION_STATE);
    }
    // History
    static saveHistory(history) {
        try {
            // Manter apenas últimos 1000 registros para não exceder limite do localStorage
            const limitedHistory = history.slice(-1000);
            localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(limitedHistory));
        }
        catch (e) {
            Logger.error('Erro ao salvar histórico:', e);
        }
    }
    static loadHistory() {
        try {
            const saved = localStorage.getItem(this.KEYS.HISTORY);
            return saved ? JSON.parse(saved) : [];
        }
        catch (e) {
            Logger.error('Erro ao carregar histórico:', e);
            return [];
        }
    }
    static addToHistory(session) {
        const history = this.loadHistory();
        history.push(session);
        this.saveHistory(history);
    }
    // Tasks
    static saveTasks(tasks) {
        try {
            localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
        }
        catch (e) {
            Logger.error('Erro ao salvar tarefas:', e);
        }
    }
    static loadTasks() {
        try {
            const saved = localStorage.getItem(this.KEYS.TASKS);
            return saved ? JSON.parse(saved) : [];
        }
        catch (e) {
            Logger.error('Erro ao carregar tarefas:', e);
            return [];
        }
    }
    // Daily Goal
    static saveDailyGoal(goal) {
        try {
            localStorage.setItem(this.KEYS.GOAL, JSON.stringify(goal));
        }
        catch (e) {
            Logger.error('Erro ao salvar meta diária:', e);
        }
    }
    static loadDailyGoal() {
        try {
            const saved = localStorage.getItem(this.KEYS.GOAL);
            return saved ? JSON.parse(saved) : null;
        }
        catch (e) {
            Logger.error('Erro ao carregar meta diária:', e);
            return null;
        }
    }
    // Achievements
    static saveAchievements(achievements) {
        try {
            localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        }
        catch (e) {
            Logger.error('Erro ao salvar conquistas:', e);
        }
    }
    static loadAchievements() {
        try {
            const saved = localStorage.getItem(this.KEYS.ACHIEVEMENTS);
            return saved ? JSON.parse(saved) : [];
        }
        catch (e) {
            Logger.error('Erro ao carregar conquistas:', e);
            return [];
        }
    }
    // User Stats (XP, Level)
    static saveUserStats(stats) {
        try {
            localStorage.setItem(this.KEYS.USER_STATS, JSON.stringify(stats));
        }
        catch (e) {
            Logger.error('Erro ao salvar estatísticas do usuário:', e);
        }
    }
    static loadUserStats() {
        try {
            const saved = localStorage.getItem(this.KEYS.USER_STATS);
            return saved ? JSON.parse(saved) : null;
        }
        catch (e) {
            Logger.error('Erro ao carregar estatísticas do usuário:', e);
            return null;
        }
    }
    // Theme
    static saveTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    }
    static loadTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    }
    // Export/Import
    static exportAllData() {
        return JSON.stringify({
            settings: this.loadSettings(),
            stats: this.loadStats(),
            history: this.loadHistory(),
            tasks: this.loadTasks(),
            goal: this.loadDailyGoal(),
            achievements: this.loadAchievements(),
            userStats: this.loadUserStats(),
            theme: this.loadTheme(),
            exportDate: new Date().toISOString()
        }, null, 2);
    }
    static importAllData(json) {
        try {
            const data = JSON.parse(json);
            if (data.settings)
                this.saveSettings(data.settings);
            if (data.stats)
                this.saveStats(data.stats);
            if (data.history)
                this.saveHistory(data.history);
            if (data.tasks)
                this.saveTasks(data.tasks);
            if (data.goal)
                this.saveDailyGoal(data.goal);
            if (data.achievements)
                this.saveAchievements(data.achievements);
            if (data.userStats)
                this.saveUserStats(data.userStats);
            if (data.theme)
                this.saveTheme(data.theme);
            return true;
        }
        catch (e) {
            Logger.error('Erro ao importar dados:', e);
            return false;
        }
    }
    static clearAllData() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
}
StorageService.KEYS = {
    SETTINGS: 'pomodoroSettings',
    STATS: 'pomodoroStats',
    SESSION_STATE: 'pomodoroSessionState',
    HISTORY: 'pomodoroHistory',
    TASKS: 'pomodoroTasks',
    GOAL: 'pomodoroDailyGoal',
    ACHIEVEMENTS: 'pomodoroAchievements',
    USER_STATS: 'pomodoroUserStats',
    THEME: 'pomodoroTheme'
};
//# sourceMappingURL=StorageService.js.map