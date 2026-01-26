# Configurar Bundler (Webpack/Vite)

**Labels:** `enhancement`, `build`, `tooling`  
**Prioridade:** 🔧 Técnica  
**Estimativa:** 1-2 dias

## 📋 Descrição

Atualmente o projeto compila TypeScript diretamente. Configurar bundler permitiria usar a estrutura modular completa e otimizar o build.

## ✅ Tarefas

- [ ] Escolher bundler (Vite recomendado)
- [ ] Configurar build process
- [ ] Integrar todos os módulos da pasta `src/`
- [ ] Adicionar code splitting
- [ ] Otimizar bundle size
- [ ] Atualizar scripts npm
- [ ] Configurar hot reload para desenvolvimento
- [ ] Adicionar minificação e otimização para produção
- [ ] Atualizar documentação de build

## 🎯 Benefícios

- Usar estrutura modular completa
- Code splitting automático
- Hot Module Replacement (HMR)
- Otimizações automáticas
- Melhor performance

## 🔧 Vite vs Webpack

### Vite (Recomendado)
- ✅ Mais rápido em desenvolvimento
- ✅ Configuração mais simples
- ✅ Suporte nativo a TypeScript
- ✅ Otimizações automáticas

### Webpack
- ✅ Mais maduro e estável
- ✅ Mais plugins disponíveis
- ❌ Configuração mais complexa

## 📝 Configuração Vite

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '.',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
```

## 📁 Arquivos Afetados

- Criar `vite.config.ts` ou `webpack.config.js`
- Atualizar `package.json` (scripts)
- Atualizar `.gitignore`
- Atualizar `README.md` (instruções de build)

## 📚 Referências

- Mencionado em `INTEGRACAO_MELHORIAS.md`
- [Vite Documentation](https://vitejs.dev/)
- [Webpack Documentation](https://webpack.js.org/)

## 💡 Notas

- Manter compatibilidade com GitHub Pages
- Testar build de produção antes de fazer merge
- Considerar migração gradual se necessário
- Atualizar CI/CD quando implementado
