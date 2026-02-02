# 🍅 Como Gerar os Ícones do PWA

Os ícones do PWA (`icon-192.png` e `icon-512.png`) são necessários para a instalação adequada do aplicativo.

## Opções para Gerar os Ícones

### Opção 1: Usar o Gerador HTML (Recomendado - Mais Fácil)

1. Abra o arquivo `generate-icons.html` no seu navegador
2. Clique no botão **"Gerar Todos os Ícones"**
3. Os arquivos PNG serão baixados automaticamente
4. Mova os arquivos para a raiz do projeto

### Opção 2: Usar o Script Node.js (Requer Canvas)

```bash
npm install canvas
node generate-icons.js
```

### Opção 3: Usar Puppeteer (Automático)

```bash
npm install puppeteer
node create-icons-auto.js
```

### Opção 4: Converter SVG para PNG Manualmente

1. Execute `node create-icons-simple.js` para gerar arquivos SVG
2. Use uma ferramenta online (como https://cloudconvert.com/svg-to-png) para converter:
   - `icon-192.svg` → `icon-192.png`
   - `icon-512.svg` → `icon-512.png`

### Opção 5: Criar Manualmente

Use qualquer editor de imagens para criar ícones de 192x192 e 512x512 pixels com o tema do tomate (🍅).

## Arquivos Necessários

Após gerar os ícones, você deve ter os seguintes arquivos na raiz do projeto:

- ✅ `icon-192.png` (192x192 pixels)
- ✅ `icon-512.png` (512x512 pixels)
- ✅ `favicon-16x16.png` (opcional)
- ✅ `favicon-32x32.png` (opcional)
- ✅ `apple-touch-icon.png` (opcional, para iOS)

## Verificação

Após gerar os ícones, verifique se eles existem:

```bash
# Windows PowerShell
Test-Path icon-192.png
Test-Path icon-512.png

# Linux/Mac
ls -la icon-*.png
```

## Nota

Os ícones são referenciados em:
- `manifest.json` (linhas 12 e 18)
- `sw.js` (linhas 14-15)
- `index.html` (linhas 13-18)
