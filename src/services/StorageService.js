import { Logger } from '../utils/Logger';
import { validateSettings, sanitizeSettings } from '../utils/validationUtils';
/**
 * Serviço para gerenciar armazenamento no LocalStorage
 * Com fallback para armazenamento em memória quando LocalStorage não está disponível
 */
export class StorageService {
    /**
     * Verifica se LocalStorage está disponível e funcional
     */
    static isStorageAvailable() {
        if (this.storageAvailable !== null) {
            return this.storageAvailable;
        }
        try {
            const testKey = '__pomodoro_storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            this.storageAvailable = true;
            return true;
        }
        catch (e) {
            // LocalStorage não está disponível (modo privado, desabilitado, quota excedida, etc.)
            this.storageAvailable = false;
            // Mostrar aviso ao usuário apenas uma vez
            if (!this.storageWarningShown) {
                this.storageWarningShown = true;
                this.showStorageWarning();
            }
            return false;
        }
    }
    /**
     * Mostra aviso ao usuário sobre LocalStorage não disponível
     */
    static showStorageWarning() {
        // Aguardar DOM estar pronto
        if (typeof document !== 'undefined') {
            setTimeout(() => {
                const warning = document.createElement('div');
                warning.id = 'storage-warning';
                warning.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #FFA500;
                    color: #000;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 10000;
                    max-width: 350px;
                    font-size: 14px;
                    line-height: 1.5;
                `;
                warning.innerHTML = `
                    <strong>⚠️ Armazenamento Local Desabilitado</strong><br>
                    Seus dados não serão salvos permanentemente. 
                    Para salvar suas configurações e estatísticas, 
                    habilite o armazenamento local no seu navegador.
                    <button id="close-storage-warning" style="
                        margin-top: 10px;
                        padding: 5px 10px;
                        background: #000;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Entendi</button>
                `;
                document.body.appendChild(warning);
                const closeBtn = warning.querySelector('#close-storage-warning');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        warning.remove();
                    });
                }
                // Remover automaticamente após 10 segundos
                setTimeout(() => {
                    if (warning.parentNode) {
                        warning.remove();
                    }
                }, 10000);
            }, 1000);
        }
    }
    /**
     * Obtém valor do storage (LocalStorage ou memória)
     */
    static getItem(key) {
        if (this.isStorageAvailable()) {
            try {
                return localStorage.getItem(key);
            }
            catch (e) {
                Logger.error('Erro ao ler do LocalStorage:', e);
                // Fallback para memória em caso de erro
                return this.memoryStorage.get(key) || null;
            }
        }
        return this.memoryStorage.get(key) || null;
    }
    /**
     * Define valor no storage (LocalStorage ou memória)
     */
    static setItem(key, value) {
        if (this.isStorageAvailable()) {
            try {
                localStorage.setItem(key, value);
                return true;
            }
            catch (e) {
                // Tratar erro de quota excedida
                if (e.name === 'QuotaExceededError' || e.code === 22) {
                    Logger.warn('Quota do LocalStorage excedida. Limpando dados antigos...');
                    // Tentar limpar dados antigos e tentar novamente
                    try {
                        // Limpar histórico antigo (manter apenas últimos 100 registros)
                        const history = this.loadHistory();
                        if (history.length > 100) {
                            this.saveHistory(history.slice(-100));
                            localStorage.setItem(key, value);
                            return true;
                        }
                    }
                    catch (e2) {
                        Logger.error('Erro ao limpar dados antigos:', e2);
                    }
                    // Se ainda falhar, usar memória
                    this.memoryStorage.set(key, value);
                    return false;
                }
                Logger.error('Erro ao escrever no LocalStorage:', e);
                // Fallback para memória
                this.memoryStorage.set(key, value);
                return false;
            }
        }
        this.memoryStorage.set(key, value);
        return false;
    }
    /**
     * Remove item do storage
     */
    static removeItem(key) {
        if (this.isStorageAvailable()) {
            try {
                localStorage.removeItem(key);
            }
            catch (e) {
                Logger.error('Erro ao remover do LocalStorage:', e);
            }
        }
        this.memoryStorage.delete(key);
    }
    // Settings
    static saveSettings(settings) {
        try {
            const saved = this.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
            if (!saved && this.isStorageAvailable()) {
                Logger.warn('Configurações salvas apenas em memória devido a erro no LocalStorage');
            }
        }
        catch (e) {
            Logger.error('Erro ao salvar configurações:', e);
        }
    }
    static loadSettings() {
        try {
            const saved = this.getItem(this.KEYS.SETTINGS);
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
            this.setItem(this.KEYS.STATS, JSON.stringify(stats));
        }
        catch (e) {
            Logger.error('Erro ao salvar estatísticas:', e);
        }
    }
    static loadStats() {
        try {
            const saved = this.getItem(this.KEYS.STATS);
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
            this.setItem(this.KEYS.SESSION_STATE, JSON.stringify(state));
        }
        catch (e) {
            Logger.error('Erro ao salvar estado da sessão:', e);
        }
    }
    static loadSessionState() {
        try {
            const saved = this.getItem(this.KEYS.SESSION_STATE);
            return saved ? JSON.parse(saved) : null;
        }
        catch (e) {
            Logger.error('Erro ao carregar estado da sessão:', e);
            return null;
        }
    }
    static clearSessionState() {
        this.removeItem(this.KEYS.SESSION_STATE);
    }
    // History
    static saveHistory(history) {
        try {
            // Manter apenas últimos 1000 registros para não exceder limite do localStorage
            const limitedHistory = history.slice(-1000);
            this.setItem(this.KEYS.HISTORY, JSON.stringify(limitedHistory));
        }
        catch (e) {
            Logger.error('Erro ao salvar histórico:', e);
        }
    }
    static loadHistory() {
        try {
            const saved = this.getItem(this.KEYS.HISTORY);
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
            this.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
        }
        catch (e) {
            Logger.error('Erro ao salvar tarefas:', e);
        }
    }
    static loadTasks() {
        try {
            const saved = this.getItem(this.KEYS.TASKS);
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
            this.setItem(this.KEYS.GOAL, JSON.stringify(goal));
        }
        catch (e) {
            Logger.error('Erro ao salvar meta diária:', e);
        }
    }
    static loadDailyGoal() {
        try {
            const saved = this.getItem(this.KEYS.GOAL);
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
            this.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        }
        catch (e) {
            Logger.error('Erro ao salvar conquistas:', e);
        }
    }
    static loadAchievements() {
        try {
            const saved = this.getItem(this.KEYS.ACHIEVEMENTS);
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
            this.setItem(this.KEYS.USER_STATS, JSON.stringify(stats));
        }
        catch (e) {
            Logger.error('Erro ao salvar estatísticas do usuário:', e);
        }
    }
    static loadUserStats() {
        try {
            const saved = this.getItem(this.KEYS.USER_STATS);
            return saved ? JSON.parse(saved) : null;
        }
        catch (e) {
            Logger.error('Erro ao carregar estatísticas do usuário:', e);
            return null;
        }
    }
    // Theme
    static saveTheme(theme) {
        this.setItem(this.KEYS.THEME, theme);
    }
    static loadTheme() {
        return this.getItem(this.KEYS.THEME) || 'light';
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
            // Validar e sanitizar configurações antes de salvar
            if (data.settings) {
                const validationResult = validateSettings(data.settings);
                if (!validationResult.isValid) {
                    Logger.warn('Configurações inválidas na importação:', validationResult.error);
                    // Sanitizar configurações inválidas
                    const sanitized = sanitizeSettings(data.settings);
                    this.saveSettings(sanitized);
                }
                else {
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
        }
        catch (e) {
            Logger.error('Erro ao importar dados:', e);
            return false;
        }
    }
    static clearAllData() {
        Object.values(this.KEYS).forEach(key => {
            this.removeItem(key);
        });
    }
    /**
     * Verifica se o storage está disponível (público para uso externo)
     */
    static isAvailable() {
        return this.isStorageAvailable();
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
// Fallback: armazenamento em memória quando LocalStorage não está disponível
StorageService.memoryStorage = new Map();
StorageService.storageAvailable = null;
StorageService.storageWarningShown = false;
//# sourceMappingURL=StorageService.js.map