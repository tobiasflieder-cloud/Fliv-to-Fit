// FlivFit Service Worker
// Bei jeder neuen Version die Versionsnummer hochzählen, damit Handys das Update laden.
const VERSION = 'flivfit-1.5.0';

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
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Bilder/Videos werden mit ?v=<geaendert> abgefragt. Ältere Fassungen derselben Datei aus dem Cache entfernen.
function alteFassungenWeg(c, url) {
  if (!url.pathname.includes('/data/bilder/')) return;
  c.keys().then((keys) => keys.forEach((k) => {
    const u = new URL(k.url);
    if (u.pathname === url.pathname && u.search !== url.search) c.delete(k);
  }));
}

// App-Seite und Übungsliste: erst Netz (damit Updates ankommen), sonst Cache.
// Beim Netz-Abruf den Browser-Cache umgehen ('no-cache'), sonst liefert er bis zu 10 Min. alte Dateien von GitHub Pages.
// Navigations-Anfragen lassen sich nicht mit Optionen kopieren, daher dort nur die URL abrufen.
// Alles andere (Bilder, Schriften, Icons): erst Cache, sonst Netz.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const netzZuerst = req.mode === 'navigate' || url.pathname.endsWith('/uebungen.json') || url.pathname.endsWith('/index.html');

  if (netzZuerst) {
    e.respondWith(
      fetch(req.mode === 'navigate' ? req.url : req, { cache: 'no-cache' })
        .then((res) => {
          const kopie = res.clone();
          caches.open(VERSION).then((c) => c.put(req, kopie));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Videos: Der Browser fragt sie in Teilen an (Range). Immer die ganze Datei laden und cachen,
  // damit sie auch offline laufen.
  if (/\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) {
    const ziel = url.href.split('#')[0];
    e.respondWith(
      caches.match(ziel, { ignoreVary: true }).then((r) =>
        r ||
        fetch(ziel).then((res) => {
          if (res.status === 200) {
            const kopie = res.clone();
            caches.open(VERSION).then((c) => c.put(ziel, kopie).then(() => alteFassungenWeg(c, url)));
          }
          return res;
        })
      )
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((r) =>
      r ||
      fetch(req).then((res) => {
        if (res.status === 200) {
          const kopie = res.clone();
          caches.open(VERSION).then((c) => c.put(req, kopie).then(() => alteFassungenWeg(c, url)));
        }
        return res;
      })
    )
  );
});
