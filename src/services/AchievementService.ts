import { Achievement } from '../types';
import { StorageService } from './StorageService';
import { HistoryService } from './HistoryService';
import { GoalService } from './GoalService';
import { getDateString } from '../utils/timeUtils';

/**
 * Serviço para gerenciar conquistas
 */
export class AchievementService {
    private static achievements: Achievement[] = [];
    private static readonly ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
        {
            id: 'first-pomodoro',
            name: 'Primeiro Passo',
            description: 'Complete seu primeiro pomodoro',
            icon: '🏆',
            target: 1
        },
        {
            id: 'marathon',
            name: 'Maratona',
            description: 'Complete 10 pomodoros em um dia',
            icon: '🔥',
            target: 10
        },
        {
            id: 'consistency',
            name: 'Consistência',
            description: 'Mantenha um streak de 7 dias',
            icon: '📅',
            target: 7
        },
        {
            id: 'night-owl',
            name: 'Coruja Noturna',
            description: 'Complete pomodoros após 22h',
            icon: '🌙',
            target: 1
        },
        {
            id: 'centurion',
            name: 'Centenário',
            description: 'Complete 100 pomodoros no total',
            icon: '💯',
            target: 100
        },
        {
            id: 'early-bird',
            name: 'Madrugador',
            description: 'Complete pomodoros antes das 6h',
            icon: '🌅',
            target: 1
        },
        {
            id: 'week-warrior',
            name: 'Guerreiro Semanal',
            description: 'Complete 50 pomodoros em uma semana',
            icon: '⚔️',
            target: 50
        },
        {
            id: 'month-master',
            name: 'Mestre Mensal',
            description: 'Complete 200 pomodoros em um mês',
            icon: '👑',
            target: 200
        }
    ];

    static init(): void {
        this.achievements = StorageService.loadAchievements();
        this.initializeAchievements();
    }

    private static initializeAchievements(): void {
        // Adicionar conquistas que não existem ainda
        this.ACHIEVEMENT_DEFINITIONS.forEach(def => {
            const existing = this.achievements.find(a => a.id === def.id);
            if (!existing) {
                this.achievements.push({
                    ...def,
                    unlockedAt: undefined,
                    progress: 0
                });
            } else {
                // Garantir que tem todas as propriedades
                existing.name = def.name;
                existing.description = def.description;
                existing.icon = def.icon;
                existing.target = def.target;
            }
        });
        this.save();
    }

    static getAchievements(): Achievement[] {
        return [...this.achievements];
    }

    static getUnlockedAchievements(): Achievement[] {
        return this.achievements.filter(a => a.unlockedAt !== undefined);
    }

    static getLockedAchievements(): Achievement[] {
        return this.achievements.filter(a => a.unlockedAt === undefined);
    }

    static checkAchievements(): Achievement[] {
        const newlyUnlocked: Achievement[] = [];
        
        // Verificar cada conquista
        this.achievements.forEach(achievement => {
            if (achievement.unlockedAt) return; // Já desbloqueada

            let progress = achievement.progress || 0;
            let shouldUnlock = false;

            switch (achievement.id) {
                case 'first-pomodoro':
                    progress = HistoryService.getHistory().filter(s => s.type === 'work').length;
                    shouldUnlock = progress >= (achievement.target || 1);
                    break;

                case 'marathon':
                    const today = getDateString();
                    progress = HistoryService.getPomodorosByDate(today);
                    shouldUnlock = progress >= (achievement.target || 10);
                    break;

                case 'consistency':
                    progress = GoalService.getCurrentStreak();
                    shouldUnlock = progress >= (achievement.target || 7);
                    break;

                case 'night-owl':
                    const nightSessions = HistoryService.getHistory().filter(s => {
                        const date = new Date(s.completedAt);
                        return date.getHours() >= 22 && s.type === 'work';
                    });
                    progress = nightSessions.length;
                    shouldUnlock = progress >= (achievement.target || 1);
                    break;

                case 'centurion':
                    progress = HistoryService.getHistory().filter(s => s.type === 'work').length;
                    shouldUnlock = progress >= (achievement.target || 100);
                    break;

                case 'early-bird':
                    const earlySessions = HistoryService.getHistory().filter(s => {
                        const date = new Date(s.completedAt);
                        return date.getHours() < 6 && s.type === 'work';
                    });
                    progress = earlySessions.length;
                    shouldUnlock = progress >= (achievement.target || 1);
                    break;

                case 'week-warrior':
                    const weekStats = HistoryService.getWeeklyStats();
                    progress = weekStats.reduce((sum, day) => sum + day.pomodoros, 0);
                    shouldUnlock = progress >= (achievement.target || 50);
                    break;

                case 'month-master':
                    const monthStats = HistoryService.getMonthlyStats();
                    progress = monthStats.reduce((sum, day) => sum + day.pomodoros, 0);
                    shouldUnlock = progress >= (achievement.target || 200);
                    break;
            }

            achievement.progress = progress;

            if (shouldUnlock) {
                achievement.unlockedAt = Date.now();
                newlyUnlocked.push(achievement);
            }
        });

        if (newlyUnlocked.length > 0) {
            this.save();
        }

        return newlyUnlocked;
    }

    static unlockAchievement(id: string): void {
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.unlockedAt) {
            achievement.unlockedAt = Date.now();
            this.save();
        }
    }

    private static save(): void {
        StorageService.saveAchievements(this.achievements);
    }
}

// Inicializar quando o serviço é carregado
AchievementService.init();
