const CACHE_NAME = 'obrick-v3';
const urlsToCache = [
  '/gestion-obra/gestion-obra-SYNC%20(1).html',
  '/gestion-obra/icon-192.png',
  '/gestion-obra/icon-512.png',
  '/gestion-obra/manifest.json'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      if(!response || response.status !== 200) {
        return caches.match(event.request);
      }
      var responseClone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, responseClone);
      });
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
