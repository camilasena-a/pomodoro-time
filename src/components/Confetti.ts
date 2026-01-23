/**
 * Componente para animação de confetti
 */
export class Confetti {
    static show(container?: HTMLElement): void {
        const targetContainer = container || document.body;
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        targetContainer.appendChild(confettiContainer);

        const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#e67e22', '#1abc9c'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = Math.random() * 2 + 2;
            const rotation = Math.random() * 360;
            
            confetti.style.cssText = `
                position: absolute;
                left: ${left}%;
                top: -10px;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 2px;
                animation: confettiFall ${duration}s ease-out ${delay}s forwards;
                transform: rotate(${rotation}deg);
            `;
            
            confettiContainer.appendChild(confetti);
        }

        // Adicionar keyframes se não existirem
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            confettiContainer.style.opacity = '0';
            setTimeout(() => confettiContainer.remove(), 500);
        }, 3000);
    }
}
