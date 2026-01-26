# Adicionar Ícones Reais para PWA

**Labels:** `enhancement`, `pwa`, `design`  
**Prioridade:** 🟡 Média  
**Estimativa:** 2-3 horas

## 📋 Descrição

O `manifest.json` referencia ícones (`icon-192.png`, `icon-512.png`) que podem não existir. Criar ícones adequados para melhorar a experiência de instalação do PWA.

## ✅ Tarefas

- [ ] Criar ícones em múltiplos tamanhos (192x192, 512x512)
- [ ] Adicionar ícone favicon (16x16, 32x32)
- [ ] Criar splash screen para iOS (apple-touch-icon)
- [ ] Testar instalação do PWA
- [ ] Verificar ícones em diferentes dispositivos
- [ ] Adicionar ícones em formato SVG (opcional, para escalabilidade)
- [ ] Atualizar manifest.json com caminhos corretos

## 🎨 Especificações de Ícones

### Tamanhos Necessários
- **16x16**: Favicon
- **32x32**: Favicon
- **192x192**: Android Chrome
- **512x512**: Splash screen e Android
- **180x180**: Apple Touch Icon (iOS)

### Design Sugerido
- Usar emoji de tomate 🍅 como base
- Cores: Vermelho (#E74C3C ou #FF6347)
- Fundo sólido ou transparente
- Design simples e reconhecível

## 📁 Arquivos Afetados

- `manifest.json` (verificar caminhos)
- Adicionar arquivos de ícones na raiz ou pasta `icons/`

## 🛠️ Ferramentas Úteis

- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [Favicon Generator](https://realfavicongenerator.net/)
- Design tools: Figma, Canva, ou qualquer editor de imagens

## 📚 Referências

- [Web App Manifest MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Icons Guide](https://web.dev/add-manifest/)

## 💡 Notas

- Garantir que ícones sejam otimizados (compressão)
- Testar em dispositivos iOS e Android
- Considerar criar versões para modo claro/escuro (opcional)
- Ícones devem ser claros mesmo em tamanhos pequenos
