# Otimizar Service Worker e Cache

**Labels:** `enhancement`, `performance`, `pwa`  
**Prioridade:** 🟡 Média  
**Estimativa:** 4-6 horas

## 📋 Descrição

Melhorar estratégia de cache do Service Worker e adicionar versionamento para garantir funcionamento offline confiável e atualizações adequadas.

## ✅ Tarefas

- [ ] Adicionar versionamento de cache
- [ ] Implementar estratégia de cache mais inteligente (Cache First, Network First)
- [ ] Adicionar cache para Chart.js CDN
- [ ] Adicionar fallback offline melhor
- [ ] Adicionar atualização automática de cache
- [ ] Testar funcionamento offline completo
- [ ] Adicionar notificação de atualização disponível
- [ ] Limpar caches antigos automaticamente

## 🔧 Estratégias de Cache

### Cache First (Assets Estáticos)
- HTML, CSS, JS, imagens
- Usar cache se disponível, senão buscar da rede

### Network First (Dados Dinâmicos)
- API calls (se houver no futuro)
- Tentar rede primeiro, usar cache como fallback

### Stale While Revalidate
- Para recursos que podem ser atualizados em background

## 📝 Implementação

### Versionamento
```javascript
const CACHE_VERSION = 'v2';
const CACHE_NAME = `pomodoro-timer-${CACHE_VERSION}`;
```

### Estratégia Híbrida
```javascript
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache first para assets
  if (url.pathname.match(/\.(js|css|html|png|jpg)$/)) {
    event.respondWith(cacheFirst(event.request));
  }
  // Network first para outros
  else {
    event.respondWith(networkFirst(event.request));
  }
});
```

## 📁 Arquivos Afetados

- `sw.js` (Service Worker)

## 📚 Referências

- [Service Worker API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox) (opcional)

## 💡 Notas

- Testar em diferentes cenários (online, offline, slow 3G)
- Considerar usar Workbox para gerenciar cache (opcional)
- Adicionar logs para debug em desenvolvimento
- Garantir que atualizações sejam aplicadas corretamente
