/**
 * Script para gerar ícones do Pomodoro Timer
 * 
 * Requer: npm install canvas
 * Uso: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Verificar se canvas está instalado
let Canvas;
try {
    Canvas = require('canvas');
} catch (e) {
    console.error('❌ Erro: O módulo "canvas" não está instalado.');
    console.log('\n📦 Para instalar, execute:');
    console.log('   npm install canvas');
    console.log('\n💡 Alternativa: Use o arquivo generate-icons.html no navegador.');
    process.exit(1);
}

// Função para desenhar o ícone do tomate
function drawTomatoIcon(ctx, size) {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    // Gradiente vermelho (tomate)
    const gradient = ctx.createRadialGradient(
        centerX - radius * 0.3, 
        centerY - radius * 0.3, 
        0,
        centerX, 
        centerY, 
        radius
    );
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#E74C3C');
    gradient.addColorStop(1, '#C0392B');
    
    // Desenhar círculo principal (tomate)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Adicionar brilho
    const highlightGradient = ctx.createRadialGradient(
        centerX - radius * 0.2, 
        centerY - radius * 0.3, 
        0,
        centerX - radius * 0.2, 
        centerY - radius * 0.3, 
        radius * 0.4
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.2, centerY - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = highlightGradient;
    ctx.fill();
    
    // Desenhar caule (verde no topo)
    ctx.fillStyle = '#27AE60';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - radius * 0.7, radius * 0.15, radius * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Adicionar folha pequena
    ctx.fillStyle = '#2ECC71';
    ctx.beginPath();
    ctx.ellipse(centerX + radius * 0.3, centerY - radius * 0.6, radius * 0.1, radius * 0.15, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
}

// Função para gerar um ícone
function generateIcon(size, filename) {
    const canvas = Canvas.createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    drawTomatoIcon(ctx, size);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`✅ Gerado: ${filename} (${size}x${size})`);
}

// Gerar todos os ícones
console.log('🍅 Gerando ícones do Pomodoro Timer...\n');

const icons = [
    { size: 16, filename: 'favicon-16x16.png' },
    { size: 32, filename: 'favicon-32x32.png' },
    { size: 180, filename: 'apple-touch-icon.png' },
    { size: 192, filename: 'icon-192.png' },
    { size: 512, filename: 'icon-512.png' }
];

icons.forEach(icon => {
    generateIcon(icon.size, icon.filename);
});

console.log('\n✨ Todos os ícones foram gerados com sucesso!');
console.log('\n📝 Próximos passos:');
console.log('   1. Os arquivos PNG foram criados na raiz do projeto');
console.log('   2. Crie um favicon.ico a partir do favicon-32x32.png (use um conversor online)');
console.log('   3. Os ícones já estão referenciados no index.html e manifest.json');
