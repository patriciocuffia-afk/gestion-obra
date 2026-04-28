const CACHE_NAME = 'obrick-v1';
const urlsToCache = [
  '/gestion-obra/gestion-obra-SYNC%20(1).html',
  '/gestion-obra/icon-192.png',
  '/gestion-obra/icon-512.png',
  '/gestion-obra/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request);
    })
  );
});
