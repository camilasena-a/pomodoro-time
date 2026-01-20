# ⚡ Quick Start - GitHub Pages

## 🚀 Deploy Rápido em 5 Passos

### 1️⃣ Preparar o Código
```bash
# Compilar TypeScript (se necessário)
npm install
npm run build
```

### 2️⃣ Inicializar Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### 3️⃣ Criar Repositório no GitHub
1. Acesse https://github.com/new
2. Crie um novo repositório (ex: `pomodoro-time`)
3. **NÃO** inicialize com README, .gitignore ou license

### 4️⃣ Conectar e Enviar
```bash
git remote add origin https://github.com/SEU_USUARIO/pomodoro-time.git
git branch -M main
git push -u origin main
```

### 5️⃣ Ativar GitHub Pages
1. Vá em **Settings** > **Pages**
2. Source: **main** branch, folder: **/ (root)**
3. Salve

### ✅ Pronto!
Acesse: `https://SEU_USUARIO.github.io/pomodoro-time/`

---

## 📋 Arquivos Necessários no Repositório

Certifique-se de que estes arquivos estão commitados:
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `script.js` (compilado do TypeScript)
- ✅ `.nojekyll` (criado automaticamente)

---

## ⚠️ Importante

O arquivo `script.js` **deve estar no repositório** para funcionar no GitHub Pages, pois o navegador precisa do JavaScript compilado.

Se você fez mudanças no `script.ts`, sempre execute `npm run build` antes de fazer commit!
