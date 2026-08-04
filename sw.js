// sw.js v5 — limpieza total de cache + HTML siempre fresco
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({type: 'CACHE_CLEARED'});
        });
      });
    })
  );
});

// Sin cache propio — siempre red.
// Ademas, para el HTML de la app pedimos con cache:'no-store' para saltear
// tambien el cache HTTP del navegador. GitHub Pages envia Cache-Control:
// max-age=600, asi que sin esto una version recien publicada puede tardar
// hasta 10 minutos en verse.
self.addEventListener('fetch', function(event) {
  var req = event.request;
  var esDocumento = req.mode === 'navigate' || req.destination === 'document';
  if (esDocumento) {
    event.respondWith(
      fetch(req, {cache: 'no-store'}).catch(function(){ return fetch(req); })
    );
    return;
  }
  event.respondWith(fetch(req));
});
