const CACHE = "saneamiento-38481e92";
const BASE = ["./", "index.html", "manifest.webmanifest", "icono-192.png", "icono-512.png", "icono-180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put("index.html", c)); return res; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(r, c)); return res; })));
});
