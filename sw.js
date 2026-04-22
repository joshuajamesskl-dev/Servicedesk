// ServiceDesk Service Worker
// Caches the app shell for full offline use

const CACHE_NAME = 'servicedesk-v5';

// App shell — everything needed to run offline
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico',
  // Google Fonts — cached on first load, served offline after
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap'
];

// ── Install: pre-cache app shell ──────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache local files strictly; fonts best-effort
      return cache.addAll(['./', './index.html', './manifest.json'])
        .then(() => {
          // Fonts are cross-origin — add individually, ignore failures
          return Promise.allSettled(
            ['https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap']
              .map(url => cache.add(url).catch(() => {}))
          );
        });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for app shell, network-first for fonts ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET requests; ignore non-http(s) (chrome-extension etc.)
  if (event.request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Skip Supabase API calls — never intercept them
  if (url.hostname.includes('supabase.co')) return;

  // For Google Fonts — network first, fall back to cache
  if (url.hostname.includes('fonts.g')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request)
          .then(cached => cached || new Response('', { status: 503 }))
        )
    );
    return;
  }

  // For everything else — cache first, network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        // Only cache valid same-origin responses
        if (res.ok && url.origin === self.location.origin) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html')
            .then(cached => cached || new Response('Offline', { status: 503 }));
        }
        // For assets (images etc.) return a 503 rather than undefined
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

// ── Background sync message handler ──────────────
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
