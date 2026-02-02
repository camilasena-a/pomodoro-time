import { Logger } from '../utils/Logger';
/**
 * Serviço para gerenciar notificações do navegador
 */
export class NotificationService {
    /**
     * Verifica se notificações estão disponíveis
     */
    static isAvailable() {
        return this.isSupported;
    }
    /**
     * Obtém o status atual da permissão
     */
    static getPermissionStatus() {
        if (!this.isSupported) {
            return 'denied';
        }
        return Notification.permission;
    }
    /**
     * Solicita permissão para notificações
     */
    static async requestPermission() {
        if (!this.isSupported) {
            Logger.warn('API de Notificações não está disponível');
            return 'denied';
        }
        try {
            if (Notification.permission === 'default') {
                this.permission = await Notification.requestPermission();
            }
            else {
                this.permission = Notification.permission;
            }
        }
        catch (error) {
            Logger.error('Erro ao solicitar permissão de notificação:', error);
            this.permission = 'denied';
        }
        return this.permission;
    }
    /**
     * Mostra uma notificação
     */
    static async show(title, options) {
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
            }
            else if (permission === 'denied') {
                Logger.warn('Permissão de notificação foi negada pelo usuário');
                return false;
            }
            else {
                Logger.warn('Permissão de notificação ainda não foi definida');
                return false;
            }
        }
        catch (error) {
            Logger.error('Erro ao mostrar notificação:', error);
            return false;
        }
    }
    static showPomodoroComplete() {
        this.show('🍅 Pomodoro Timer', {
            body: 'Pomodoro completo! Hora de uma pausa.',
            tag: 'pomodoro-complete'
        });
    }
    static showBreakComplete() {
        this.show('🍅 Pomodoro Timer', {
            body: 'Pausa concluída! Hora de voltar ao trabalho.',
            tag: 'break-complete'
        });
    }
    static showGoalReached() {
        this.show('🎉 Meta Alcançada!', {
            body: 'Parabéns! Você alcançou sua meta diária!',
            tag: 'goal-reached'
        });
    }
    static showStreakMilestone(days) {
        this.show('🔥 Streak!', {
            body: `Incrível! ${days} dias consecutivos de produtividade!`,
            tag: 'streak-milestone'
        });
    }
}
NotificationService.permission = 'default';
NotificationService.isSupported = 'Notification' in window;
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
//# sourceMappingURL=NotificationService.js.map