// Service Worker: hält die App offline bereit und meldet neue Versionen.
// Bei jeder Veröffentlichung VERSION erhöhen (gleich wie in js/version.js). Neue Dateien in CORE eintragen.
const VERSION = '1.0.2';
const CACHE = 'eazubi-' + VERSION;
const FONTS = 'eazubi-fonts';
const CORE = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'js/main.js', 'js/store.js', 'js/ui.js', 'js/lesson.js', 'js/version.js',
  'js/content/kurs.js', 'js/content/abzeichen.js',
  'js/content/abschnitte/sicherheit.js', 'js/content/abschnitte/installation.js', 'js/content/abschnitte/steuerung.js',
  'js/content/abschnitte/verteiler.js', 'js/content/abschnitte/zaehler.js', 'js/content/abschnitte/messsysteme.js',
  'js/content/abschnitte/erdung.js', 'js/content/abschnitte/emob.js', 'js/content/abschnitte/pv.js',
  'js/practice/schaltplan.js', 'js/practice/netz.js', 'js/practice/verteiler.js', 'js/practice/zaehlerschrank.js',
  'js/practice/erdung.js', 'js/practice/pv.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  // cache: 'reload' umgeht den Browser-Zwischenspeicher, sonst landen alte Dateien in der neuen Version
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('eazubi-') && k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Schriften von Google: aus dem Speicher, im Hintergrund auffrischen
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Seitenaufrufe: immer die App-Seite, offline aus dem Speicher
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }
  // Dateien der App: zuerst aus dem Speicher dieser Version
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
