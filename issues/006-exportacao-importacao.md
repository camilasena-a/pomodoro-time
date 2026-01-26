# Melhorar Sistema de Exportação/Importação de Dados

**Labels:** `enhancement`, `feature`, `data`  
**Prioridade:** 🟡 Média  
**Estimativa:** 1 dia

## 📋 Descrição

Adicionar funcionalidade completa de exportação e importação de dados para permitir backup, migração e recuperação de dados do usuário.

## ✅ Tarefas

- [ ] Adicionar botão de exportação em configurações
- [ ] Gerar arquivo JSON com todos os dados (configurações, estatísticas, histórico, tarefas, conquistas)
- [ ] Adicionar botão de importação em configurações
- [ ] Validar formato JSON importado
- [ ] Adicionar preview antes de importar
- [ ] Adicionar opção de limpar dados antigos antes de importar
- [ ] Adicionar confirmação antes de sobrescrever dados
- [ ] Adicionar tratamento de erros (arquivo inválido, formato incorreto)
- [ ] Adicionar feedback de sucesso/erro

## 📦 Dados a Exportar

```typescript
interface ExportData {
  version: string;
  exportDate: number;
  settings: Settings;
  stats: Statistics;
  history: SessionHistory[];
  tasks: Task[];
  goals: GoalData;
  achievements: Achievement[];
  xp: XPData;
}
```

## 🔧 Implementação

### Exportação
```typescript
function exportData(): void {
  const data = {
    version: '1.0.0',
    exportDate: Date.now(),
    settings: getSettings(),
    stats: getStats(),
    history: HistoryService.getAll(),
    tasks: TaskService.getAll(),
    goals: GoalService.getData(),
    achievements: AchievementService.getAll(),
    xp: XPService.getData()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pomodoro-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}
```

### Importação
```typescript
function importData(file: File): Promise<boolean> {
  return file.text()
    .then(text => {
      const data = JSON.parse(text);
      // Validar estrutura
      if (!validateImportData(data)) {
        throw new Error('Formato inválido');
      }
      // Confirmar com usuário
      // Importar dados
      return true;
    });
}
```

## 📁 Arquivos Afetados

- `src/services/StorageService.ts` (métodos export/import)
- `src/app.ts` (botões e UI)
- `index.html` (inputs de arquivo)

## 📚 Referências

- Sugerido em `SUGESTOES_MELHORIAS.md` (#10)

## 💡 Notas

- Adicionar versão nos dados exportados para compatibilidade futura
- Considerar compressão se arquivos ficarem muito grandes
- Adicionar opção de exportar apenas dados específicos (ex: apenas histórico)
