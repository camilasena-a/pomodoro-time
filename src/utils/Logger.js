/**
 * Sistema de logging condicional
 * Logs apenas em ambiente de desenvolvimento
 */
export class Logger {
    /**
     * Log de informações (apenas em desenvolvimento)
     */
    static log(...args) {
        if (this.isDev) {
            console.log('[Pomodoro]', ...args);
        }
    }
    /**
     * Log de erros (sempre logado, mas formatado)
     */
    static error(...args) {
        // Erros sempre devem ser logados para debug
        console.error('[Pomodoro Error]', ...args);
        // Em produção, poderia enviar para serviço de monitoramento
    }
    /**
     * Log de avisos (apenas em desenvolvimento)
     */
    static warn(...args) {
        if (this.isDev) {
            console.warn('[Pomodoro]', ...args);
        }
    }
    /**
     * Log de debug (apenas em desenvolvimento)
     */
    static debug(...args) {
        if (this.isDev) {
            console.debug('[Pomodoro Debug]', ...args);
        }
    }
}
Logger.isDev = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('localhost'));
//# sourceMappingURL=Logger.js.map