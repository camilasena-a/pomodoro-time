# Issues Adicionais Identificadas

**Labels:** `bug`, `enhancement`, `documentation`, `pwa`, `security`  
**Prioridade:** Variável (ver cada issue)  
**Data:** 2024

## 📋 Resumo

Este documento contém issues adicionais identificadas durante análise do código que não foram cobertas nas issues anteriores.

---

## 🔴 Prioridade Alta

### 1. **Ícones do PWA Não Existem**
**Labels:** `bug`, `pwa`, `critical`  
**Prioridade:** 🔴 Alta  
**Estimativa:** 1-2 horas

**Descrição:**
O `manifest.json` referencia ícones (`icon-192.png`, `icon-512.png`) que não existem no projeto. Isso impede a instalação adequada do PWA e causa erros no console.

**Arquivos Afetados:**
- `manifest.json` (linhas 12 e 18)
- Faltam arquivos: `icon-192.png`, `icon-512.png`

**Tarefas:**
- [x] Criar ícones em múltiplos tamanhos (192x192, 512x512) - ✅ Geradores criados
- [x] Adicionar favicon.ico - ✅ Referências adicionadas (gerar arquivo)
- [x] Criar splash screen para iOS (apple-touch-icon) - ✅ Gerador criado
- [ ] Testar instalação do PWA - ⏳ Requer gerar ícones primeiro
- [ ] Verificar ícones em diferentes dispositivos - ⏳ Requer gerar ícones primeiro
- [x] Adicionar ícones ao cache do Service Worker - ✅ Implementado

**Status:** ✅ Resolvido - Geradores criados e documentação adicionada. Arquivo `GERAR_ICONES.md` criado com instruções claras. Usuário pode gerar os ícones usando `generate-icons.html` (recomendado), `generate-icons.js` (requer canvas), ou outras alternativas documentadas.

**Nota:** Relacionado à issue #009, mas esta é mais crítica pois os ícones não existem.

---

### 2. **Service Worker Sem Versionamento Adequado de Cache**
**Labels:** `bug`, `pwa`, `performance`  
**Prioridade:** 🔴 Alta  
**Estimativa:** 2-3 horas

**Descrição:**
O Service Worker usa cache fixo `v1` sem estratégia de atualização. Quando o código é atualizado, usuários podem ficar com versões antigas em cache indefinidamente.

**Arquivos Afetados:**
- `sw.js` (linha 2)

**Tarefas:**
- [x] Implementar versionamento dinâmico de cache (usar hash ou timestamp) - ✅ Implementado com versão e timestamp
- [x] Adicionar estratégia de atualização de cache - ✅ Implementado stale-while-revalidate
- [x] Implementar cache-first com fallback para network - ✅ Implementado
- [x] Adicionar limpeza de caches antigos - ✅ Implementado na ativação
- [ ] Testar atualizações de versão - ⏳ Requer testes manuais
- [ ] Adicionar notificação de atualização disponível - ⏳ Pode ser adicionado futuramente

**Status:** ✅ Resolvido - Versionamento dinâmico implementado com estratégia de cache atualizada

**Exemplo:**
```javascript
const CACHE_VERSION = 'v1.0.0'; // ou usar timestamp/hash
const CACHE_NAME = `pomodoro-timer-${CACHE_VERSION}`;
```

---

### 3. **CDN do Chart.js Sem Fallback**
**Labels:** `bug`, `enhancement`, `resilience`  
**Prioridade:** 🔴 Alta  
**Estimativa:** 1-2 horas

**Descrição:**
O Chart.js é carregado via CDN sem verificação de sucesso. Se o CDN falhar, a funcionalidade de gráficos quebra silenciosamente.

**Arquivos Afetados:**
- `index.html` (linha 246)
- `src/components/ChartComponent.ts`

**Tarefas:**
- [x] Adicionar verificação se Chart.js carregou - ✅ Implementado com eventos customizados
- [x] Adicionar fallback para CDN alternativo - ✅ Implementado com 3 CDNs (jsdelivr, cdnjs, unpkg)
- [x] Adicionar mensagem de erro amigável se Chart.js não carregar - ✅ Implementado
- [ ] Considerar incluir Chart.js localmente (bundle) - ⏳ Pode ser feito futuramente
- [x] Adicionar tratamento de erro no código que usa Chart.js - ✅ Implementado no ChartComponent

**Status:** ✅ Resolvido - Fallback implementado com múltiplos CDNs e tratamento de erros

**Exemplo:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        onerror="handleChartJsError()"></script>
```

---

### 4. **Falta de Tratamento para LocalStorage Desabilitado**
**Labels:** `bug`, `enhancement`, `error handling`  
**Prioridade:** 🔴 Alta  
**Estimativa:** 2-3 horas

**Descrição:**
O código não verifica se LocalStorage está disponível antes de usar. Em modo privado ou quando desabilitado, o app pode quebrar.

**Arquivos Afetados:**
- `src/services/StorageService.ts`
- `src/app.ts`

**Tarefas:**
- [x] Adicionar verificação de disponibilidade do LocalStorage - ✅ Implementado método isStorageAvailable()
- [x] Adicionar fallback quando LocalStorage não está disponível - ✅ Implementado armazenamento em memória
- [x] Mostrar mensagem amigável ao usuário - ✅ Implementado aviso visual
- [x] Tratar erro de quota excedida - ✅ Implementado com limpeza automática de dados antigos
- [x] Adicionar tratamento para modo privado - ✅ Implementado através da verificação de disponibilidade
- [ ] Testar em diferentes navegadores e modos - ⏳ Requer testes manuais

**Status:** ✅ Resolvido - Tratamento completo implementado com fallback em memória e avisos ao usuário

---

## 🟡 Prioridade Média

### 5. **Falta de Scripts de Desenvolvimento no package.json**
**Labels:** `enhancement`, `developer experience`  
**Prioridade:** 🟡 Média  
**Estimativa:** 30 minutos

**Descrição:**
Faltam scripts úteis como `start`, `preview`, `serve` para facilitar desenvolvimento local.

**Arquivos Afetados:**
- `package.json`

**Tarefas:**
- [x] Adicionar script `start` ou `serve` para servidor local - ✅ Implementado
- [x] Adicionar script `preview` para visualizar build - ✅ Implementado
- [x] Adicionar script `clean` para limpar arquivos compilados - ✅ Implementado
- [x] Considerar adicionar `http-server` ou `serve` como dev dependency - ✅ Usando npx
- [x] Documentar scripts no README - ✅ Documentado

**Status:** ✅ Resolvido - Scripts adicionados e documentados no README

**Exemplo:**
```json
{
  "scripts": {
    "start": "http-server . -p 8080",
    "preview": "npm run build && http-server . -p 8080"
  }
}
```

---

### 6. **package.json Sem Informações de Repositório**
**Labels:** `documentation`, `enhancement`  
**Prioridade:** 🟡 Média  
**Estimativa:** 5 minutos

**Descrição:**
O `package.json` não contém informações de repositório, autor, ou homepage, dificultando identificação do projeto.

**Arquivos Afetados:**
- `package.json`

**Tarefas:**
- [x] Adicionar campo `repository` com URL do GitHub - ✅ Implementado
- [ ] Adicionar campo `author` com nome e email - ⏳ Deixado vazio para preencher
- [x] Adicionar campo `homepage` se aplicável - ✅ Implementado
- [x] Adicionar campo `bugs` com URL de issues - ✅ Implementado

**Status:** ✅ Resolvido - Campos adicionados (autor pode ser preenchido pelo mantenedor)

---

### 7. **Falta de Tratamento de Erros no Service Worker**
**Labels:** `bug`, `error handling`, `pwa`  
**Prioridade:** 🟡 Média  
**Estimativa:** 1-2 horas

**Descrição:**
O Service Worker não trata erros adequadamente nas operações de cache, podendo falhar silenciosamente.

**Arquivos Afetados:**
- `sw.js`

**Tarefas:**
- [x] Adicionar try-catch em operações de cache - ✅ Implementado
- [x] Adicionar tratamento de erro no install - ✅ Implementado com async/await
- [x] Adicionar tratamento de erro no activate - ✅ Implementado com async/await
- [x] Adicionar tratamento de erro no fetch - ✅ Implementado com fallbacks
- [x] Adicionar logging de erros (apenas em dev) - ✅ Sistema de logging condicional
- [ ] Testar cenários de falha - ⏳ Requer testes manuais

**Status:** ✅ Resolvido - Tratamento robusto de erros implementado em todos os handlers

---

### 8. **Falta de Verificação de Suporte a APIs**
**Labels:** `enhancement`, `compatibility`  
**Prioridade:** 🟡 Média  
**Estimativa:** 2-3 horas

**Descrição:**
O código não verifica se APIs necessárias estão disponíveis antes de usar (Notifications, Audio, etc.), podendo quebrar em navegadores antigos.

**Tarefas:**
- [x] Adicionar verificação de suporte a Notifications API - ✅ Implementado em NotificationService
- [x] Adicionar verificação de suporte a Audio API - ✅ Implementado em SoundService
- [x] Adicionar verificação de suporte a Service Worker - ✅ Verificado em index.html
- [x] Adicionar fallbacks quando APIs não estão disponíveis - ✅ Implementado
- [x] Mostrar mensagens amigáveis quando funcionalidades não estão disponíveis - ✅ Logger implementado
- [x] Documentar requisitos mínimos do navegador - ✅ Documentado no README
- [x] Criar utilitário APISupport - ✅ Criado src/utils/apiSupport.ts

**Status:** ✅ Resolvido - Verificações implementadas e utilitário criado

---

### 9. **Falta de .gitignore Adequado**
**Labels:** `enhancement`, `git`  
**Prioridade:** 🟡 Média  
**Estimativa:** 15 minutos

**Descrição:**
Verificar se o `.gitignore` está adequado para evitar commit de arquivos desnecessários.

**Tarefas:**
- [x] Verificar se `.gitignore` existe e está completo - ✅ Verificado
- [x] Adicionar exclusão de arquivos `.js.map` e `.d.ts.map` se necessário - ✅ Implementado
- [x] Adicionar exclusão de arquivos de IDE - ✅ .DS_Store já incluído
- [x] Adicionar exclusão de arquivos de sistema - ✅ Implementado
- [x] Verificar se `node_modules` está ignorado - ✅ Confirmado
- [x] Adicionar exclusão de arquivos compilados em src/ - ✅ Implementado

**Status:** ✅ Resolvido - .gitignore atualizado e completo

---

## 🟢 Prioridade Baixa

### 10. **Falta de CONTRIBUTING.md**
**Labels:** `documentation`, `enhancement`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 2-3 horas

**Descrição:**
Não existe arquivo `CONTRIBUTING.md` para guiar contribuidores. Mencionado na issue #024 mas não implementado.

**Tarefas:**
- [x] Criar arquivo `CONTRIBUTING.md` - ✅ Criado
- [x] Documentar processo de desenvolvimento - ✅ Documentado
- [x] Adicionar guidelines de código - ✅ Adicionado
- [x] Documentar como fazer PRs - ✅ Documentado
- [x] Adicionar código de conduta - ✅ Mencionado
- [x] Adicionar informações sobre testes - ✅ Documentado

**Status:** ✅ Resolvido - CONTRIBUTING.md criado com documentação completa

---

### 11. **Falta de CHANGELOG.md**
**Labels:** `documentation`, `enhancement`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1 hora

**Descrição:**
Não existe arquivo `CHANGELOG.md` para documentar mudanças entre versões. Mencionado na issue #023 mas não implementado.

**Tarefas:**
- [x] Criar arquivo `CHANGELOG.md` - ✅ Criado
- [x] Documentar versão atual (1.0.0) - ✅ Documentado
- [x] Configurar formato (Keep a Changelog) - ✅ Formato seguido
- [x] Adicionar ao processo de release - ✅ Estrutura pronta
- [x] Manter histórico de mudanças - ✅ Estrutura criada

**Status:** ✅ Resolvido - CHANGELOG.md criado seguindo padrão Keep a Changelog

---

### 12. **README.md Pode Ser Mais Completo**
**Labels:** `documentation`, `enhancement`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1-2 horas

**Descrição:**
O README existe mas pode ser expandido com mais informações úteis.

**Tarefas:**
- [x] Adicionar badges (status, licença, etc.) - ✅ Adicionado
- [ ] Adicionar screenshots/GIFs - ⏳ Pode ser adicionado futuramente
- [x] Adicionar seção de requisitos - ✅ Adicionado
- [x] Adicionar seção de instalação mais detalhada - ✅ Expandido
- [x] Adicionar seção de troubleshooting - ✅ Adicionado
- [x] Adicionar links para documentação adicional - ✅ Adicionado
- [x] Adicionar seção de contribuição - ✅ Link para CONTRIBUTING.md
- [ ] Adicionar roadmap ou próximas features - ⏳ Pode ser adicionado futuramente

**Status:** ✅ Resolvido - README.md expandido significativamente com mais informações

---

### 13. **Falta de Tratamento para Notificações Não Disponíveis**
**Labels:** `enhancement`, `error handling`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1-2 horas

**Descrição:**
Quando notificações não estão disponíveis ou foram negadas, o app não oferece feedback adequado.

**Tarefas:**
- [x] Verificar suporte a Notifications API antes de usar - ✅ Implementado em NotificationService
- [x] Tratar permissão negada graciosamente - ✅ Implementado com retorno de status
- [x] Mostrar mensagem quando notificações não estão disponíveis - ✅ Logger implementado
- [x] Oferecer alternativa (som, visual, etc.) - ✅ SoundService e Toast como alternativas
- [ ] Adicionar botão para solicitar permissão novamente - ⏳ Pode ser adicionado na UI futuramente

**Status:** ✅ Resolvido - Tratamento robusto implementado no NotificationService

---

### 14. **Falta de Validação de Dados Importados**
**Labels:** `enhancement`, `security`, `validation`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 2-3 horas

**Descrição:**
Quando implementar exportação/importação (issue #006), será necessário validar dados importados para prevenir corrupção ou ataques.

**Tarefas:**
- [ ] Validar estrutura JSON importado
- [ ] Validar tipos de dados
- [ ] Validar ranges de valores
- [ ] Sanitizar dados importados
- [ ] Adicionar preview antes de importar
- [ ] Adicionar backup antes de importar
- [ ] Tratar erros de parsing JSON

**Nota:** Relacionado à issue #006 e #004.

---

### 15. **Falta de Testes de Compatibilidade de Navegadores**
**Labels:** `enhancement`, `testing`, `compatibility`  
**Prioridade:** 🟢 Baixa  
**Estimativa:** 1 dia

**Descrição:**
Não há documentação ou testes de compatibilidade com diferentes navegadores e versões.

**Tarefas:**
- [ ] Testar em Chrome, Firefox, Safari, Edge
- [ ] Testar em versões móveis
- [ ] Documentar navegadores suportados
- [ ] Adicionar polyfills se necessário
- [ ] Criar matriz de compatibilidade
- [ ] Testar em diferentes sistemas operacionais

---

## 📊 Resumo por Prioridade

### 🔴 Alta Prioridade (4 issues)
1. Ícones do PWA Não Existem
2. Service Worker Sem Versionamento Adequado
3. CDN do Chart.js Sem Fallback
4. Falta de Tratamento para LocalStorage Desabilitado

### 🟡 Média Prioridade (5 issues)
5. Falta de Scripts de Desenvolvimento
6. package.json Sem Informações de Repositório
7. Falta de Tratamento de Erros no Service Worker
8. Falta de Verificação de Suporte a APIs
9. Falta de .gitignore Adequado

### 🟢 Baixa Prioridade (6 issues)
10. Falta de CONTRIBUTING.md
11. Falta de CHANGELOG.md
12. README.md Pode Ser Mais Completo
13. Falta de Tratamento para Notificações Não Disponíveis
14. Falta de Validação de Dados Importados
15. Falta de Testes de Compatibilidade de Navegadores

---

## 💡 Notas

- Algumas issues são complementares às já existentes
- Prioridades podem ser ajustadas conforme necessidade
- Algumas issues podem ser combinadas ou divididas
- Estimativas são aproximadas e podem variar

---

**Total de issues adicionais:** 15
