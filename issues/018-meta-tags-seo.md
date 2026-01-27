# Adicionar Meta Tags Open Graph e Twitter Cards

**Labels:** `enhancement`, `seo`, `social`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1-2 horas

## 📋 Descrição

Adicionar meta tags Open Graph e Twitter Cards para melhorar compartilhamento em redes sociais e SEO. Quando alguém compartilhar o link do Pomodoro Timer, terá preview rico com imagem, título e descrição.

## ✅ Tarefas

- [ ] Adicionar meta tags Open Graph básicas
- [ ] Adicionar meta tags Twitter Cards
- [ ] Criar imagem de compartilhamento (og-image.png, 1200x630px)
- [ ] Adicionar meta tags para descrição e keywords
- [ ] Adicionar canonical URL
- [ ] Testar preview em Facebook Debugger
- [ ] Testar preview em Twitter Card Validator
- [ ] Adicionar meta tags dinâmicas (opcional - baseadas em estado)

## 🔧 Meta Tags Sugeridas

### Open Graph
```html
<meta property="og:title" content="Pomodoro Timer - Foco e Produtividade">
<meta property="og:description" content="Uma plataforma moderna para aplicar a técnica Pomodoro e aumentar sua produtividade">
<meta property="og:image" content="https://seu-usuario.github.io/pomodoro-time/og-image.png">
<meta property="og:url" content="https://seu-usuario.github.io/pomodoro-time/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Pomodoro Timer">
```

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Pomodoro Timer - Foco e Produtividade">
<meta name="twitter:description" content="Uma plataforma moderna para aplicar a técnica Pomodoro">
<meta name="twitter:image" content="https://seu-usuario.github.io/pomodoro-time/og-image.png">
```

### SEO Básico
```html
<meta name="description" content="...">
<meta name="keywords" content="pomodoro, timer, produtividade, foco, técnica pomodoro">
<link rel="canonical" href="https://seu-usuario.github.io/pomodoro-time/">
```

## 📁 Arquivos Afetados

- `index.html` (adicionar meta tags no `<head>`)
- Criar `og-image.png` (1200x630px)

## 🎨 Imagem de Compartilhamento

A imagem deve conter:
- Logo ou ícone do Pomodoro Timer
- Título do app
- Visual atrativo e profissional
- Formato: PNG ou JPG, 1200x630px

## 📚 Referências

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 💡 Notas

- Usar URL absoluta para imagens (não relativa)
- Testar em diferentes plataformas (Facebook, Twitter, LinkedIn, WhatsApp)
- Considerar criar versões dinâmicas das meta tags baseadas em conquistas/compartilhamento
