const CACHE = 'monarchs-v4';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest',
  './assets/tailwind.css', './assets/fontawesome.min.css', './assets/supabase.js',
  './assets/webfonts/fa-solid-900.woff2', './assets/webfonts/fa-regular-400.woff2',
  './assets/webfonts/fa-brands-400.woff2', './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('monarchs-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
