# Adicionar Suporte a Dark Mode Automático (prefers-color-scheme)

**Labels:** `enhancement`, `feature`, `ux`  
**Prioridade:** 🟡 Média  
**Estimativa:** 2-3 horas

## 📋 Descrição

Atualmente o app tem toggle manual de tema. Adicionar detecção automática da preferência do sistema operacional usando `prefers-color-scheme` para melhorar UX e seguir padrões modernos.

## ✅ Tarefas

- [ ] Detectar preferência do sistema com `prefers-color-scheme`
- [ ] Aplicar tema automático no primeiro carregamento
- [ ] Permitir override manual (salvar preferência do usuário)
- [ ] Escutar mudanças dinâmicas de preferência do sistema
- [ ] Atualizar ícone do toggle baseado no tema atual
- [ ] Adicionar transição suave entre temas
- [ ] Testar em diferentes sistemas operacionais
- [ ] Documentar comportamento na UI (tooltip)

## 🔧 Implementação

### Detecção Inicial

```typescript
private detectSystemTheme(): 'light' | 'dark' {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

private initTheme(): void {
  const savedTheme = StorageService.loadTheme();
  const systemTheme = this.detectSystemTheme();
  
  // Usar tema salvo ou preferência do sistema
  const theme = savedTheme || systemTheme;
  this.applyTheme(theme);
}

private applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
  StorageService.saveTheme(theme);
  this.updateThemeIcon(theme);
}
```

### Escutar Mudanças Dinâmicas

```typescript
private setupThemeListener(): void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Escutar mudanças apenas se usuário não tiver preferência salva
  mediaQuery.addEventListener('change', (e) => {
    const savedTheme = StorageService.loadTheme();
    if (!savedTheme) {
      // Apenas aplicar se não houver preferência manual
      this.applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}
```

### Toggle Manual

```typescript
toggleTheme(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Salvar preferência manual (override do sistema)
  StorageService.saveTheme(newTheme);
  this.applyTheme(newTheme);
  
  // Mostrar toast informando que preferência foi salva
  Toast.show('Tema salvo como preferência');
}
```

## 🎯 Comportamento Esperado

1. **Primeiro acesso**: Usar preferência do sistema
2. **Após toggle manual**: Salvar preferência e ignorar sistema
3. **Mudança de sistema**: Aplicar apenas se não houver preferência salva
4. **Limpar preferência**: Botão "Usar tema do sistema" (opcional)

## 📁 Arquivos Afetados

- `src/app.ts` (lógica de tema)
- `src/services/StorageService.ts` (salvar/carregar tema)
- `index.html` (adicionar meta theme-color dinâmico)

## 💡 Melhorias Futuras

- Adicionar botão "Resetar para tema do sistema"
- Adicionar opção de "Seguir sistema sempre"
- Adicionar transição CSS suave entre temas
- Adicionar tema personalizado (cores customizáveis)

## 📚 Referências

- [prefers-color-scheme MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
