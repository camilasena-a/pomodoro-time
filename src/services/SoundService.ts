/**
 * Serviço para gerenciar sons e notificações sonoras
 */
export class SoundService {
    private static audioContext: AudioContext | null = null;
    private static enabled: boolean = true;
    private static volume: number = 0.3;
    private static soundType: string = 'default';

    static init(): void {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            }
        } catch (e) {
            console.warn('Web Audio API não disponível:', e);
        }
    }

    static setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    static setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    static setSoundType(type: string): void {
        this.soundType = type;
    }

    private static ensureAudioContext(): AudioContext | null {
        if (!this.audioContext) {
            this.init();
        }
        return this.audioContext;
    }

    static playCompleteSound(): void {
        if (!this.enabled || !this.audioContext) return;

        const context = this.ensureAudioContext();
        if (!context) return;

        try {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            // Som de conclusão (frequência ascendente)
            oscillator.frequency.setValueAtTime(600, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, context.currentTime + 0.3);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume, context.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.5);
        } catch (e) {
            console.warn('Erro ao reproduzir som:', e);
        }
    }

    static playStartSound(): void {
        if (!this.enabled || !this.audioContext) return;

        const context = this.ensureAudioContext();
        if (!context) return;

        try {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            // Som de início (frequência curta)
            oscillator.frequency.value = 400;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, context.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.2);
        } catch (e) {
            console.warn('Erro ao reproduzir som:', e);
        }
    }

    static playTickSound(): void {
        // Som de tick opcional durante contagem (muito sutil)
        // Implementação futura se necessário
    }

    static playWarningSound(): void {
        if (!this.enabled || !this.audioContext) return;

        const context = this.ensureAudioContext();
        if (!context) return;

        try {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            // Som de alerta (duas notas)
            oscillator.frequency.setValueAtTime(800, context.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, context.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);

            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.15);

            // Segunda nota após pequeno delay
            setTimeout(() => {
                const osc2 = context.createOscillator();
                const gain2 = context.createGain();
                osc2.connect(gain2);
                gain2.connect(context.destination);
                osc2.frequency.value = 1000;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(0, context.currentTime);
                gain2.gain.linearRampToValueAtTime(this.volume * 0.4, context.currentTime + 0.05);
                gain2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
                osc2.start(context.currentTime);
                osc2.stop(context.currentTime + 0.15);
            }, 200);
        } catch (e) {
            console.warn('Erro ao reproduzir som:', e);
        }
    }
}

// Inicializar quando o serviço é carregado
SoundService.init();
