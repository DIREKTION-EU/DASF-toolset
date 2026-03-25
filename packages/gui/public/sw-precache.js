// Service Worker with cache-first strategy for offline support
const CACHE_VERSION = 'v1';
const CACHE_NAME = `dasf-toolset-${CACHE_VERSION}`;

// Core assets to cache - will be filled by precacheManifest
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/src/app.ts',
];

// Images and icons
const IMAGES = [
  '/assets/logo.svg',
];

// Fonts
const FONTS = [
  '/node_modules/material-icons/iconfont/filled.woff2',
  '/node_modules/material-icons/iconfont/filled.woff',
];

// Stylesheets
const STYLESHEETS = [
  '/src/css/style.css',
];

// All assets to cache
const ASSETS_TO_CACHE = [
  ...CORE_ASSETS,
  ...IMAGES,
  ...FONTS,
  ...STYLESHEETS,
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets for offline use');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] Service worker installed successfully');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
        // Continue anyway - some assets may be cached
        return self.skipWaiting();
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http protocols
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // If response is valid, cache it
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, return offline page
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/index.html');
            }
            throw new Error('Network request failed');
          });
      })
  );
});

// Message handling for updates
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('[SW] Service worker script loaded');
