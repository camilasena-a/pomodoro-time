import { Logger } from '../utils/Logger';

/**
 * Serviço para gerenciar notificações do navegador
 */
export class NotificationService {
    private static permission: NotificationPermission = 'default';
    private static isSupported: boolean = 'Notification' in window;

    /**
     * Verifica se notificações estão disponíveis
     */
    static isAvailable(): boolean {
        return this.isSupported;
    }

    /**
     * Obtém o status atual da permissão
     */
    static getPermissionStatus(): NotificationPermission {
        if (!this.isSupported) {
            return 'denied';
        }
        return Notification.permission;
    }

    /**
     * Solicita permissão para notificações
     */
    static async requestPermission(): Promise<NotificationPermission> {
        if (!this.isSupported) {
            Logger.warn('API de Notificações não está disponível');
            return 'denied';
        }

        try {
            if (Notification.permission === 'default') {
                this.permission = await Notification.requestPermission();
            } else {
                this.permission = Notification.permission;
            }
        } catch (error) {
            Logger.error('Erro ao solicitar permissão de notificação:', error);
            this.permission = 'denied';
        }

        return this.permission;
    }

    /**
     * Mostra uma notificação
     */
    static async show(title: string, options?: NotificationOptions): Promise<boolean> {
        if (!this.isSupported) {
            Logger.warn('Tentativa de mostrar notificação, mas API não está disponível');
            return false;
        }

        try {
            const permission = await this.requestPermission();

            if (permission === 'granted') {
                new Notification(title, {
                    icon: '🍅',
                    badge: '🍅',
                    ...options
                });
                return true;
            } else if (permission === 'denied') {
                Logger.warn('Permissão de notificação foi negada pelo usuário');
                return false;
            } else {
                Logger.warn('Permissão de notificação ainda não foi definida');
                return false;
            }
        } catch (error) {
            Logger.error('Erro ao mostrar notificação:', error);
            return false;
        }
    }

    static showPomodoroComplete(): void {
        this.show('🍅 Pomodoro Timer', {
            body: 'Pomodoro completo! Hora de uma pausa.',
            tag: 'pomodoro-complete'
        });
    }

    static showBreakComplete(): void {
        this.show('🍅 Pomodoro Timer', {
            body: 'Pausa concluída! Hora de voltar ao trabalho.',
            tag: 'break-complete'
        });
    }

    static showGoalReached(): void {
        this.show('🎉 Meta Alcançada!', {
            body: 'Parabéns! Você alcançou sua meta diária!',
            tag: 'goal-reached'
        });
    }

    static showStreakMilestone(days: number): void {
        this.show('🔥 Streak!', {
            body: `Incrível! ${days} dias consecutivos de produtividade!`,
            tag: 'streak-milestone'
        });
    }
}

// Solicitar permissão quando o serviço é carregado (apenas se suportado)
if (NotificationService.isAvailable() && Notification.permission === 'default') {
    window.addEventListener('load', () => {
        // Aguardar um pouco antes de solicitar para não ser intrusivo
        setTimeout(() => {
            NotificationService.requestPermission().catch(err => {
                Logger.error('Erro ao solicitar permissão inicial:', err);
            });
        }, 1000);
    });
}
