const CACHE_NAME = 'metas-epicas-cache-v2'; // Mudamos para v2 para forçar o navegador a atualizar

// Alterado os caminhos para formatos relativos que o GitHub Pages aceita sem quebrar
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usamos o cache.addAll de forma segura
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Força o novo service worker a assumir o controle imediatamente
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle das páginas abertas imediatamente
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
