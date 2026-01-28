# Melhorar Navegação por Teclado e Acessibilidade

**Labels:** `enhancement`, `accessibility`, `a11y`, `ux`  
**Prioridade:** 🟡 Média  
**Estimativa:** 4-6 horas

## 📋 Descrição

Melhorar a navegação por teclado e acessibilidade geral do aplicativo para torná-lo totalmente utilizável sem mouse e compatível com leitores de tela.

## ✅ Tarefas

### Navegação por Teclado
- [ ] Adicionar indicadores visuais de foco (focus rings) em todos os elementos interativos
- [ ] Garantir ordem lógica de tabulação
- [ ] Adicionar skip links para pular para conteúdo principal
- [ ] Implementar atalhos de teclado documentados (Espaço, R, etc.)
- [ ] Garantir que modais possam ser fechados com ESC
- [ ] Adicionar suporte para navegação por setas em listas

### ARIA e Semântica
- [ ] Adicionar `aria-live` regions para atualizações do timer
- [ ] Melhorar labels ARIA em botões e controles
- [ ] Adicionar `role` apropriados onde necessário
- [ ] Adicionar `aria-describedby` para tooltips
- [ ] Garantir que modais tenham `aria-modal="true"`
- [ ] Adicionar `aria-label` em todos os botões de ícone

### Contraste e Visual
- [ ] Verificar contraste de cores (WCAG AA mínimo)
- [ ] Adicionar estados visuais claros (hover, focus, active)
- [ ] Garantir que informações não dependam apenas de cor
- [ ] Adicionar indicadores visuais além de ícones

### Testes
- [ ] Testar com NVDA (Windows)
- [ ] Testar com JAWS (Windows)
- [ ] Testar com VoiceOver (macOS/iOS)
- [ ] Testar navegação apenas com teclado
- [ ] Executar auditoria com axe DevTools
- [ ] Executar Lighthouse Accessibility audit

## 🔧 Implementação

### Exemplo: Melhorar Botões

```html
<!-- Antes -->
<button class="icon-btn" id="theme-toggle">
    <span class="icon">🌙</span>
</button>

<!-- Depois -->
<button 
    class="icon-btn" 
    id="theme-toggle"
    aria-label="Alternar tema claro/escuro"
    aria-pressed="false"
    title="Alternar tema (T)">
    <span class="icon" aria-hidden="true">🌙</span>
    <span class="sr-only">Alternar tema</span>
</button>
```

### Exemplo: Timer com ARIA Live

```html
<div 
    class="time" 
    id="timer" 
    aria-live="polite"
    aria-atomic="true"
    role="timer"
    aria-label="Tempo restante">
    25:00
</div>
```

### Exemplo: Skip Link

```html
<a href="#main-content" class="skip-link">
    Pular para conteúdo principal
</a>
```

```css
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
}

.skip-link:focus {
    top: 0;
}
```

## 📁 Arquivos Afetados

- `index.html` (adicionar ARIA, skip links)
- `styles.css` (estilos de foco, skip links)
- `script.ts` (gerenciar estados ARIA dinamicamente)

## 🎯 Padrões a Seguir

- **WCAG 2.1 Level AA** como mínimo
- **Navegação por teclado** completa
- **Leitores de tela** totalmente suportados
- **Contraste** mínimo 4.5:1 para texto normal

## 💡 Recursos

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## 📊 Impacto Esperado

- **Acessibilidade:** 100% de compatibilidade com leitores de tela
- **Usabilidade:** Navegação completa por teclado
- **Lighthouse Score:** 90+ em Accessibility
- **Conformidade:** WCAG 2.1 AA
