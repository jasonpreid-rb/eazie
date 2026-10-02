/* eazie service worker - lets the app open offline.
   Bump VERSION whenever you upload new files so phones pick them up. */
const VERSION = "eazie-v4";
const FILES = ["./", "index.html", "assets/eazie.css", "assets/app.css", "assets/app.js", "assets/analytics.js",
  "fonts/inter-latin-wght-normal.woff2", "fonts/pacifico-latin-400-normal.woff2",
  "manifest.webmanifest", "favicon.svg", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
/* Network first (so updates show up), cache as the offline fallback.
   Other sites (e.g. analytics) are left alone. */
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(r, copy)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match("index.html")))
  );
});
