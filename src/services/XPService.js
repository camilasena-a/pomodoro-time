import { StorageService } from './StorageService';
/**
 * Serviço para gerenciar XP e níveis
 */
export class XPService {
    static init() {
        this.stats = StorageService.loadUserStats();
        if (!this.stats) {
            this.stats = {
                level: 1,
                xp: 0,
                xpToNextLevel: this.BASE_XP_FOR_LEVEL,
                totalXP: 0
            };
            this.save();
        }
        this.updateXPToNextLevel();
    }
    static getStats() {
        return this.stats;
    }
    static addXP(amount) {
        if (!this.stats)
            this.init();
        this.stats.xp += amount;
        this.stats.totalXP += amount;
        const leveledUp = this.stats.xp >= this.stats.xpToNextLevel;
        let newLevel;
        if (leveledUp) {
            newLevel = this.levelUp();
        }
        this.save();
        return { leveledUp, newLevel };
    }
    static addPomodoroXP() {
        return this.addXP(this.XP_PER_POMODORO);
    }
    static addStreakXP() {
        return this.addXP(this.XP_PER_STREAK_DAY);
    }
    static levelUp() {
        if (!this.stats)
            return 1;
        // Calcular XP excedente
        const excessXP = this.stats.xp - this.stats.xpToNextLevel;
        // Subir de nível
        this.stats.level++;
        this.stats.xp = excessXP;
        // Calcular XP necessário para próximo nível
        this.updateXPToNextLevel();
        return this.stats.level;
    }
    static updateXPToNextLevel() {
        if (!this.stats)
            return;
        // XP necessário = BASE_XP * (MULTIPLIER ^ (level - 1))
        const xpNeeded = Math.floor(this.BASE_XP_FOR_LEVEL * Math.pow(this.XP_MULTIPLIER, this.stats.level - 1));
        this.stats.xpToNextLevel = xpNeeded;
    }
    static getLevelProgress() {
        if (!this.stats)
            this.init();
        const progress = (this.stats.xp / this.stats.xpToNextLevel) * 100;
        return Math.min(100, Math.max(0, progress));
    }
    static getLevel() {
        if (!this.stats)
            this.init();
        return this.stats.level;
    }
    static getTotalXP() {
        if (!this.stats)
            this.init();
        return this.stats.totalXP;
    }
    static save() {
        if (this.stats) {
            StorageService.saveUserStats(this.stats);
        }
    }
}
XPService.stats = null;
XPService.XP_PER_POMODORO = 10;
XPService.XP_PER_STREAK_DAY = 5;
XPService.BASE_XP_FOR_LEVEL = 100;
XPService.XP_MULTIPLIER = 1.2; // Cada nível requer 20% mais XP
// Inicializar quando o serviço é carregado
XPService.init();
//# sourceMappingURL=XPService.js.map