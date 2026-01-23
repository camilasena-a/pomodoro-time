import { PomodoroSettings, PomodoroStats, SessionState, SessionHistory, Task, DailyGoal, Achievement, UserStats } from '../types';

/**
 * Serviço para gerenciar armazenamento no LocalStorage
 */
export class StorageService {
    private static readonly KEYS = {
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

    // Settings
    static saveSettings(settings: PomodoroSettings): void {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.error('Erro ao salvar configurações:', e);
        }
    }

    static loadSettings(): PomodoroSettings | null {
        try {
            const saved = localStorage.getItem(this.KEYS.SETTINGS);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Erro ao carregar configurações:', e);
            return null;
        }
    }

    // Stats
    static saveStats(stats: PomodoroStats): void {
        try {
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
        } catch (e) {
            console.error('Erro ao salvar estatísticas:', e);
        }
    }

    static loadStats(): PomodoroStats | null {
        try {
            const saved = localStorage.getItem(this.KEYS.STATS);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Erro ao carregar estatísticas:', e);
            return null;
        }
    }

    // Session State
    static saveSessionState(state: SessionState): void {
        try {
            localStorage.setItem(this.KEYS.SESSION_STATE, JSON.stringify(state));
        } catch (e) {
            console.error('Erro ao salvar estado da sessão:', e);
        }
    }

    static loadSessionState(): SessionState | null {
        try {
            const saved = localStorage.getItem(this.KEYS.SESSION_STATE);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Erro ao carregar estado da sessão:', e);
            return null;
        }
    }

    static clearSessionState(): void {
        localStorage.removeItem(this.KEYS.SESSION_STATE);
    }

    // History
    static saveHistory(history: SessionHistory[]): void {
        try {
            // Manter apenas últimos 1000 registros para não exceder limite do localStorage
            const limitedHistory = history.slice(-1000);
            localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(limitedHistory));
        } catch (e) {
            console.error('Erro ao salvar histórico:', e);
        }
    }

    static loadHistory(): SessionHistory[] {
        try {
            const saved = localStorage.getItem(this.KEYS.HISTORY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Erro ao carregar histórico:', e);
            return [];
        }
    }

    static addToHistory(session: SessionHistory): void {
        const history = this.loadHistory();
        history.push(session);
        this.saveHistory(history);
    }

    // Tasks
    static saveTasks(tasks: Task[]): void {
        try {
            localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
        } catch (e) {
            console.error('Erro ao salvar tarefas:', e);
        }
    }

    static loadTasks(): Task[] {
        try {
            const saved = localStorage.getItem(this.KEYS.TASKS);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Erro ao carregar tarefas:', e);
            return [];
        }
    }

    // Daily Goal
    static saveDailyGoal(goal: DailyGoal): void {
        try {
            localStorage.setItem(this.KEYS.GOAL, JSON.stringify(goal));
        } catch (e) {
            console.error('Erro ao salvar meta diária:', e);
        }
    }

    static loadDailyGoal(): DailyGoal | null {
        try {
            const saved = localStorage.getItem(this.KEYS.GOAL);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Erro ao carregar meta diária:', e);
            return null;
        }
    }

    // Achievements
    static saveAchievements(achievements: Achievement[]): void {
        try {
            localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        } catch (e) {
            console.error('Erro ao salvar conquistas:', e);
        }
    }

    static loadAchievements(): Achievement[] {
        try {
            const saved = localStorage.getItem(this.KEYS.ACHIEVEMENTS);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Erro ao carregar conquistas:', e);
            return [];
        }
    }

    // User Stats (XP, Level)
    static saveUserStats(stats: UserStats): void {
        try {
            localStorage.setItem(this.KEYS.USER_STATS, JSON.stringify(stats));
        } catch (e) {
            console.error('Erro ao salvar estatísticas do usuário:', e);
        }
    }

    static loadUserStats(): UserStats | null {
        try {
            const saved = localStorage.getItem(this.KEYS.USER_STATS);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Erro ao carregar estatísticas do usuário:', e);
            return null;
        }
    }

    // Theme
    static saveTheme(theme: string): void {
        localStorage.setItem(this.KEYS.THEME, theme);
    }

    static loadTheme(): string {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    }

    // Export/Import
    static exportAllData(): string {
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

    static importAllData(json: string): boolean {
        try {
            const data = JSON.parse(json);
            
            if (data.settings) this.saveSettings(data.settings);
            if (data.stats) this.saveStats(data.stats);
            if (data.history) this.saveHistory(data.history);
            if (data.tasks) this.saveTasks(data.tasks);
            if (data.goal) this.saveDailyGoal(data.goal);
            if (data.achievements) this.saveAchievements(data.achievements);
            if (data.userStats) this.saveUserStats(data.userStats);
            if (data.theme) this.saveTheme(data.theme);
            
            return true;
        } catch (e) {
            console.error('Erro ao importar dados:', e);
            return false;
        }
    }

    static clearAllData(): void {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
}
