# Adicionar Suporte a Wake Lock API

**Labels:** `enhancement`, `feature`, `mobile`, `pwa`  
**Prioridade:** 🟡 Média  
**Estimativa:** 3-4 horas

## 📋 Descrição

Adicionar suporte à Wake Lock API para evitar que a tela do dispositivo desligue durante uma sessão de Pomodoro ativa. Isso é especialmente útil em dispositivos móveis onde a tela pode desligar automaticamente.

## ✅ Tarefas

- [ ] Verificar suporte à Wake Lock API
- [ ] Solicitar wake lock quando timer iniciar
- [ ] Liberar wake lock quando timer pausar/resetar/completar
- [ ] Tratar erros de permissão/limitações
- [ ] Adicionar opção nas configurações para ativar/desativar
- [ ] Adicionar indicador visual quando wake lock está ativo
- [ ] Testar em diferentes navegadores/dispositivos
- [ ] Adicionar fallback para navegadores sem suporte
- [ ] Documentar limitações e requisitos

## 🔧 Implementação

### Wake Lock Service

```typescript
class WakeLockService {
  private wakeLock: WakeLockSentinel | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'wakeLock' in navigator;
  }

  async requestWakeLock(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Wake Lock API não suportada');
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      
      // Escutar quando wake lock é liberado (ex: tela bloqueada manualmente)
      this.wakeLock.addEventListener('release', () => {
        console.log('Wake lock liberado');
        this.wakeLock = null;
      });

      return true;
    } catch (err) {
      console.error('Erro ao solicitar wake lock:', err);
      // Pode falhar se:
      // - Permissão negada
      // - Dispositivo não suporta
      // - Bateria baixa
      return false;
    }
  }

  async releaseWakeLock(): Promise<void> {
    if (this.wakeLock) {
      await this.wakeLock.release();
      this.wakeLock = null;
    }
  }

  isActive(): boolean {
    return this.wakeLock !== null;
  }

  isSupported(): boolean {
    return this.isSupported;
  }
}
```

### Integração com Timer

```typescript
// No PomodoroTimer
private wakeLockService = new WakeLockService();

async start(): Promise<void> {
  // ... código existente ...
  
  // Solicitar wake lock se habilitado nas configurações
  if (this.settings.wakeLockEnabled && this.wakeLockService.isSupported()) {
    await this.wakeLockService.requestWakeLock();
  }
}

async pause(): Promise<void> {
  // ... código existente ...
  
  // Liberar wake lock
  await this.wakeLockService.releaseWakeLock();
}

async reset(): Promise<void> {
  // ... código existente ...
  
  // Liberar wake lock
  await this.wakeLockService.releaseWakeLock();
}
```

### Tratamento de Eventos

```typescript
// Liberar wake lock quando página perder foco (opcional)
document.addEventListener('visibilitychange', async () => {
  if (document.hidden && this.wakeLockService.isActive()) {
    await this.wakeLockService.releaseWakeLock();
  }
});

// Solicitar novamente quando página voltar ao foco
document.addEventListener('visibilitychange', async () => {
  if (!document.hidden && this.isRunning && this.settings.wakeLockEnabled) {
    await this.wakeLockService.requestWakeLock();
  }
});
```

## ⚠️ Limitações e Considerações

- **Suporte limitado**: Apenas Chrome/Edge no Android e alguns navegadores mobile
- **Bateria**: Pode consumir mais bateria
- **Permissões**: Alguns navegadores podem solicitar permissão
- **Fallback**: Não é crítico - app funciona sem isso

## 🎯 Configurações

Adicionar checkbox nas configurações:
```html
<div class="setting-item">
  <label class="checkbox-label">
    <input type="checkbox" id="wake-lock-enabled">
    <span>Manter tela ligada durante Pomodoro (economiza bateria)</span>
  </label>
</div>
```

## 📁 Arquivos Afetados

- Criar `src/services/WakeLockService.ts`
- `src/app.ts` (integrar com timer)
- `index.html` (adicionar configuração)
- `src/types/index.ts` (adicionar tipo para settings)

## 📚 Referências

- [Wake Lock API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Wake_Lock_API)
- [Wake Lock API Spec](https://www.w3.org/TR/screen-wake-lock/)
- [Can I Use - Wake Lock](https://caniuse.com/wake-lock)

## 💡 Notas

- Adicionar aviso sobre consumo de bateria
- Considerar liberar wake lock automaticamente após X minutos de inatividade
- Adicionar indicador visual discreto quando ativo
- Testar em dispositivos reais (não apenas emuladores)
