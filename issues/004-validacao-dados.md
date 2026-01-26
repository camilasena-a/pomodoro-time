# Adicionar Validação de Dados de Entrada

**Labels:** `enhancement`, `security`, `validation`  
**Prioridade:** 🔴 Alta  
**Estimativa:** 4-6 horas

## 📋 Descrição

Melhorar validação de inputs nas configurações para prevenir valores inválidos e melhorar experiência do usuário.

## ✅ Tarefas

- [ ] Validar duração mínima/máxima (ex: 1-120 minutos)
- [ ] Validar inputs de configurações em tempo real
- [ ] Adicionar mensagens de erro amigáveis
- [ ] Validar dados importados (JSON)
- [ ] Adicionar sanitização de inputs
- [ ] Adicionar feedback visual para inputs inválidos

## 📝 Regras de Validação Sugeridas

### Duração do Trabalho
- Mínimo: 1 minuto
- Máximo: 120 minutos
- Padrão: 25 minutos

### Pausa Curta
- Mínimo: 1 minuto
- Máximo: 30 minutos
- Padrão: 5 minutos

### Pausa Longa
- Mínimo: 1 minuto
- Máximo: 60 minutos
- Padrão: 15 minutos

## 🔧 Implementação

### Validação em Tempo Real
```typescript
// Exemplo de validação
function validateDuration(value: number, min: number, max: number): boolean {
  return value >= min && value <= max && Number.isInteger(value);
}
```

### Mensagens de Erro
- Usar Toast component para feedback
- Mensagens claras e específicas
- Indicar valores válidos

## 📁 Arquivos Afetados

- `src/app.ts` (validação de configurações)
- `index.html` (inputs de configuração)
- `src/services/StorageService.ts` (validação de dados importados)

## 💡 Notas

- Considerar usar biblioteca de validação (ex: Zod) se necessário
- Validar tanto no frontend quanto ao salvar
- Adicionar testes para validação
