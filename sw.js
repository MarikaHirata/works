// caches the page images for offline viewing (films and songs stream from the network)
const V = 'mh-7f8bee3d';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mh-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(ca => ca.put('index.html', c)); return res; }).catch(() => caches.match('index.html')));
  } else if (u.pathname.indexOf('/img/') >= 0) {
    e.respondWith(caches.open(V).then(ca => ca.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) ca.put(r, res.clone()); return res; }))));
  }
});
