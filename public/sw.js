// TeacherSathi Progressive Web App Service Worker
const CACHE_VERSION = 'v1';
const APP_CACHE = `teachersathi-app-${CACHE_VERSION}`;
const STATIC_CACHE = `teachersathi-static-${CACHE_VERSION}`;

// Core assets cached during Service Worker installation
const PRECACHE_ASSETS = [
  '/offline.html',
  '/logo-horizontal.png',
  '/favicon-green.png',
  '/assets/owl-mascot-green.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => {
      console.log('[Service Worker] Pre-caching offline page and core assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches except the current version's APP_CACHE and STATIC_CACHE
          if (cacheName !== APP_CACHE && cacheName !== STATIC_CACHE) {
            console.log('[Service Worker] Deleting obsolete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only handle GET requests and http/https protocols (ignore browser extensions)
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // 2. Explicitly bypass caching for database connections (Supabase), internal API routes, and hot reloading
  if (
    url.pathname.startsWith('/api') ||
    url.hostname.includes('supabase') ||
    url.pathname.includes('_next/webpack-hmr') ||
    url.pathname.startsWith('/_next/data')
  ) {
    return;
  }

  // 3. Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Serve online navigation normally, do not dynamically cache HTML to prevent user details leakage
          return response;
        })
        .catch((error) => {
          console.log('[Service Worker] Navigation failed, serving offline page. Error:', error);
          // If offline, check if request is in cache (e.g. if precached), otherwise fallback to the custom offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // 4. Static assets (JS, CSS, images, fonts, icons)
  const isStaticAsset =
    url.pathname.startsWith('/_next/static') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.avif') ||
    url.pathname.endsWith('.ico');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-While-Revalidate: serve cached version immediately, fetch and update in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(STATIC_CACHE).then((cache) => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch(() => {
              // Ignore network errors in background fetching
            });
          return cachedResponse;
        }

        // Cache miss: fetch from network, store in cache, and return response
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Network failed and not in cache
        });
      })
    );
  }
});
