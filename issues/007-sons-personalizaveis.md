# Adicionar Sons Personalizáveis

**Labels:** `enhancement`, `feature`, `audio`  
**Prioridade:** 🟡 Média  
**Estimativa:** 1-2 dias

## 📋 Descrição

Permitir que usuários escolham diferentes sons e ajustem volume para personalizar a experiência de notificações sonoras.

## ✅ Tarefas

- [ ] Criar múltiplos sons (suave, clássico, moderno, natureza)
- [ ] Adicionar seletor de som nas configurações
- [ ] Adicionar controle de volume (slider)
- [ ] Adicionar preview de som (botão de teste)
- [ ] Sons diferentes para início e fim de sessão
- [ ] Salvar preferências no LocalStorage
- [ ] Adicionar opção de "sem som"
- [ ] Melhorar UI de seleção de som

## 🎵 Sons Sugeridos

### Para Fim de Sessão
1. **Suave**: Tom baixo e relaxante
2. **Clássico**: Som tradicional de alarme
3. **Moderno**: Tom eletrônico moderno
4. **Natureza**: Som de sino ou pássaro

### Para Início de Sessão (Opcional)
- Som mais sutil e motivacional
- Ou usar mesmo som do fim

## 🔧 Implementação

### Estrutura de Sons
```typescript
interface SoundOption {
  id: string;
  name: string;
  description: string;
  frequency: number; // Para oscilador
  duration: number;
  type: 'start' | 'end' | 'both';
}
```

### Atualizar SoundService
```typescript
class SoundService {
  private static selectedSound: string = 'classic';
  private static volume: number = 0.5;
  
  static setSound(soundId: string): void { }
  static setVolume(volume: number): void { }
  static previewSound(soundId: string): void { }
}
```

## 📁 Arquivos Afetados

- `src/services/SoundService.ts` (lógica de sons)
- `src/app.ts` (UI de configuração)
- `index.html` (inputs de configuração)

## 📚 Referências

- Sugerido em `SUGESTOES_MELHORIAS.md` (#13)
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 💡 Notas

- Considerar usar arquivos de áudio (MP3/WAV) além de osciladores
- Adicionar visualização de onda (opcional)
- Garantir que sons não sejam muito altos ou irritantes
- Testar em diferentes dispositivos e navegadores
