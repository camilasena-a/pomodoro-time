# 🚀 Deploy no GitHub Pages

## ✅ Compatibilidade

A plataforma Pomodoro Timer está **100% compatível** com GitHub Pages! 

Como é uma aplicação estática (HTML, CSS, JavaScript), funciona perfeitamente sem necessidade de servidor backend.

---

## 📋 Pré-requisitos

1. Conta no GitHub
2. Repositório criado no GitHub
3. Git instalado localmente

---

## 🔧 Passo a Passo para Deploy

### 1. Preparar o Repositório Local

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Pomodoro Timer"
```

### 2. Conectar com o Repositório Remoto

```bash
# Adicionar o repositório remoto (substitua USERNAME e REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Ou se usar SSH:
git remote add origin git@github.com:USERNAME/REPO_NAME.git
```

### 3. Compilar TypeScript (se necessário)

Se você fez alterações no `script.ts`, compile antes de fazer push:

```bash
npm install
npm run build
```

Isso garante que o `script.js` está atualizado.

### 4. Fazer Push para o GitHub

```bash
# Enviar código para o repositório
git push -u origin main

# Ou se sua branch for 'master':
git push -u origin master
```

### 5. Configurar GitHub Pages

1. Acesse seu repositório no GitHub
2. Vá em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione:
   - **Branch**: `main` (ou `master`)
   - **Folder**: `/ (root)`
5. Clique em **Save**

### 6. Acessar sua Aplicação

Após alguns minutos, sua aplicação estará disponível em:
```
https://USERNAME.github.io/REPO_NAME/
```

---

## 📁 Estrutura de Arquivos Necessários

Para funcionar no GitHub Pages, você precisa ter:

```
pomodoro-time/
├── index.html          ✅ (página principal)
├── styles.css          ✅ (estilos)
├── script.js           ✅ (JavaScript compilado)
├── script.ts           ✅ (TypeScript fonte - opcional)
├── README.md           ✅ (documentação)
└── .nojekyll           ✅ (criado automaticamente se necessário)
```

---

## 🔍 Verificações Importantes

### ✅ Caminhos Relativos
Todos os caminhos no HTML estão corretos:
- `styles.css` - ✅
- `script.js` - ✅

### ✅ Compatibilidade
- ✅ HTML5 válido
- ✅ CSS3 compatível
- ✅ JavaScript ES6+ (suportado por navegadores modernos)
- ✅ Sem dependências externas
- ✅ LocalStorage funciona (não precisa de servidor)

### ✅ TypeScript
- O `script.js` compilado deve estar presente
- O GitHub Pages serve arquivos estáticos, então o `.js` compilado é necessário

---

## 🛠️ Workflow Recomendado

### Para Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Compilar TypeScript em modo watch
npm run watch
```

### Para Deploy

```bash
# 1. Compilar TypeScript
npm run build

# 2. Verificar se script.js foi atualizado
git status

# 3. Adicionar mudanças
git add .

# 4. Commit
git commit -m "Update: Build TypeScript"

# 5. Push
git push origin main
```

---

## 🎯 GitHub Actions (Opcional - Automatização)

Você pode automatizar o build usando GitHub Actions. Crie `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build TypeScript
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## ⚠️ Problemas Comuns e Soluções

### Problema: Página não carrega
**Solução**: Verifique se o `index.html` está na raiz do repositório

### Problema: Estilos não aparecem
**Solução**: Verifique se o caminho `styles.css` está correto no HTML

### Problema: JavaScript não funciona
**Solução**: 
1. Verifique se `script.js` existe e está atualizado
2. Compile o TypeScript: `npm run build`
3. Verifique o console do navegador para erros

### Problema: Mudanças não aparecem
**Solução**: 
- GitHub Pages pode levar alguns minutos para atualizar
- Limpe o cache do navegador (Ctrl+F5)
- Verifique se fez push das mudanças

### Problema: TypeScript não compila
**Solução**:
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📝 Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] Código commitado e enviado para o GitHub
- [ ] GitHub Pages configurado (Settings > Pages)
- [ ] `script.js` compilado e presente no repositório
- [ ] `index.html` na raiz do repositório
- [ ] Caminhos relativos corretos
- [ ] Testado localmente antes do deploy

---

## 🎉 Resultado Final

Após seguir os passos acima, sua aplicação estará disponível publicamente em:

```
https://SEU_USUARIO.github.io/pomodoro-time/
```

A aplicação funcionará completamente:
- ✅ Timer Pomodoro
- ✅ Pausas configuráveis
- ✅ Estatísticas
- ✅ Modo escuro/claro
- ✅ Persistência de dados (LocalStorage)
- ✅ Notificações
- ✅ Responsivo

---

## 🔗 Links Úteis

- [Documentação GitHub Pages](https://docs.github.com/en/pages)
- [Guia de Deploy](https://docs.github.com/en/pages/getting-started-with-github-pages)
- [Configuração de Domínio Customizado](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

**Pronto para deploy!** 🚀
