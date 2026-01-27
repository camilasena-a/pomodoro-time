# Documentar Atalhos de Teclado na UI

**Labels:** `enhancement`, `documentation`, `ux`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1-2 horas

## 📋 Descrição

Adicionar documentação visual dos atalhos de teclado disponíveis na interface do usuário. Atualmente os atalhos existem mas não são documentados, dificultando a descoberta pelos usuários.

## ✅ Tarefas

- [ ] Criar modal ou seção de ajuda com lista de atalhos
- [ ] Adicionar tooltip nos botões mostrando atalho correspondente
- [ ] Adicionar indicador visual de teclas (ex: `Space`, `R`, `1-3`)
- [ ] Criar página/seção "Atalhos" nas configurações
- [ ] Adicionar atalho para abrir ajuda (ex: `?` ou `H`)
- [ ] Adicionar overlay de atalhos ao pressionar `?`
- [ ] Testar acessibilidade dos tooltips
- [ ] Adicionar atalhos para abrir modais (opcional)

## 🔧 Implementação

### Modal de Ajuda

```typescript
private showKeyboardShortcutsHelp(): void {
  const shortcuts = [
    { key: 'Space', action: 'Iniciar/Pausar timer' },
    { key: 'R', action: 'Resetar timer' },
    { key: '1', action: 'Pomodoro (25min)' },
    { key: '2', action: 'Pausa Curta (5min)' },
    { key: '3', action: 'Pausa Longa (15min)' },
    { key: '?', action: 'Mostrar esta ajuda' },
    { key: 'Esc', action: 'Fechar modais' }
  ];

  // Criar e mostrar modal com lista de atalhos
}
```

### Tooltips com Atalhos

```html
<button class="side-btn" id="start-btn" aria-label="Iniciar timer">
  <span class="icon">▶</span>
  <span class="tooltip">Iniciar <kbd>Space</kbd></span>
</button>
```

### Overlay de Atalhos

```typescript
private setupShortcutsOverlay(): void {
  document.addEventListener('keydown', (e) => {
    if (e.key === '?' && !this.isTyping(e.target)) {
      e.preventDefault();
      this.toggleShortcutsOverlay();
    }
  });
}

private toggleShortcutsOverlay(): void {
  const overlay = document.getElementById('shortcuts-overlay');
  if (overlay) {
    overlay.classList.toggle('visible');
  }
}
```

## 🎨 Design Sugerido

### Modal de Ajuda
- Lista de atalhos em formato de tabela
- Ícones de teclas estilizados
- Agrupamento por categoria (Timer, Navegação, etc.)
- Fechar com `Esc` ou clique fora

### Tooltips
- Mostrar atalho abaixo do texto do tooltip
- Usar tag `<kbd>` para estilizar teclas
- Exemplo: "Iniciar timer `Space`"

### Overlay
- Overlay semi-transparente
- Lista de atalhos centralizada
- Fechar com `Esc` ou `?` novamente
- Animações suaves

## 📁 Arquivos Afetados

- `index.html` (adicionar modal de ajuda e tooltips)
- `src/app.ts` (lógica de overlay e modal)
- `styles.css` (estilizar modal, tooltips e teclas)

## 🎯 Atalhos Atuais

- `Space`: Iniciar/Pausar
- `R`: Resetar
- `1`: Pomodoro (25min)
- `2`: Pausa Curta (5min)
- `3`: Pausa Longa (15min)

## 💡 Atalhos Sugeridos para Adicionar

- `?` ou `H`: Mostrar ajuda
- `Esc`: Fechar modais
- `S`: Abrir configurações
- `T`: Abrir tarefas
- `G`: Abrir estatísticas
- `A`: Abrir conquistas

## 📚 Referências

- [Keyboard Shortcuts UX Patterns](https://www.nngroup.com/articles/keyboard-shortcuts/)
- [MDN KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)

## 💡 Notas

- Manter lista atualizada quando novos atalhos forem adicionados
- Considerar adicionar atalhos customizáveis no futuro
- Testar com leitores de tela para acessibilidade
- Adicionar opção para desabilitar tooltips (opcional)
