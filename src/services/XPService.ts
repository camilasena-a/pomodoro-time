import { UserStats } from '../types';
import { StorageService } from './StorageService';

/**
 * Serviço para gerenciar XP e níveis
 */
export class XPService {
    private static stats: UserStats | null = null;
    private static readonly XP_PER_POMODORO = 10;
    private static readonly XP_PER_STREAK_DAY = 5;
    private static readonly BASE_XP_FOR_LEVEL = 100;
    private static readonly XP_MULTIPLIER = 1.2; // Cada nível requer 20% mais XP

    static init(): void {
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

    static getStats(): UserStats {
        return this.stats!;
    }

    static addXP(amount: number): { leveledUp: boolean; newLevel?: number } {
        if (!this.stats) this.init();

        this.stats!.xp += amount;
        this.stats!.totalXP += amount;

        const leveledUp = this.stats!.xp >= this.stats!.xpToNextLevel;
        let newLevel: number | undefined;

        if (leveledUp) {
            newLevel = this.levelUp();
        }

        this.save();
        return { leveledUp, newLevel };
    }

    static addPomodoroXP(): { leveledUp: boolean; newLevel?: number } {
        return this.addXP(this.XP_PER_POMODORO);
    }

    static addStreakXP(): { leveledUp: boolean; newLevel?: number } {
        return this.addXP(this.XP_PER_STREAK_DAY);
    }

    private static levelUp(): number {
        if (!this.stats) return 1;

        // Calcular XP excedente
        const excessXP = this.stats.xp - this.stats.xpToNextLevel;
        
        // Subir de nível
        this.stats.level++;
        this.stats.xp = excessXP;

        // Calcular XP necessário para próximo nível
        this.updateXPToNextLevel();

        return this.stats.level;
    }

    private static updateXPToNextLevel(): void {
        if (!this.stats) return;

        // XP necessário = BASE_XP * (MULTIPLIER ^ (level - 1))
        const xpNeeded = Math.floor(
            this.BASE_XP_FOR_LEVEL * Math.pow(this.XP_MULTIPLIER, this.stats.level - 1)
        );
        this.stats.xpToNextLevel = xpNeeded;
    }

    static getLevelProgress(): number {
        if (!this.stats) this.init();
        const progress = (this.stats!.xp / this.stats!.xpToNextLevel) * 100;
        return Math.min(100, Math.max(0, progress));
    }

    static getLevel(): number {
        if (!this.stats) this.init();
        return this.stats!.level;
    }

    static getTotalXP(): number {
        if (!this.stats) this.init();
        return this.stats!.totalXP;
    }

    private static save(): void {
        if (this.stats) {
            StorageService.saveUserStats(this.stats);
        }
    }
}

// Inicializar quando o serviço é carregado
XPService.init();
