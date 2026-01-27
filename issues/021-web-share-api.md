# Adicionar Suporte a Web Share API

**Labels:** `enhancement`, `feature`, `mobile`, `social`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 2-3 horas

## 📋 Descrição

Adicionar suporte à Web Share API para permitir que usuários compartilhem suas conquistas, estatísticas e progresso diretamente do app usando o menu nativo de compartilhamento do dispositivo.

## ✅ Tarefas

- [ ] Verificar suporte à Web Share API
- [ ] Criar função para formatar mensagem de compartilhamento
- [ ] Adicionar botão de compartilhamento em conquistas
- [ ] Adicionar botão de compartilhamento em estatísticas
- [ ] Criar mensagens personalizadas para diferentes contextos
- [ ] Adicionar fallback para navegadores sem suporte
- [ ] Testar em diferentes dispositivos
- [ ] Adicionar opção de compartilhar meta diária completada
- [ ] Adicionar opção de compartilhar streak

## 🔧 Implementação

### Web Share Service

```typescript
class WebShareService {
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'share' in navigator;
  }

  async shareAchievement(achievement: Achievement): Promise<boolean> {
    if (!this.isSupported) {
      return this.fallbackShare(this.formatAchievementMessage(achievement));
    }

    const shareData = {
      title: '🍅 Conquista Desbloqueada!',
      text: this.formatAchievementMessage(achievement),
      url: window.location.href
    };

    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Erro ao compartilhar:', err);
      }
      return false;
    }
  }

  async shareStats(stats: UserStats): Promise<boolean> {
    if (!this.isSupported) {
      return this.fallbackShare(this.formatStatsMessage(stats));
    }

    const shareData = {
      title: '🍅 Meu Progresso no Pomodoro Timer',
      text: this.formatStatsMessage(stats),
      url: window.location.href
    };

    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Erro ao compartilhar:', err);
      }
      return false;
    }
  }

  private formatAchievementMessage(achievement: Achievement): string {
    return `🎉 Conquista desbloqueada: ${achievement.name}!\n\n${achievement.description}\n\n🍅 Pomodoro Timer`;
  }

  private formatStatsMessage(stats: UserStats): string {
    return `🍅 Meu progresso no Pomodoro Timer:\n\n` +
           `✅ ${stats.completedPomodoros} Pomodoros completos\n` +
           `⏱️ ${this.formatTime(stats.totalTime)} de foco\n` +
           `🔥 Streak: ${stats.currentStreak} dias\n\n` +
           `Baixe o app: ${window.location.href}`;
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  }

  private fallbackShare(text: string): boolean {
    // Fallback: copiar para clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      Toast.show('📋 Texto copiado para área de transferência!');
      return true;
    }
    return false;
  }

  isSupported(): boolean {
    return this.isSupported;
  }
}
```

### Integração na UI

```typescript
// No modal de conquistas
private setupAchievementShare(achievement: Achievement): void {
  const shareBtn = document.createElement('button');
  shareBtn.className = 'share-btn';
  shareBtn.innerHTML = '📤 Compartilhar';
  shareBtn.onclick = async () => {
    await this.webShareService.shareAchievement(achievement);
  };
  
  // Só mostrar se suportado ou se clipboard disponível
  if (this.webShareService.isSupported() || navigator.clipboard) {
    achievementElement.appendChild(shareBtn);
  }
}

// No modal de estatísticas
private setupStatsShare(): void {
  const shareBtn = document.getElementById('share-stats-btn');
  shareBtn?.addEventListener('click', async () => {
    const stats = StorageService.loadUserStats();
    await this.webShareService.shareStats(stats);
  });
}
```

## 🎯 Contextos de Compartilhamento

1. **Conquista desbloqueada**: Quando usuário ganha uma conquista
2. **Meta diária completada**: Quando completa meta do dia
3. **Streak alcançado**: Quando atinge novo recorde de streak
4. **Estatísticas gerais**: Botão manual no modal de estatísticas
5. **Milestone**: Quando completa X pomodoros (ex: 100, 500, 1000)

## 📁 Arquivos Afetados

- Criar `src/services/WebShareService.ts`
- `src/app.ts` (integrar com modais)
- `index.html` (adicionar botões de compartilhamento)
- `styles.css` (estilizar botões de compartilhamento)

## ⚠️ Limitações

- **Suporte limitado**: Principalmente mobile (iOS Safari, Chrome Android)
- **HTTPS obrigatório**: Requer contexto seguro
- **Fallback necessário**: Copiar para clipboard em navegadores sem suporte

## 📚 Referências

- [Web Share API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [Web Share API Spec](https://www.w3.org/TR/web-share/)
- [Can I Use - Web Share](https://caniuse.com/web-share-api)

## 💡 Notas

- Mensagens devem ser motivacionais e engajadoras
- Considerar adicionar emojis para tornar mais visual
- Testar em dispositivos reais (iOS e Android)
- Adicionar analytics para rastrear compartilhamentos (opcional)
