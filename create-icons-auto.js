/**
 * Script para gerar ícones automaticamente usando Puppeteer
 * Abre o generate-icons.html e executa a geração dos ícones
 * 
 * Requer: npm install puppeteer
 * Uso: node create-icons-auto.js
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

console.log('🍅 Gerador Automático de Ícones do Pomodoro Timer\n');

// Verificar se Puppeteer está disponível
let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (e) {
    console.log('⚠️  Puppeteer não está instalado.');
    console.log('\n📦 Para instalar, execute:');
    console.log('   npm install puppeteer');
    console.log('\n💡 Alternativa: Use o arquivo generate-icons.html no navegador.');
    console.log('   Ou execute: npm install canvas && node generate-icons.js');
    process.exit(1);
}

async function generateIcons() {
    console.log('🚀 Iniciando geração de ícones...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Carregar o HTML do gerador
        const htmlPath = path.join(__dirname, 'generate-icons.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Injetar código para gerar e salvar os ícones automaticamente
        const modifiedHtml = htmlContent.replace(
            '</body>',
            `
    <script>
        // Função para converter canvas para blob e salvar
        async function saveCanvasAsFile(canvas, filename) {
            return new Promise((resolve) => {
                canvas.toBlob(function(blob) {
                    const reader = new FileReader();
                    reader.onload = function() {
                        const base64 = reader.result.split(',')[1];
                        // Enviar para Node.js via console
                        console.log('SAVE_ICON:' + filename + ':' + base64);
                        resolve();
                    };
                    reader.readAsDataURL(blob);
                }, 'image/png');
            });
        }
        
        // Aguardar página carregar e gerar todos os ícones
        window.addEventListener('load', async function() {
            console.log('Página carregada, gerando ícones...');
            
            const icons = [
                { size: 16, filename: 'favicon-16x16.png' },
                { size: 32, filename: 'favicon-32x32.png' },
                { size: 180, filename: 'apple-touch-icon.png' },
                { size: 192, filename: 'icon-192.png' },
                { size: 512, filename: 'icon-512.png' }
            ];
            
            for (const icon of icons) {
                const canvas = document.createElement('canvas');
                drawTomatoIcon(canvas, icon.size);
                await saveCanvasAsFile(canvas, icon.filename);
            }
            
            console.log('DONE_GENERATING');
        });
    </script>
</body>`
        );
        
        // Interceptar console.log para capturar os ícones
        const iconsData = {};
        let generating = true;
        
        page.on('console', async (msg) => {
            const text = msg.text();
            if (text.startsWith('SAVE_ICON:')) {
                const parts = text.split(':');
                const filename = parts[1];
                const base64 = parts[2];
                iconsData[filename] = base64;
                console.log(`✅ Gerado: ${filename}`);
            } else if (text === 'DONE_GENERATING') {
                generating = false;
            }
        });
        
        await page.setContent(modifiedHtml);
        
        // Aguardar geração completar
        while (generating) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Salvar os ícones
        for (const [filename, base64] of Object.entries(iconsData)) {
            const buffer = Buffer.from(base64, 'base64');
            fs.writeFileSync(filename, buffer);
        }
        
        console.log('\n✨ Todos os ícones foram gerados com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao gerar ícones:', error);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

generateIcons();
