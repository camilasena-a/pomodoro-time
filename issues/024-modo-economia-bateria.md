# Adicionar Modo de Economia de Bateria

**Labels:** `enhancement`, `feature`, `performance`, `mobile`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1 dia

## 📋 Descrição

Adicionar modo de economia de bateria que reduz animações, atualizações e recursos quando a bateria está baixa ou quando o usuário ativa o modo manualmente. Melhora experiência em dispositivos móveis e laptops.

## ✅ Tarefas

- [ ] Detectar nível de bateria usando Battery API (quando disponível)
- [ ] Detectar modo de economia do sistema
- [ ] Criar modo de economia manual nas configurações
- [ ] Reduzir animações quando em modo economia
- [ ] Reduzir frequência de atualizações do timer
- [ ] Desabilitar efeitos visuais pesados
- [ ] Reduzir qualidade de gráficos/visualizações
- [ ] Adicionar indicador visual do modo economia
- [ ] Testar impacto na bateria
- [ ] Documentar benefícios e limitações

## 🔧 Implementação

### Battery API Detection

```typescript
class BatteryService {
  private batteryLevel: number | null = null;
  private isCharging: boolean = false;
  private isLowBattery: boolean = false;

  async init(): Promise<void> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.batteryLevel = battery.level;
        this.isCharging = battery.charging;
        this.isLowBattery = battery.level < 0.2; // 20%

        battery.addEventListener('levelchange', () => {
          this.batteryLevel = battery.level;
          this.isLowBattery = battery.level < 0.2;
          this.onBatteryChange();
        });

        battery.addEventListener('chargingchange', () => {
          this.isCharging = battery.charging;
        });
      } catch (err) {
        console.warn('Battery API não disponível:', err);
      }
    }
  }

  private onBatteryChange(): void {
    // Notificar app sobre mudança de bateria
    if (this.isLowBattery && !this.isCharging) {
      this.enablePowerSavingMode();
    }
  }

  shouldEnablePowerSaving(): boolean {
    return this.isLowBattery && !this.isCharging;
  }
}
```

### Power Saving Mode

```typescript
class PowerSavingMode {
  private isActive: boolean = false;
  private settings: PowerSavingSettings;

  enable(): void {
    this.isActive = true;
    document.documentElement.setAttribute('data-power-saving', 'true');
    this.applySettings();
    Toast.show('🔋 Modo economia de bateria ativado');
  }

  disable(): void {
    this.isActive = false;
    document.documentElement.removeAttribute('data-power-saving');
    this.restoreSettings();
  }

  private applySettings(): void {
    // Reduzir animações
    document.documentElement.style.setProperty('--animation-duration', '0s');
    
    // Reduzir atualizações do timer (de 1s para 5s)
    this.settings.timerUpdateInterval = 5000;
    
    // Desabilitar efeitos visuais
    this.settings.enableConfetti = false;
    this.settings.enableParticles = false;
    
    // Reduzir qualidade de gráficos
    this.settings.chartQuality = 'low';
  }

  private restoreSettings(): void {
    document.documentElement.style.removeProperty('--animation-duration');
    // Restaurar outras configurações
  }
}
```

### CSS para Modo Economia

```css
[data-power-saving="true"] * {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}

[data-power-saving="true"] .progress-ring-circle {
  /* Simplificar animação do círculo */
  animation: none;
}

[data-power-saving="true"] .confetti {
  display: none;
}
```

### Detecção de Modo do Sistema

```typescript
private detectSystemPowerSaving(): boolean {
  // Detectar modo economia do sistema (quando disponível)
  if ('getBattery' in navigator) {
    // Já detectado via Battery API
    return this.batteryService.shouldEnablePowerSaving();
  }
  
  // Fallback: detectar via media query (quando disponível)
  if (window.matchMedia) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return true;
    }
  }
  
  return false;
}
```

## 🎯 Configurações

### Automático
- Ativar quando bateria < 20% e não está carregando
- Ativar quando sistema está em modo economia

### Manual
- Checkbox nas configurações: "Modo economia de bateria"
- Checkbox: "Ativar automaticamente quando bateria baixa"

## 📁 Arquivos Afetados

- Criar `src/services/BatteryService.ts`
- Criar `src/services/PowerSavingMode.ts`
- `src/app.ts` (integrar detecção e modo)
- `styles.css` (estilos para modo economia)
- `index.html` (adicionar configurações)

## ⚠️ Limitações

- **Battery API**: Suporte limitado (Chrome/Edge principalmente)
- **Precisão**: Nível de bateria pode não estar sempre disponível
- **Fallback**: Usar modo manual quando API não disponível

## 🎨 Indicador Visual

Adicionar ícone discreto quando modo economia está ativo:
```html
<div class="power-saving-indicator" id="power-saving-indicator" style="display: none;">
  🔋 Modo Economia
</div>
```

## 📚 Referências

- [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API) (deprecated, mas ainda funcional)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Power Saving Best Practices](https://web.dev/power-saving/)

## 💡 Notas

- Modo economia não deve degradar funcionalidade crítica
- Manter timer funcionando normalmente (apenas menos atualizações visuais)
- Considerar adicionar opção "Sempre usar modo economia"
- Testar impacto real na bateria em dispositivos reais
- Adicionar métricas de economia (opcional)
