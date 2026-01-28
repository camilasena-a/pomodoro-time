/**
 * Sistema de logging condicional
 * Logs apenas em ambiente de desenvolvimento
 */
export class Logger {
    private static isDev = 
        typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost'));

    /**
     * Log de informações (apenas em desenvolvimento)
     */
    static log(...args: any[]): void {
        if (this.isDev) {
            console.log('[Pomodoro]', ...args);
        }
    }

    /**
     * Log de erros (sempre logado, mas formatado)
     */
    static error(...args: any[]): void {
        // Erros sempre devem ser logados para debug
        console.error('[Pomodoro Error]', ...args);
        // Em produção, poderia enviar para serviço de monitoramento
    }

    /**
     * Log de avisos (apenas em desenvolvimento)
     */
    static warn(...args: any[]): void {
        if (this.isDev) {
            console.warn('[Pomodoro]', ...args);
        }
    }

    /**
     * Log de debug (apenas em desenvolvimento)
     */
    static debug(...args: any[]): void {
        if (this.isDev) {
            console.debug('[Pomodoro Debug]', ...args);
        }
    }
}
