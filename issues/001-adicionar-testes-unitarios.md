# Adicionar Testes Unitários

**Labels:** `enhancement`, `testing`, `good first issue`  
**Prioridade:** 🔴 Alta  
**Estimativa:** 1-2 dias

## 📋 Descrição

O projeto não possui nenhum teste unitário. Adicionar testes aumentaria a confiabilidade e facilitaria refatorações futuras.

## ✅ Tarefas

- [ ] Configurar framework de testes (Vitest ou Jest)
- [ ] Adicionar testes para lógica do timer (iniciar, pausar, resetar)
- [ ] Testar serviços (StorageService, HistoryService, GoalService)
- [ ] Testar cálculos de estatísticas
- [ ] Adicionar testes de integração para fluxos principais
- [ ] Configurar coverage mínimo (sugestão: 70%)

## 📝 Detalhes Técnicos

### Framework Recomendado
- **Vitest**: Rápido, compatível com TypeScript, API similar ao Jest
- **Jest**: Alternativa popular e bem documentada

### Áreas Prioritárias para Testar
1. **Lógica do Timer**
   - Iniciar timer
   - Pausar timer
   - Resetar timer
   - Transições entre sessões
   - Persistência de estado

2. **Serviços**
   - `StorageService`: Operações de LocalStorage
   - `HistoryService`: Armazenamento e recuperação de histórico
   - `GoalService`: Cálculo de metas e streaks
   - `TaskService`: CRUD de tarefas
   - `XPService`: Cálculo de XP e níveis

3. **Utilitários**
   - `timeUtils.ts`: Formatação de tempo
   - `dateUtils.ts`: Operações com datas
   - `debounce.ts`: Função debounce

## 📚 Referências

- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)

## 💡 Notas

- Esta é uma issue ideal para novos contribuidores (`good first issue`)
- Começar com testes simples e expandir gradualmente
- Focar em testes que aumentem confiança no código
