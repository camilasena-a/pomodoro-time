# Adicionar Mensagens Motivacionais

**Labels:** `enhancement`, `feature`, `ux`  
**Prioridade:** 🟡 Média  
**Estimativa:** 2-3 horas

## 📋 Descrição

Exibir mensagens motivacionais ao completar pomodoros para aumentar engajamento e motivação do usuário.

## ✅ Tarefas

- [ ] Criar lista de mensagens motivacionais variadas
- [ ] Exibir mensagem aleatória ao completar pomodoro
- [ ] Adicionar citações inspiradoras (opcional)
- [ ] Mostrar estatísticas motivadoras ("Você já focou X horas esta semana!")
- [ ] Integrar com Toast component existente
- [ ] Adicionar emojis para tornar mais visual
- [ ] Personalizar mensagens baseadas em conquistas (opcional)

## 💬 Exemplos de Mensagens

### Ao Completar Pomodoro
- "Excelente trabalho! 🎉"
- "Você está no caminho certo! 💪"
- "Mais um pomodoro conquistado! ⭐"
- "Foco incrível! Continue assim! 🔥"
- "Produtividade em alta! 🚀"

### Estatísticas Motivadoras
- "Você já completou X pomodoros hoje!"
- "X horas de foco esta semana! Incrível!"
- "Sua streak está em X dias! 🔥"
- "Você está X% da sua meta diária!"

## 🔧 Implementação

### Usar Utilitário Existente
O projeto já possui `src/utils/motivationalMessages.ts` - verificar e expandir se necessário.

### Integração
```typescript
// Ao completar pomodoro
const message = MotivationalMessages.getRandom();
Toast.success(message);

// Com estatísticas
const statsMessage = MotivationalMessages.getWithStats(stats);
Toast.info(statsMessage);
```

## 📁 Arquivos Afetados

- `src/utils/motivationalMessages.ts` (expandir lista)
- `src/app.ts` (integrar ao completar pomodoro)
- `src/components/Toast.ts` (já existe)

## 📚 Referências

- Sugerido em `SUGESTOES_MELHORIAS.md` (#14)

## 💡 Notas

- Não exagerar - mensagens devem ser motivadoras, não intrusivas
- Considerar adicionar opção para desativar mensagens
- Variar mensagens para não ficar repetitivo
- Personalizar baseado em contexto (primeiro pomodoro do dia, streak, etc.)
