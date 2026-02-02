# 🍅 Instruções para Gerar Ícones do PWA

Este documento explica como gerar os ícones necessários para o Pomodoro Timer PWA.

## 📋 Ícones Necessários

O projeto precisa dos seguintes ícones:

- `favicon-16x16.png` - Favicon pequeno
- `favicon-32x32.png` - Favicon padrão
- `favicon.ico` - Favicon para navegadores antigos
- `apple-touch-icon.png` (180x180) - Ícone para iOS
- `icon-192.png` (192x192) - Ícone PWA pequeno
- `icon-512.png` (512x512) - Ícone PWA grande

## 🚀 Método 1: Gerador HTML (Recomendado - Mais Fácil)

1. Abra o arquivo `generate-icons.html` no seu navegador
2. Clique no botão "Gerar Todos os Ícones"
3. Os arquivos PNG serão baixados automaticamente
4. Para criar o `favicon.ico`, use um conversor online como:
   - https://convertio.co/png-ico/
   - https://www.favicon-generator.org/
   - Converta o arquivo `favicon-32x32.png` para `.ico`

## 🛠️ Método 2: Script Node.js (Avançado)

### Pré-requisitos

```bash
npm install canvas
```

### Executar

```bash
node generate-icons.js
```

Os ícones serão gerados automaticamente na raiz do projeto.

**Nota:** O módulo `canvas` requer dependências nativas. Se tiver problemas, use o Método 1.

## ✅ Verificação

Após gerar os ícones, verifique se todos os arquivos existem:

```bash
# Windows PowerShell
ls favicon*.png, apple-touch-icon.png, icon-*.png

# Linux/Mac
ls favicon*.png apple-touch-icon.png icon-*.png
```

## 📱 Testando a Instalação do PWA

1. Abra o `index.html` em um servidor local (não file://)
2. Abra as DevTools (F12)
3. Vá para a aba "Application" > "Manifest"
4. Verifique se todos os ícones aparecem corretamente
5. Teste a instalação usando o botão "Install" no Chrome/Edge

## 🔍 Troubleshooting

### Ícones não aparecem
- Verifique se os arquivos estão na raiz do projeto
- Verifique se o servidor está servindo os arquivos corretamente
- Limpe o cache do navegador (Ctrl+Shift+Delete)

### Service Worker não atualiza
- Vá em DevTools > Application > Service Workers
- Clique em "Unregister" e recarregue a página
- Ou use "Update" para forçar atualização

### Ícones aparecem quebrados
- Verifique se os arquivos PNG foram gerados corretamente
- Verifique se os caminhos no `index.html` e `manifest.json` estão corretos
- Verifique se os arquivos não estão corrompidos

## 📝 Notas

- Os ícones são gerados com um design de tomate (🍅) estilizado
- O design inclui gradientes e efeitos de brilho para melhor aparência
- Todos os ícones seguem o tema vermelho (#E74C3C) do aplicativo
