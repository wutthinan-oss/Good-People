/* Service worker: เก็บหน้าหลักของแอปไว้เปิดเร็ว/เปิดได้แม้สัญญาณอ่อน ส่วนข้อมูลจากฐานข้อมูลไม่เก็บแคช */
const V = 'cadet-v1';
const SHELL = ['portal.html', 'portal.css', 'portal.js', 'api.js', 'config.js', 'pwa.js', 'style.css',
               'assets/logo.png', 'assets/icon-192.png', 'manifest.webmanifest'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return; // API (Apps Script) และฟอนต์ ไม่ผ่านแคช
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('portal.html')))
  );
});
