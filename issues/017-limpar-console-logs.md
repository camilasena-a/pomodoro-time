# Limpar Console.log do Código de Produção

**Labels:** `cleanup`, `code quality`, `production`  
**Prioridade:** 🟡 Média  
**Estimativa:** 2-3 horas

## 📋 Descrição

Remover ou substituir todos os `console.log`, `console.error` e `console.warn` do código de produção. Estes logs podem expor informações sensíveis e poluir o console do navegador em produção.

## ✅ Tarefas

- [ ] Identificar todos os console.log/error/warn no código
- [ ] Criar sistema de logging condicional (apenas em desenvolvimento)
- [ ] Substituir console.error por sistema de logging apropriado
- [ ] Remover console.log de debug do Service Worker
- [ ] Configurar build para remover logs em produção (opcional)
- [ ] Adicionar lint rule para prevenir console.log em produção
- [ ] Documentar sistema de logging para desenvolvedores

## 🔍 Arquivos Afetados

- `src/app.ts` (vários console.error)
- `src/services/StorageService.ts` (múltiplos console.error)
- `src/services/SoundService.ts` (console.warn)
- `sw.js` (console.log)
- `index.html` (console.log no registro do Service Worker)

## 🔧 Implementação

### Sistema de Logging Condicional

```typescript
class Logger {
  private static isDev = process.env.NODE_ENV === 'development' || 
                         window.location.hostname === 'localhost';
  
  static log(...args: any[]): void {
    if (this.isDev) {
      console.log('[Pomodoro]', ...args);
    }
  }
  
  static error(...args: any[]): void {
    // Sempre logar erros, mas de forma estruturada
    console.error('[Pomodoro Error]', ...args);
    // Opcional: enviar para serviço de monitoramento
  }
  
  static warn(...args: any[]): void {
    if (this.isDev) {
      console.warn('[Pomodoro]', ...args);
    }
  }
}
```

### Service Worker

```javascript
// Remover console.log ou usar Logger
// sw.js
const DEBUG = false; // ou detectar ambiente

function log(...args) {
  if (DEBUG) {
    console.log('[SW]', ...args);
  }
}
```

## 📝 Alternativas

1. **Usar biblioteca de logging** (ex: `loglevel`, `debug`)
2. **Build-time removal** com webpack/vite plugin
3. **Runtime detection** baseado em hostname/query param

## 💡 Notas

- Manter console.error para erros críticos (mas formatados)
- Considerar enviar erros críticos para serviço de monitoramento
- Documentar como ativar logs em desenvolvimento
- Adicionar flag `?debug=true` para ativar logs em produção (opcional)

## 🔗 Relacionado

- Issue #002: Remover código de debug temporário
- Issue #013: Tratamento de erros
