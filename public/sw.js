// Self-healing Service Worker for Beton Mobil PWA
const CACHE_NAME = 'beton-mobil-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Do not intercept fetch with broken empty cache fallback; let browser handle network requests directly
self.addEventListener('fetch', () => {
  return;
});
