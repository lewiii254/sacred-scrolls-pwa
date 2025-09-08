const CACHE_NAME = 'sacred-scrolls-v0.0.0-1757325991226';
const STATIC_CACHE_NAME = 'sacred-scrolls-static-v0.0.0-1757325991226';
const APP_VERSION = '0.0.0-1757325991226';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/bible',
  '/search',
  '/notes',
  '/bookmarks',
  '/devotionals',
  '/offline.html',
  '/manifest.json',
  '/version.json'
];

// Bible content cache
const BIBLE_CACHE_NAME = 'sacred-scrolls-bible-v0.0.0-1757325991226';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Sacred Scrolls Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Sacred Scrolls Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Sacred Scrolls Service Worker: Install complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Sacred Scrolls Service Worker: Install failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Sacred Scrolls Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches - keep only current versions
            if (cacheName.startsWith('sacred-scrolls-') && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== CACHE_NAME && 
                cacheName !== BIBLE_CACHE_NAME) {
              console.log('Sacred Scrolls Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Sacred Scrolls Service Worker: Activation complete, notifying clients of update');
        // Notify all clients about the update
        return self.clients.claim().then(() => {
          return self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'SW_UPDATED',
                version: APP_VERSION
              });
            });
          });
        });
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Bible API requests (cache Bible content for offline use)
  if (url.pathname.includes('/bible/') || url.pathname.includes('/search/')) {
    event.respondWith(
      caches.open(BIBLE_CACHE_NAME)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('Sacred Scrolls Service Worker: Serving Bible content from cache', request.url);
                return cachedResponse;
              }

              // Fetch from network and cache
              return fetch(request)
                .then((networkResponse) => {
                  if (networkResponse && networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => {
                  // Return offline page for Bible content if not cached
                  return caches.match('/offline.html');
                });
            });
        })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('Sacred Scrolls Service Worker: Serving page from cache', request.url);
                return cachedResponse;
              }

              return fetch(request)
                .then((networkResponse) => {
                  // Cache successful navigation responses
                  if (networkResponse && networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => {
                  // Return cached root or offline page
                  return cache.match('/') || cache.match('/offline.html');
                });
            });
        })
    );
    return;
  }

  // Handle static assets (CSS, JS, images)
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }

              return fetch(request)
                .then((networkResponse) => {
                  if (networkResponse && networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => {
                  console.log('Sacred Scrolls Service Worker: Asset not available offline', request.url);
                  return null;
                });
            });
        })
    );
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return networkResponse;
      })
      .catch(() => {
        // Try to serve from cache
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            return null;
          });
      })
  );
});

// Background sync for saving user data when back online
self.addEventListener('sync', (event) => {
  console.log('Sacred Scrolls Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync-notes') {
    event.waitUntil(syncUserData());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Sacred Scrolls Service Worker: Push received');
  
  const options = {
    body: 'Time for your daily Bible reading!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'daily-reading',
    data: {
      url: '/bible'
    },
    actions: [
      {
        action: 'read',
        title: 'Read Now'
      },
      {
        action: 'dismiss',
        title: 'Later'
      }
    ]
  };

  if (event.data) {
    const payload = event.data.json();
    options.body = payload.body || options.body;
    options.data.url = payload.url || options.data.url;
  }

  event.waitUntil(
    self.registration.showNotification('Sacred Scrolls', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Sacred Scrolls Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'read') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/bible')
    );
  } else if (event.action === 'dismiss') {
    // Do nothing, just close
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Helper function to sync user data
async function syncUserData() {
  try {
    console.log('Sacred Scrolls Service Worker: Syncing user data');
    
    // Get pending notes/highlights/bookmarks from IndexedDB
    // This would sync with Supabase when back online
    // For now, just log that sync would happen
    
    console.log('Sacred Scrolls Service Worker: User data sync complete');
  } catch (error) {
    console.error('Sacred Scrolls Service Worker: Sync failed', error);
    throw error;
  }
}

// Handle skip waiting messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  
  if (event.data && event.data.type === 'CACHE_BIBLE_CONTENT') {
    const { bookId, chapter, content } = event.data;
    
    caches.open(BIBLE_CACHE_NAME)
      .then((cache) => {
        const request = new Request(`/bible/${bookId}/${chapter}`);
        const response = new Response(JSON.stringify(content), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        return cache.put(request, response);
      })
      .then(() => {
        console.log(`Sacred Scrolls Service Worker: Cached ${bookId} ${chapter} for offline use`);
      })
      .catch((error) => {
        console.error('Sacred Scrolls Service Worker: Failed to cache Bible content', error);
      });
  }
});