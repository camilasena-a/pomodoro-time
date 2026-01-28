# Otimizar Renderizações e Atualizações do DOM

**Labels:** `enhancement`, `performance`, `optimization`  
**Prioridade:** 🟡 Média  
**Estimativa:** 1 dia

## 📋 Descrição

Otimizar atualizações do DOM para reduzir re-renderizações desnecessárias e melhorar performance geral, especialmente durante a execução do timer.

## 🔍 Problemas Identificados

1. Timer atualiza o DOM a cada segundo (pode ser otimizado)
2. Múltiplas atualizações simultâneas podem causar layout thrashing
3. Falta de debounce/throttle em algumas operações
4. Animações podem não usar `requestAnimationFrame`
5. Atualizações de estatísticas podem ser agrupadas

## ✅ Tarefas

### Otimizações de Timer
- [ ] Usar `requestAnimationFrame` para atualizações visuais do timer
- [ ] Agrupar múltiplas atualizações DOM em batch
- [ ] Usar `DocumentFragment` para inserções múltiplas
- [ ] Evitar reflow/repaint desnecessários

### Debounce/Throttle
- [ ] Adicionar debounce em salvamentos no LocalStorage
- [ ] Throttle em atualizações de progresso visual
- [ ] Debounce em eventos de resize
- [ ] Throttle em scroll events (se houver)

### Otimizações de Renderização
- [ ] Usar `will-change` CSS para elementos animados
- [ ] Usar `transform` e `opacity` para animações (GPU accelerated)
- [ ] Evitar mudanças em propriedades que causam reflow
- [ ] Usar `contain` CSS para isolamento de layout

### Virtualização (se necessário)
- [ ] Implementar virtualização para listas longas (histórico)
- [ ] Lazy loading de gráficos Chart.js
- [ ] Renderizar apenas itens visíveis

### Medição e Monitoramento
- [ ] Adicionar performance marks para medir melhorias
- [ ] Usar Performance API para medir renderizações
- [ ] Criar métricas antes/depois

## 🔧 Implementação

### Exemplo: Otimizar Atualização do Timer

```typescript
// Antes: Atualiza a cada segundo
setInterval(() => {
    this.updateDisplay();
    this.updateProgress();
    this.saveState();
}, 1000);

// Depois: Usar requestAnimationFrame
private lastUpdate = 0;
private updateLoop = () => {
    const now = performance.now();
    if (now - this.lastUpdate >= 1000) {
        this.updateDisplay();
        this.updateProgress();
        this.lastUpdate = now;
    }
    if (this.isRunning) {
        requestAnimationFrame(this.updateLoop);
    }
};
```

### Exemplo: Debounce em LocalStorage

```typescript
import { debounce } from './utils/debounce';

private saveStateDebounced = debounce(() => {
    this.saveSessionState();
}, 2000); // Salvar apenas a cada 2 segundos
```

### Exemplo: Batch Updates

```typescript
private updateStats() {
    // Usar DocumentFragment para atualizar múltiplos elementos
    const fragment = document.createDocumentFragment();
    
    // Preparar todas as mudanças
    const updates = [
        { element: this.completedPomodorosDisplay, value: this.completedPomodoros },
        { element: this.totalTimeDisplay, value: this.formatTime(this.totalTime) }
    ];
    
    // Aplicar todas de uma vez
    requestAnimationFrame(() => {
        updates.forEach(({ element, value }) => {
            element.textContent = value;
        });
    });
}
```

### Exemplo: CSS para Performance

```css
.progress-ring-circle {
    will-change: stroke-dashoffset;
    transform: translateZ(0); /* Force GPU acceleration */
}

.timer-wrapper {
    contain: layout style paint;
}
```

## 📁 Arquivos Afetados

- `script.ts` / `src/app.ts` (lógica do timer)
- `styles.css` (otimizações CSS)
- `src/utils/debounce.ts` (se não existir)
- Componentes que atualizam DOM frequentemente

## 🎯 Métricas de Sucesso

- **FPS:** Manter 60 FPS durante animações
- **CPU:** Redução de 30-50% no uso durante timer ativo
- **Bateria:** Melhor duração em dispositivos móveis
- **Lighthouse Performance:** Score 90+

## 💡 Boas Práticas

1. **Medir primeiro:** Usar Performance API antes de otimizar
2. **Otimizar o que importa:** Focar em operações frequentes
3. **Testar em dispositivos reais:** Especialmente móveis
4. **Manter código legível:** Não sacrificar legibilidade por micro-otimizações

## 📊 Impacto Esperado

- **Performance:** 30-50% melhoria em operações do timer
- **Bateria:** 20-30% menos consumo em dispositivos móveis
- **UX:** Animações mais suaves e responsivas
- **Escalabilidade:** Melhor performance com muitos dados históricos
