# Adicionar Suporte a Gestos Touch (Mobile)

**Labels:** `enhancement`, `feature`, `mobile`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1-2 dias

## 📋 Descrição

Adicionar gestos touch para melhorar experiência mobile e tornar o app mais intuitivo em dispositivos touch.

## ✅ Tarefas

- [ ] Implementar swipe para iniciar/pausar
- [ ] Adicionar gesto de reset (swipe longo ou duplo toque)
- [ ] Adicionar feedback tátil (vibração) quando disponível
- [ ] Otimizar tamanho de botões para touch (mínimo 44x44px)
- [ ] Testar em diferentes dispositivos móveis
- [ ] Adicionar gestos para navegar entre modais (opcional)
- [ ] Melhorar área de toque dos controles

## 👆 Gestos Sugeridos

### Swipe para Iniciar/Pausar
- **Swipe para cima**: Iniciar timer
- **Swipe para baixo**: Pausar timer
- **Swipe longo**: Resetar timer

### Toque
- **Toque simples**: Ativar botão
- **Duplo toque**: Ação rápida (ex: reset)
- **Toque longo**: Menu contextual (opcional)

## 🔧 Implementação

### Touch Events
```typescript
class TouchGestureHandler {
  private startY: number = 0;
  
  handleTouchStart(e: TouchEvent): void {
    this.startY = e.touches[0].clientY;
  }
  
  handleTouchEnd(e: TouchEvent): void {
    const endY = e.changedTouches[0].clientY;
    const diff = this.startY - endY;
    
    if (Math.abs(diff) > 50) { // Threshold
      if (diff > 0) {
        // Swipe para cima - iniciar
        this.startTimer();
      } else {
        // Swipe para baixo - pausar
        this.pauseTimer();
      }
    }
  }
}
```

### Vibração
```typescript
if ('vibrate' in navigator) {
  navigator.vibrate(200); // 200ms
}
```

## 📁 Arquivos Afetados

- `src/app.ts` (handlers de touch)
- `styles.css` (tamanhos de botões para touch)
- Criar `src/utils/TouchGestureHandler.ts` (opcional)

## 📚 Referências

- Sugerido em `SUGESTOES_MELHORIAS.md` (#17)
- [Touch Events MDN](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Vibration API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

## 💡 Notas

- Garantir que gestos não conflitem com scroll
- Testar em iOS e Android
- Considerar diferentes tamanhos de tela
- Adicionar opção para desativar gestos (opcional)
