// FlivFit Service Worker
// Bei jeder neuen Version die Versionsnummer hochzählen, damit Handys das Update laden.
const VERSION = 'flivfit-1.2.0';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './data/uebungen.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './fonts/nunito-latin-400-normal.woff2',
  './fonts/nunito-latin-600-normal.woff2',
  './fonts/nunito-latin-700-normal.woff2',
  './fonts/nunito-latin-800-normal.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// App-Seite und Übungsliste: erst Netz (damit Updates ankommen), sonst Cache.
// Alles andere (Bilder, Schriften, Icons): erst Cache, sonst Netz.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const netzZuerst = req.mode === 'navigate' || url.pathname.endsWith('/uebungen.json') || url.pathname.endsWith('/index.html');

  if (netzZuerst) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const kopie = res.clone();
          caches.open(VERSION).then((c) => c.put(req, kopie));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((r) =>
      r ||
      fetch(req).then((res) => {
        if (res.ok) {
          const kopie = res.clone();
          caches.open(VERSION).then((c) => c.put(req, kopie));
        }
        return res;
      })
    )
  );
});
