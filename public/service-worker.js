const CACHE_NAME = 'triptrack-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Network-first for API requests, cache-first for navigation and assets
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Adjust to match your API host if needed
  const isApiRequest = url.pathname.startsWith('/api') || url.hostname.includes('supabase');

  if (isApiRequest) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Try cache, then network, fallback to cache
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request)
        .then(resp => {
          if (!resp || resp.status !== 200 || resp.type !== 'basic') return resp;
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, respClone));
          return resp;
        })
        .catch(() => {
          // return cached index.html for navigation fallback
          if (request.mode === 'navigate') return caches.match('/index.html');
        });
    })
  );
});