/**
 * Componente para exibir mensagens toast
 */
export class Toast {
    private static container: HTMLElement | null = null;

    static init(): void {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
    }

    static show(message: string, duration: number = 3000, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const styles: Record<string, string> = {
            background: type === 'success' ? 'var(--accent-primary)' : 
                       type === 'error' ? '#e74c3c' : 
                       type === 'warning' ? '#f39c12' : 
                       'var(--bg-primary)',
            color: type === 'success' ? '#fff' : 'var(--text-primary)',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-medium)',
            border: `1px solid ${type === 'success' ? 'transparent' : 'var(--border-subtle)'}`,
            fontSize: '14px',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
            cursor: 'pointer',
            maxWidth: '90vw',
            textAlign: 'center'
        };

        Object.assign(toast.style, styles);

        this.container!.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Auto remove
        const timeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);

        // Click to dismiss
        toast.addEventListener('click', () => {
            clearTimeout(timeout);
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        });
    }

    static success(message: string, duration?: number): void {
        this.show(message, duration, 'success');
    }

    static error(message: string, duration?: number): void {
        this.show(message, duration, 'error');
    }

    static warning(message: string, duration?: number): void {
        this.show(message, duration, 'warning');
    }

    static info(message: string, duration?: number): void {
        this.show(message, duration, 'info');
    }
}
