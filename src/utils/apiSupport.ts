/**
 * Utilitário para verificar suporte a APIs do navegador
 */

export class APISupport {
    /**
     * Verifica se a API de Notificações está disponível
     */
    static hasNotificationSupport(): boolean {
        return 'Notification' in window;
    }

    /**
     * Verifica se a API de Áudio está disponível
     */
    static hasAudioSupport(): boolean {
        return !!(window.AudioContext || (window as any).webkitAudioContext);
    }

    /**
     * Verifica se Service Worker está disponível
     */
    static hasServiceWorkerSupport(): boolean {
        return 'serviceWorker' in navigator;
    }

    /**
     * Verifica se LocalStorage está disponível
     */
    static hasLocalStorageSupport(): boolean {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifica se IndexedDB está disponível
     */
    static hasIndexedDBSupport(): boolean {
        return 'indexedDB' in window;
    }

    /**
     * Verifica se a API de Wake Lock está disponível
     */
    static hasWakeLockSupport(): boolean {
        return 'wakeLock' in navigator;
    }

    /**
     * Verifica se a API de Share está disponível
     */
    static hasShareSupport(): boolean {
        return 'share' in navigator;
    }

    /**
     * Retorna um objeto com o status de todas as APIs
     */
    static getAPISupportStatus(): {
        notifications: boolean;
        audio: boolean;
        serviceWorker: boolean;
        localStorage: boolean;
        indexedDB: boolean;
        wakeLock: boolean;
        share: boolean;
    } {
        return {
            notifications: this.hasNotificationSupport(),
            audio: this.hasAudioSupport(),
            serviceWorker: this.hasServiceWorkerSupport(),
            localStorage: this.hasLocalStorageSupport(),
            indexedDB: this.hasIndexedDBSupport(),
            wakeLock: this.hasWakeLockSupport(),
            share: this.hasShareSupport()
        };
    }

    /**
     * Retorna mensagens amigáveis sobre APIs não suportadas
     */
    static getUnsupportedAPIMessages(): string[] {
        const messages: string[] = [];
        const status = this.getAPISupportStatus();

        if (!status.notifications) {
            messages.push('Notificações do navegador não estão disponíveis neste navegador.');
        }

        if (!status.audio) {
            messages.push('Reprodução de áudio não está disponível neste navegador.');
        }

        if (!status.serviceWorker) {
            messages.push('Service Worker não está disponível. O app não funcionará offline.');
        }

        if (!status.localStorage) {
            messages.push('Armazenamento local não está disponível. Seus dados não serão salvos.');
        }

        return messages;
    }
}
