// Service Worker para PWA
// Versionamento dinâmico baseado em timestamp de build
// Atualizar esta versão quando houver mudanças significativas
const CACHE_VERSION = '1.0.0';
const BUILD_TIMESTAMP = '2024-01-01T00:00:00Z';
const CACHE_NAME = `pomodoro-timer-${CACHE_VERSION}-${BUILD_TIMESTAMP}`;

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
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Tentar adicionar todos os arquivos, mas não falhar se alguns não existirem
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              // Log apenas em desenvolvimento (não disponível em SW)
              console.warn(`Falha ao cachear ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        // Forçar ativação imediata do novo service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Erro ao instalar Service Worker:', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Deletar todos os caches antigos que não correspondem ao cache atual
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('pomodoro-timer-')) {
              console.log(`Removendo cache antigo: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Assumir controle de todas as páginas imediatamente
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Erro ao ativar Service Worker:', error);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Estratégia: Cache-first com fallback para network
        if (cachedResponse) {
          // Buscar atualização em background (stale-while-revalidate)
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone);
                  });
              }
            })
            .catch(() => {
              // Falha silenciosa na atualização em background
            });
          
          return cachedResponse;
        }
        
        // Se não está em cache, buscar da rede
        return fetch(event.request)
          .then((networkResponse) => {
            // Cachear apenas respostas válidas
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('Erro ao buscar recurso:', error);
            // Retornar página offline se disponível
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            throw error;
          });
      })
      .catch((error) => {
        console.error('Erro no fetch handler:', error);
        throw error;
      })
  );
});

// Notificações push (para uso futuro)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'pomodoro-notification'
  };

  event.waitUntil(
    self.registration.showNotification('🍅 Pomodoro Timer', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
