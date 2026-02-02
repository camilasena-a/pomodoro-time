# 🎨 Proposta de Design Minimalista - Pomodoro Timer

## 📐 Estrutura do Layout

### Layout Principal
```
┌─────────────────────────────────────────┐
│  [🌙]                    [⚙️] [📊] [ℹ️] │ ← Barra superior (ícones discretos)
│                                         │
│                                         │
│              ┌─────────┐               │
│              │         │               │
│              │  25:00  │               │ ← Timer central (foco total)
│              │         │               │
│              └─────────┘               │
│                                         │
│              Trabalho • Sessão 1       │ ← Info mínima
│                                         │
│  [▶] [⏸] [⏹]  [25] [5] [15]          │ ← Controles laterais discretos
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### Botões Laterais (Sempre Visíveis)
- **Esquerda**: Controles principais (Iniciar/Pausar, Resetar)
- **Direita**: Ações secundárias (Presets, Configurações, Estatísticas)
- **Topo**: Utilitários (Tema, Info)

## 🎯 Princípios de Design

### 1. Hierarquia Visual
- **Nível 1**: Timer (maior, mais proeminente)
- **Nível 2**: Controles essenciais (botões laterais)
- **Nível 3**: Informações contextuais (tooltips, stats discretas)

### 2. Espaçamento
- **Padding externo**: 40px (desktop) / 20px (mobile)
- **Espaçamento entre elementos**: Múltiplos de 8px (8, 16, 24, 32, 40)
- **Timer**: Centralizado com muito espaço ao redor (min 60px)

### 3. Tipografia
- **Timer**: 72px (desktop) / 48px (mobile) - Fonte monospace, peso 300
- **Labels**: 14px - Peso 400, cor secundária
- **Tooltips**: 12px - Peso 400
- **Família**: System fonts (SF Pro, Segoe UI, Roboto)

### 4. Cores Minimalistas
- **Primária**: Uma única cor de destaque (vermelho para trabalho)
- **Neutros**: Tons de cinza suaves
- **Background**: Branco puro / Preto puro (modo escuro)
- **Sem gradientes**: Apenas cores sólidas

### 5. Bordas e Sombras
- **Sem bordas visíveis**: Apenas em estados de hover/focus
- **Sombras sutis**: Apenas em elevação (botões, tooltips)
- **Border-radius**: 8px (consistente)

## 🎭 Comportamento de Hover

### Transições
- **Duração**: 200ms (rápido e responsivo)
- **Easing**: `ease-out` (natural)
- **Propriedades**: opacity, transform, background-color

### Animações Sutis
1. **Botões laterais**:
   - Hover: Escala 1.1x + opacidade 1.0
   - Normal: Escala 1.0 + opacidade 0.6
   - Focus: Outline sutil + escala 1.05x

2. **Tooltips**:
   - Aparecem após 300ms de hover (delay)
   - Fade in suave (opacity 0 → 1)
   - Posicionamento inteligente (evitar bordas)

3. **Timer**:
   - Pulso suave quando rodando (opacity 0.9 → 1.0)
   - Sem animações distraentes quando pausado

## ♿ Acessibilidade

### Navegação por Teclado
- **Tab**: Navega entre todos os elementos interativos
- **Enter/Space**: Ativa botão focado
- **Focus visible**: Outline claro e visível (2px, cor primária)
- **Skip links**: Para pular para conteúdo principal

### ARIA Labels
- Todos os botões com `aria-label` descritivo
- Tooltips como `aria-describedby`
- Estados dinâmicos com `aria-live="polite"`

### Contraste
- **Texto normal**: WCAG AA (4.5:1 mínimo)
- **Texto grande**: WCAG AA (3:1 mínimo)
- **Elementos interativos**: Contraste suficiente para identificação

## 📱 Componentes

### Botão Lateral
```html
<button class="side-btn" aria-label="Iniciar timer">
  <span class="icon">▶</span>
  <span class="tooltip">Iniciar</span>
</button>
```

**Estados**:
- Normal: Opacidade 0.6, escala 1.0
- Hover: Opacidade 1.0, escala 1.1, tooltip visível
- Focus: Outline, opacidade 1.0
- Active: Escala 0.95

### Tooltip
```html
<span class="tooltip">Texto do tooltip</span>
```

**Comportamento**:
- Posicionamento automático (top/bottom/left/right)
- Delay de 300ms antes de aparecer
- Fade in/out suave
- Desaparece ao sair do hover ou após 2s

### Estatísticas Discretas
- Apenas números visíveis
- Labels aparecem no hover
- Posicionamento: Canto inferior direito
- Tamanho reduzido quando não em foco

## 🎨 Paleta de Cores Minimalista

### Modo Claro
- Background: `#FFFFFF`
- Texto primário: `#1A1A1A`
- Texto secundário: `#6B6B6B`
- Cor de destaque: `#E74C3C` (vermelho pomodoro)
- Borda sutil: `#E5E5E5`

### Modo Escuro
- Background: `#0A0A0A`
- Texto primário: `#FFFFFF`
- Texto secundário: `#8B8B8B`
- Cor de destaque: `#FF6B6B` (vermelho mais claro)
- Borda sutil: `#2A2A2A`

## 📐 Grid e Alinhamento

### Layout Centralizado
- Timer: Centralizado vertical e horizontalmente
- Botões: Alinhados nas laterais (esquerda/direita)
- Estatísticas: Canto inferior direito
- Controles: Barra superior direita

### Responsividade
- **Desktop (>768px)**: Layout completo com botões laterais
- **Tablet (600-768px)**: Botões reorganizados abaixo do timer
- **Mobile (<600px)**: Botões em linha horizontal compacta

## ✨ Detalhes de Implementação

### Z-index Hierarchy
- Background: 0
- Conteúdo: 1
- Botões laterais: 10
- Tooltips: 100
- Modais/Overlays: 1000

### Performance
- Transições com `will-change` apenas quando necessário
- Tooltips renderizados sob demanda
- Animações com `transform` e `opacity` (GPU accelerated)
