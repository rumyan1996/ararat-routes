/* Armenia Along the Way: lets the site open without internet.
   It keeps a copy of the page, the icons and the fonts. Live data (maps, forecast, reviews) is never stored here. */
const VERSION = 'ag-v1';
const SHELL = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/banner-poster.jpg'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => Promise.all(SHELL.map(u => cache.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('ag-') && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // live data and video are never cached
  if (/supabase\.co$|open-meteo\.com$|yandex\.|yastatic\.net$|wikipedia\.org$|wikimedia\.org$/.test(url.hostname)) return;
  if (url.pathname.endsWith('.mp4')) return;

  // the page itself: newest copy when online, saved copy when offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put('/', copy)); return res; })
        .catch(() => caches.match('/').then(r => r || caches.match(req)))
    );
    return;
  }

  // own files, fonts and the reviews library: show the saved copy fast, refresh it in the background
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$|cdn\.jsdelivr\.net$/.test(url.hostname)) {
    event.respondWith(
      caches.open(VERSION).then(cache =>
        cache.match(req).then(hit => {
          const net = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
          return hit || net;
        })
      )
    );
  }
});
