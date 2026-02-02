// Service Worker para PWA
// Versionamento dinâmico baseado em timestamp de build
// Atualizar esta versão quando houver mudanças significativas
const CACHE_VERSION = '1.0.0';
const BUILD_TIMESTAMP = '2024-01-01T00:00:00Z';
const CACHE_NAME = `pomodoro-timer-${CACHE_VERSION}-${BUILD_TIMESTAMP}`;

// Sistema de logging condicional para Service Worker
// Em produção, logs são silenciados para melhor performance
const DEBUG = false; // Alterar para true apenas em desenvolvimento

function log(...args) {
  if (DEBUG) {
    console.log('[SW]', ...args);
  }
}

function logError(...args) {
  // Erros sempre são logados, mas formatados
  console.error('[SW Error]', ...args);
}

function logWarn(...args) {
  if (DEBUG) {
    console.warn('[SW]', ...args);
  }
}

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  // Ícones (adicionar apenas se existirem)
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        // Tentar adicionar todos os arquivos, mas não falhar se alguns não existirem
        const results = await Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              // Log apenas em desenvolvimento
              logWarn(`Falha ao cachear ${url}:`, err);
              return null;
            })
          )
        );
        
        // Verificar se pelo menos alguns arquivos foram cacheados
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        if (successCount === 0) {
          logWarn('Nenhum arquivo foi cacheado com sucesso');
        }
        
        // Forçar ativação imediata do novo service worker
        await self.skipWaiting();
      } catch (error) {
        logError('Erro ao instalar Service Worker:', error);
        // Mesmo com erro, tentar ativar para não bloquear o app
        try {
          await self.skipWaiting();
        } catch (skipError) {
          logError('Erro ao fazer skipWaiting:', skipError);
        }
      }
    })()
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        // Deletar todos os caches antigos que não correspondem ao cache atual
        const deletePromises = cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName.startsWith('pomodoro-timer-'))
          .map(async (cacheName) => {
            try {
              log(`Removendo cache antigo: ${cacheName}`);
              await caches.delete(cacheName);
            } catch (err) {
              logWarn(`Erro ao deletar cache ${cacheName}:`, err);
            }
          });
        
        await Promise.allSettled(deletePromises);
        
        // Assumir controle de todas as páginas imediatamente
        await self.clients.claim();
      } catch (error) {
        logError('Erro ao ativar Service Worker:', error);
        // Tentar fazer claim mesmo com erro
        try {
          await self.clients.claim();
        } catch (claimError) {
          logError('Erro ao fazer clients.claim:', claimError);
        }
      }
    })()
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const cachedResponse = await caches.match(event.request);
        
        // Estratégia: Cache-first com fallback para network
        if (cachedResponse) {
          // Buscar atualização em background (stale-while-revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone).catch(err => {
                  logWarn('Erro ao atualizar cache:', err);
                });
              }).catch(err => {
                logWarn('Erro ao abrir cache para atualização:', err);
              });
            }
          }).catch(() => {
            // Falha silenciosa na atualização em background
          });
          
          return cachedResponse;
        }
        
        // Se não está em cache, buscar da rede
        try {
          const networkResponse = await fetch(event.request);
          
          // Cachear apenas respostas válidas
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            try {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(event.request, responseClone);
            } catch (cacheError) {
              logWarn('Erro ao cachear resposta:', cacheError);
            }
          }
          
          return networkResponse;
        } catch (fetchError) {
          logError('Erro ao buscar recurso:', fetchError);
          
          // Retornar página offline se disponível
          if (event.request.destination === 'document') {
            const offlinePage = await caches.match('/index.html');
            if (offlinePage) {
              return offlinePage;
            }
          }
          
          // Retornar resposta de erro genérica se não houver fallback
          return new Response('Recurso não disponível offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        }
      } catch (error) {
        logError('Erro no fetch handler:', error);
        // Retornar resposta de erro genérica
        return new Response('Erro ao processar requisição', {
          status: 500,
          statusText: 'Internal Server Error',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      }
    })()
  );
});

// Notificações push (para uso futuro)
self.addEventListener('push', (event) => {
  try {
    const options = {
      body: event.data ? event.data.text() : 'Nova notificação',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'pomodoro-notification'
    };

    event.waitUntil(
      self.registration.showNotification('🍅 Pomodoro Timer', options).catch(err => {
        logError('Erro ao mostrar notificação push:', err);
      })
    );
  } catch (error) {
    logError('Erro no handler de push:', error);
  }
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  try {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/').catch(err => {
        logError('Erro ao abrir janela:', err);
      })
    );
  } catch (error) {
    logError('Erro no handler de notificationclick:', error);
  }
});
