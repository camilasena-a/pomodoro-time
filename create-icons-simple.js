/**
 * Script simples para criar ícones do PWA usando SVG
 * Este script cria arquivos SVG que podem ser usados diretamente ou convertidos para PNG
 * 
 * Uso: node create-icons-simple.js
 */

const fs = require('fs');
const path = require('path');

// Função para criar SVG do ícone do tomate
function createTomatoSVG(size) {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="tomatoGradient" cx="${centerX - radius * 0.3}" cy="${centerY - radius * 0.3}" r="${radius}">
      <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#E74C3C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C0392B;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="highlightGradient" cx="${centerX - radius * 0.2}" cy="${centerY - radius * 0.3}" r="${radius * 0.4}">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Círculo principal (tomate) -->
  <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="url(#tomatoGradient)" />
  
  <!-- Brilho -->
  <circle cx="${centerX - radius * 0.2}" cy="${centerY - radius * 0.3}" r="${radius * 0.4}" fill="url(#highlightGradient)" />
  
  <!-- Caule (verde no topo) -->
  <ellipse cx="${centerX}" cy="${centerY - radius * 0.7}" rx="${radius * 0.15}" ry="${radius * 0.25}" fill="#27AE60" />
  
  <!-- Folha pequena -->
  <ellipse cx="${centerX + radius * 0.3}" cy="${centerY - radius * 0.6}" rx="${radius * 0.1}" ry="${radius * 0.15}" 
           transform="rotate(-45 ${centerX + radius * 0.3} ${centerY - radius * 0.6})" fill="#2ECC71" />
</svg>`;
}

// Função para criar PNG usando data URL (requer conversão manual ou ferramenta externa)
// Por enquanto, vamos criar SVGs e instruir o usuário
function createIcons() {
    console.log('🍅 Criando ícones do Pomodoro Timer...\n');
    
    const icons = [
        { size: 16, filename: 'favicon-16x16.svg' },
        { size: 32, filename: 'favicon-32x32.svg' },
        { size: 180, filename: 'apple-touch-icon.svg' },
        { size: 192, filename: 'icon-192.svg' },
        { size: 512, filename: 'icon-512.svg' }
    ];
    
    icons.forEach(icon => {
        const svg = createTomatoSVG(icon.size);
        fs.writeFileSync(icon.filename, svg);
        console.log(`✅ Criado: ${icon.filename} (${icon.size}x${icon.size})`);
    });
    
    console.log('\n⚠️  NOTA: Os arquivos criados são SVG. Para PWA, você precisa de PNG.');
    console.log('\n📝 Opções para converter SVG para PNG:');
    console.log('   1. Use o arquivo generate-icons.html no navegador');
    console.log('   2. Instale canvas: npm install canvas (e execute generate-icons.js)');
    console.log('   3. Use uma ferramenta online de conversão SVG para PNG');
    console.log('   4. Use ImageMagick: magick convert icon-192.svg icon-192.png');
    console.log('\n💡 Alternativa rápida: Abra generate-icons.html no navegador e clique em "Gerar Todos os Ícones"');
}

// Tentar criar PNGs usando uma solução alternativa se possível
function tryCreatePNGs() {
    // Verificar se sharp está disponível (biblioteca leve para manipulação de imagens)
    try {
        const sharp = require('sharp');
        console.log('\n📦 Usando Sharp para criar PNGs...\n');
        
        const icons = [
            { size: 16, filename: 'favicon-16x16.png' },
            { size: 32, filename: 'favicon-32x32.png' },
            { size: 180, filename: 'apple-touch-icon.png' },
            { size: 192, filename: 'icon-192.png' },
            { size: 512, filename: 'icon-512.png' }
        ];
        
        icons.forEach(icon => {
            const svg = createTomatoSVG(icon.size);
            sharp(Buffer.from(svg))
                .png()
                .toFile(icon.filename)
                .then(() => {
                    console.log(`✅ Criado: ${icon.filename} (${icon.size}x${icon.size})`);
                })
                .catch(err => {
                    console.error(`❌ Erro ao criar ${icon.filename}:`, err.message);
                });
        });
        
        return true;
    } catch (e) {
        // Sharp não está disponível, continuar com SVG
        return false;
    }
}

// Executar
if (!tryCreatePNGs()) {
    createIcons();
}
