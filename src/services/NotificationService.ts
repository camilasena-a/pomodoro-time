/**
 * Serviço para gerenciar notificações do navegador
 */
export class NotificationService {
    private static permission: NotificationPermission = 'default';

    static async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            return 'denied';
        }

        if (Notification.permission === 'default') {
            this.permission = await Notification.requestPermission();
        } else {
            this.permission = Notification.permission;
        }

        return this.permission;
    }

    static async show(title: string, options?: NotificationOptions): Promise<void> {
        if (!('Notification' in window)) {
            return;
        }

        const permission = await this.requestPermission();

        if (permission === 'granted') {
            new Notification(title, {
                icon: '🍅',
                badge: '🍅',
                ...options
            });
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

// Solicitar permissão quando o serviço é carregado
if ('Notification' in window && Notification.permission === 'default') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            NotificationService.requestPermission();
        }, 1000);
    });
}
