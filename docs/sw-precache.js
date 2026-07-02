// Service Worker with cache-first strategy for offline support
//
// Paths below are relative to this script's own location, which the
// browser resolves against wherever the app is actually hosted (e.g.
// GitHub Pages project sites serve from a /<repo>/ subpath rather than
// domain root).
const CACHE_VERSION = 'v2';
const CACHE_NAME = `dasf-toolset-${CACHE_VERSION}`;

// Core assets to cache
const CORE_ASSETS = [
  './',
  './index.html',
  './index.bundle.js',
];

// Images and icons
const IMAGES = [
  './favicon.ico',
  './background.jpg',
  './direktion-logo.webp',
  './tno_txt.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
];

// Fonts
const FONTS = [
  './material-icons.woff2',
  './material-icons.woff',
];

// Stylesheets
const STYLESHEETS = [
  './index.css',
];

// Other
const OTHER = [
  './manifest.json',
];

// All assets to cache
const ASSETS_TO_CACHE = [
  ...CORE_ASSETS,
  ...IMAGES,
  ...FONTS,
  ...STYLESHEETS,
  ...OTHER,
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
              return caches.match('./index.html');
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
