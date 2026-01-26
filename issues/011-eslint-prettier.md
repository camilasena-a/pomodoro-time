# Adicionar ESLint e Prettier

**Labels:** `enhancement`, `code quality`, `tooling`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 2-3 horas

## 📋 Descrição

Configurar linting e formatação automática para manter consistência de código e melhorar qualidade.

## ✅ Tarefas

- [ ] Instalar e configurar ESLint
- [ ] Instalar e configurar Prettier
- [ ] Adicionar regras TypeScript
- [ ] Adicionar regras de acessibilidade (eslint-plugin-jsx-a11y)
- [ ] Configurar pre-commit hook (Husky)
- [ ] Adicionar script `npm run lint` e `npm run format`
- [ ] Adicionar script `npm run lint:fix`
- [ ] Configurar integração com VS Code (opcional)
- [ ] Adicionar arquivo `.prettierrc` e `.eslintrc`

## 🔧 Configuração Sugerida

### ESLint
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### Prettier
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 4,
  "trailingComma": "es5"
}
```

## 📁 Arquivos Afetados

- Adicionar `.eslintrc.json`
- Adicionar `.prettierrc`
- Adicionar `.prettierignore`
- Atualizar `package.json` (scripts)

## 📚 Referências

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Husky Documentation](https://typicode.github.io/husky/)

## 💡 Notas

- Configurar para não conflitar com TypeScript compiler
- Considerar usar `eslint-config-prettier` para evitar conflitos
- Adicionar ao CI/CD quando implementado
- Formatar código existente uma vez ao adicionar
