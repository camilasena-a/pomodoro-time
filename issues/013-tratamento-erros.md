# Melhorar Tratamento de Erros

**Labels:** `enhancement`, `error handling`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1 dia

## 📋 Descrição

Adicionar tratamento de erros mais robusto e mensagens amigáveis ao usuário para melhorar experiência e debug.

## ✅ Tarefas

- [ ] Adicionar try-catch em operações críticas
- [ ] Criar sistema de logging de erros
- [ ] Adicionar mensagens de erro amigáveis
- [ ] Tratar erros de LocalStorage (quota excedida)
- [ ] Tratar erros de notificações (permissão negada)
- [ ] Adicionar fallbacks para recursos não disponíveis
- [ ] Criar classe ErrorHandler centralizada
- [ ] Adicionar telemetria de erros (opcional, respeitando privacidade)

## 🔧 Cenários de Erro

### LocalStorage
- Quota excedida
- Desabilitado no navegador
- Modo privado (alguns navegadores)

### Notificações
- Permissão negada
- Não suportado no navegador
- Bloqueado pelo sistema

### Service Worker
- Falha ao registrar
- Falha ao atualizar cache

### Outros
- Falha ao carregar Chart.js
- Erros de parsing JSON
- Erros de validação

## 📝 Implementação

### ErrorHandler
```typescript
class ErrorHandler {
  static handle(error: Error, context: string): void {
    console.error(`[${context}]`, error);
    // Log para serviço (opcional)
    // Mostrar mensagem amigável ao usuário
    Toast.error(this.getUserFriendlyMessage(error));
  }
  
  static getUserFriendlyMessage(error: Error): string {
    // Retornar mensagem amigável baseada no tipo de erro
  }
}
```

## 📁 Arquivos Afetados

- Criar `src/utils/ErrorHandler.ts`
- Atualizar serviços para usar ErrorHandler
- `src/app.ts` (tratamento de erros globais)

## 💡 Notas

- Não expor detalhes técnicos ao usuário
- Manter logs detalhados para desenvolvedores
- Considerar enviar erros críticos para serviço de monitoramento (opcional)
- Adicionar testes para cenários de erro
