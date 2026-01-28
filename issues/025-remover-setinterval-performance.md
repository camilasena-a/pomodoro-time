# Remover setInterval Problemático de Performance

**Labels:** `bug`, `performance`, `critical`  
**Prioridade:** 🔴 Alta  
**Estimativa:** 30 minutos

## 📋 Descrição

Existe um `setInterval` rodando a cada 100ms no `index.html` (linha 254) que aplica a cor vermelha aos círculos de progresso. Isso é extremamente ineficiente e causa problemas de performance, especialmente em dispositivos móveis.

## 🐛 Problema Atual

```javascript
// index.html linha 254
setInterval(applyTomatoRed, 100);
```

Este código executa 10 vezes por segundo, mesmo quando não há mudanças, causando:
- Consumo desnecessário de CPU
- Redução de bateria em dispositivos móveis
- Possível lag em animações
- Renderizações desnecessárias do DOM

## ✅ Tarefas

- [ ] Remover o `setInterval` problemático
- [ ] Aplicar cor vermelha apenas quando necessário (inicialização, mudança de tema, etc.)
- [ ] Usar CSS para definir cor padrão ao invés de JavaScript
- [ ] Verificar se há outros `setInterval` desnecessários no código
- [ ] Testar que a cor ainda é aplicada corretamente após remoção
- [ ] Medir melhoria de performance (antes/depois)

## 🔧 Solução Proposta

### Opção 1: Usar CSS (Recomendado)
Definir a cor diretamente no CSS:

```css
.progress-ring-circle,
.progress-ring-circle-bg {
  stroke: #FF6347 !important;
}
```

### Opção 2: Aplicar apenas quando necessário
Aplicar a cor apenas em momentos específicos:
- Quando a página carrega
- Quando o tema muda
- Quando o timer é inicializado

```javascript
// Aplicar apenas uma vez no carregamento
applyTomatoRed();

// Aplicar quando necessário (sem setInterval)
function onThemeChange() {
  applyTomatoRed();
}
```

## 📁 Arquivos Afetados

- `index.html` (linhas 232-254)
- `styles.css` (adicionar regras CSS se necessário)

## 🔍 Como Verificar

1. Abrir DevTools > Performance
2. Gravar antes da correção
3. Verificar quantas vezes `applyTomatoRed` é chamada
4. Repetir após correção
5. Comparar uso de CPU

## 💡 Notas

- Este é um problema crítico de performance
- A solução CSS é a mais eficiente
- Se precisar de JavaScript, usar eventos ao invés de polling
- Considerar usar MutationObserver se necessário detectar mudanças externas

## 📊 Impacto Esperado

- **Redução de CPU:** ~90% menos chamadas de função
- **Melhoria de bateria:** Especialmente em dispositivos móveis
- **Melhor performance:** Animações mais suaves
- **Menos renderizações:** DOM não é manipulado desnecessariamente
