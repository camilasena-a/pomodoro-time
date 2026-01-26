# Implementar Modo Foco (Distraction-Free)

**Labels:** `enhancement`, `feature`, `ux`  
**Prioridade:** 🟡 Média  
**Estimativa:** 1 dia

## 📋 Descrição

Adicionar modo foco que oculta elementos não essenciais e permite tela cheia para máxima concentração durante as sessões de trabalho.

## ✅ Tarefas

- [ ] Adicionar botão para ativar modo foco na barra superior
- [ ] Implementar tela cheia usando Fullscreen API
- [ ] Ocultar controles não essenciais no modo foco
- [ ] Timer centralizado e maior no modo foco
- [ ] Adicionar atalho de teclado (ex: `F` para focus)
- [ ] Permitir sair do modo foco com ESC
- [ ] Adicionar indicador visual de modo foco ativo
- [ ] Salvar preferência de modo foco (opcional)

## 🎨 Design Sugerido

### Elementos a Ocultar
- Barra superior (exceto botão de sair do modo foco)
- Estatísticas mínimas
- Botões laterais de presets
- Marca d'água

### Elementos a Manter
- Timer (maior e centralizado)
- Botões principais (Iniciar, Pausar, Resetar)
- Informação de sessão atual

## 🔧 Implementação Técnica

### Fullscreen API
```typescript
// Entrar em modo foco
function enterFocusMode(): void {
  document.documentElement.requestFullscreen();
  document.body.classList.add('focus-mode');
}

// Sair do modo foco
function exitFocusMode(): void {
  document.exitFullscreen();
  document.body.classList.remove('focus-mode');
}
```

### CSS para Modo Foco
```css
.focus-mode .top-bar,
.focus-mode .stats-minimal,
.focus-mode .side-controls-right,
.focus-mode .watermark {
  display: none;
}

.focus-mode .timer-wrapper {
  transform: scale(1.2);
}
```

## 📁 Arquivos Afetados

- `src/app.ts` (lógica do modo foco)
- `styles.css` (estilos do modo foco)
- `index.html` (botão de ativação)

## 📚 Referências

- Sugerido em `SUGESTOES_MELHORIAS.md` (#12)
- [Fullscreen API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)

## 💡 Notas

- Considerar adicionar animação suave ao entrar/sair do modo
- Testar em diferentes navegadores (suporte varia)
- Adicionar fallback para navegadores sem suporte a Fullscreen API
