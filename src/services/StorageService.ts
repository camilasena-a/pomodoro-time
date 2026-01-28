import { PomodoroSettings, PomodoroStats, SessionState, SessionHistory, Task, DailyGoal, Achievement, UserStats } from '../types';
import { Logger } from '../utils/Logger';
import { validateSettings, sanitizeSettings } from '../utils/validationUtils';

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
            Logger.error('Erro ao salvar configurações:', e);
        }
    }

    static loadSettings(): PomodoroSettings | null {
        try {
            const saved = localStorage.getItem(this.KEYS.SETTINGS);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            Logger.error('Erro ao carregar configurações:', e);
            return null;
        }
    }

    // Stats
    static saveStats(stats: PomodoroStats): void {
        try {
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
        } catch (e) {
            Logger.error('Erro ao salvar estatísticas:', e);
        }
    }

    static loadStats(): PomodoroStats | null {
        try {
            const saved = localStorage.getItem(this.KEYS.STATS);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            Logger.error('Erro ao carregar estatísticas:', e);
            return null;
        }
    }

    // Session State
    static saveSessionState(state: SessionState): void {
        try {
            localStorage.setItem(this.KEYS.SESSION_STATE, JSON.stringify(state));
        } catch (e) {
            Logger.error('Erro ao salvar estado da sessão:', e);
        }
    }

    static loadSessionState(): SessionState | null {
        try {
            const saved = localStorage.getItem(this.KEYS.SESSION_STATE);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            Logger.error('Erro ao carregar estado da sessão:', e);
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
            Logger.error('Erro ao salvar histórico:', e);
        }
    }

    static loadHistory(): SessionHistory[] {
        try {
            const saved = localStorage.getItem(this.KEYS.HISTORY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            Logger.error('Erro ao carregar histórico:', e);
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
            Logger.error('Erro ao salvar tarefas:', e);
        }
    }

    static loadTasks(): Task[] {
        try {
            const saved = localStorage.getItem(this.KEYS.TASKS);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            Logger.error('Erro ao carregar tarefas:', e);
            return [];
        }
    }

    // Daily Goal
    static saveDailyGoal(goal: DailyGoal): void {
        try {
            localStorage.setItem(this.KEYS.GOAL, JSON.stringify(goal));
        } catch (e) {
            Logger.error('Erro ao salvar meta diária:', e);
        }
    }

    static loadDailyGoal(): DailyGoal | null {
        try {
            const saved = localStorage.getItem(this.KEYS.GOAL);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            Logger.error('Erro ao carregar meta diária:', e);
            return null;
        }
    }

    // Achievements
    static saveAchievements(achievements: Achievement[]): void {
        try {
            localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        } catch (e) {
            Logger.error('Erro ao salvar conquistas:', e);
        }
    }

    static loadAchievements(): Achievement[] {
        try {
            const saved = localStorage.getItem(this.KEYS.ACHIEVEMENTS);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            Logger.error('Erro ao carregar conquistas:', e);
            return [];
        }
    }

    // User Stats (XP, Level)
    static saveUserStats(stats: UserStats): void {
        try {
            localStorage.setItem(this.KEYS.USER_STATS, JSON.stringify(stats));
        } catch (e) {
            Logger.error('Erro ao salvar estatísticas do usuário:', e);
        }
    }

    static loadUserStats(): UserStats | null {
        try {
            const saved = localStorage.getItem(this.KEYS.USER_STATS);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            Logger.error('Erro ao carregar estatísticas do usuário:', e);
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
            
            // Validar e sanitizar configurações antes de salvar
            if (data.settings) {
                const validationResult = validateSettings(data.settings);
                if (!validationResult.isValid) {
                    Logger.warn('Configurações inválidas na importação:', validationResult.error);
                    // Sanitizar configurações inválidas
                    const sanitized = sanitizeSettings(data.settings);
                    this.saveSettings(sanitized);
                } else {
                    this.saveSettings(data.settings);
                }
            }
            
            // Validar outros dados básicos
            if (data.stats) {
                // Validar que stats é um objeto válido
                if (typeof data.stats === 'object' && data.stats !== null) {
                    this.saveStats(data.stats);
                }
            }
            
            if (data.history) {
                // Validar que history é um array
                if (Array.isArray(data.history)) {
                    this.saveHistory(data.history);
                }
            }
            
            if (data.tasks) {
                // Validar que tasks é um array
                if (Array.isArray(data.tasks)) {
                    this.saveTasks(data.tasks);
                }
            }
            
            if (data.goal) {
                // Validar que goal é um objeto válido
                if (typeof data.goal === 'object' && data.goal !== null) {
                    this.saveDailyGoal(data.goal);
                }
            }
            
            if (data.achievements) {
                // Validar que achievements é um array
                if (Array.isArray(data.achievements)) {
                    this.saveAchievements(data.achievements);
                }
            }
            
            if (data.userStats) {
                // Validar que userStats é um objeto válido
                if (typeof data.userStats === 'object' && data.userStats !== null) {
                    this.saveUserStats(data.userStats);
                }
            }
            
            if (data.theme) {
                // Validar que theme é 'light' ou 'dark'
                if (data.theme === 'light' || data.theme === 'dark') {
                    this.saveTheme(data.theme);
                }
            }
            
            return true;
        } catch (e) {
            Logger.error('Erro ao importar dados:', e);
            return false;
        }
    }

    static clearAllData(): void {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
}
