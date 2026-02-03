#!/usr/bin/env node

/**
 * Script multiplataforma para limpar arquivos compilados
 */

const fs = require('fs');
const path = require('path');

function removeFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Removed: ${filePath}`);
        }
    } catch (error) {
        console.warn(`Warning: Could not remove ${filePath}:`, error.message);
    }
}

function removeDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            return;
        }

        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                removeDirectory(filePath);
            } else {
                // Remove apenas arquivos compilados
                if (file.endsWith('.js') || 
                    file.endsWith('.js.map') || 
                    file.endsWith('.d.ts') || 
                    file.endsWith('.d.ts.map')) {
                    removeFile(filePath);
                }
            }
        });

        // Tenta remover diretório se estiver vazio
        try {
            const remainingFiles = fs.readdirSync(dirPath);
            if (remainingFiles.length === 0) {
                fs.rmdirSync(dirPath);
            }
        } catch (e) {
            // Ignora erros ao remover diretório
        }
    } catch (error) {
        console.warn(`Warning: Could not process directory ${dirPath}:`, error.message);
    }
}

console.log('🧹 Cleaning compiled files...\n');

// Remover arquivos na raiz
const rootFiles = [
    'script.d.ts',
    'script.d.ts.map',
    'script.js.map'
];

rootFiles.forEach(file => removeFile(file));

// Remover arquivos compilados em src/
if (fs.existsSync('src')) {
    removeDirectory('src');
}

console.log('\n✅ Clean completed!');
