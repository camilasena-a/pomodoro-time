import { DailyGoal } from '../types';
import { StorageService } from './StorageService';
import { getDateString, isSameDay } from '../utils/timeUtils';

/**
 * Serviço para gerenciar metas diárias e streaks
 */
export class GoalService {
    private static goal: DailyGoal | null = null;

    static init(): void {
        this.goal = StorageService.loadDailyGoal();
        if (!this.goal) {
            this.goal = {
                targetPomodoros: 8,
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: '',
                todayPomodoros: 0
            };
            this.save();
        }
        this.updateStreak();
    }

    static getGoal(): DailyGoal {
        return this.goal!;
    }

    static setTargetPomodoros(target: number): void {
        if (!this.goal) this.init();
        this.goal!.targetPomodoros = Math.max(1, target);
        this.save();
    }

    static incrementTodayPomodoros(): void {
        if (!this.goal) this.init();
        
        const today = getDateString();
        
        // Se mudou o dia, resetar contador
        if (this.goal!.lastActiveDate !== today) {
            this.goal!.todayPomodoros = 0;
            this.goal!.lastActiveDate = today;
        }
        
        this.goal!.todayPomodoros++;
        this.updateStreak();
        this.save();
    }

    static getTodayPomodoros(): number {
        if (!this.goal) this.init();
        const today = getDateString();
        
        // Se mudou o dia, resetar contador
        if (this.goal!.lastActiveDate !== today) {
            this.goal!.todayPomodoros = 0;
            this.goal!.lastActiveDate = today;
            this.save();
        }
        
        return this.goal!.todayPomodoros;
    }

    static getProgress(): number {
        if (!this.goal) this.init();
        const progress = (this.getTodayPomodoros() / this.goal!.targetPomodoros) * 100;
        return Math.min(100, Math.max(0, progress));
    }

    static isGoalReached(): boolean {
        return this.getTodayPomodoros() >= this.goal!.targetPomodoros;
    }

    static getRemainingPomodoros(): number {
        return Math.max(0, this.goal!.targetPomodoros - this.getTodayPomodoros());
    }

    private static updateStreak(): void {
        if (!this.goal) return;

        const today = getDateString();
        const lastActive = this.goal.lastActiveDate;

        if (!lastActive) {
            // Primeira vez usando
            this.goal.currentStreak = 1;
            this.goal.longestStreak = 1;
            this.goal.lastActiveDate = today;
        } else {
            const lastDate = new Date(lastActive + 'T00:00:00');
            const todayDate = new Date(today + 'T00:00:00');
            const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Mesmo dia, manter streak
                // Não fazer nada
            } else if (daysDiff === 1) {
                // Dia consecutivo, incrementar streak
                this.goal.currentStreak++;
                if (this.goal.currentStreak > this.goal.longestStreak) {
                    this.goal.longestStreak = this.goal.currentStreak;
                }
                this.goal.lastActiveDate = today;
            } else {
                // Streak quebrado, resetar
                this.goal.currentStreak = 1;
                this.goal.lastActiveDate = today;
            }
        }
    }

    static getCurrentStreak(): number {
        if (!this.goal) this.init();
        this.updateStreak();
        return this.goal!.currentStreak;
    }

    static getLongestStreak(): number {
        if (!this.goal) this.init();
        return this.goal!.longestStreak;
    }

    private static save(): void {
        if (this.goal) {
            StorageService.saveDailyGoal(this.goal);
        }
    }
}

// Inicializar quando o serviço é carregado
GoalService.init();
