# Remover Código de Debug Temporário

**Labels:** `bug`, `cleanup`  
**Prioridade:** 🔴 Alta  
**Estimativa:** 30 minutos

## 📋 Descrição

Existe um comentário de debug temporário no `script.js` (linha 416) que deve ser removido. Código de debug não deve estar em produção.

## 📁 Arquivos Afetados

- `script.js` (linha 416)

## ✅ Tarefas

- [ ] Localizar e remover comentários de debug
- [ ] Verificar se há outros códigos temporários no projeto
- [ ] Adicionar lint rule para prevenir código de debug em produção
- [ ] Verificar se há `console.log` ou `console.debug` desnecessários

## 🔍 Como Encontrar

```bash
# Buscar por comentários de debug
grep -r "Debug\|debug\|DEBUG\|TODO\|FIXME" --include="*.js" --include="*.ts"

# Buscar por console.log
grep -r "console\." --include="*.js" --include="*.ts"
```

## 📝 Notas

- Remover apenas código de debug, manter logs de erro importantes se necessário
- Considerar usar um sistema de logging adequado no futuro
- Adicionar regra ESLint para prevenir no futuro
