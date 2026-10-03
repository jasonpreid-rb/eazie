/* eazie app service worker (scope: /app/). Bump VERSION whenever you upload new app files. */
const VERSION = "eazieapp-3";
const FILES = ["./", "index.html", "assets/app.css", "assets/app.js", "manifest.webmanifest",
  "../assets/eazie.css", "../assets/analytics.js", "../fonts/inter-latin-wght-normal.woff2",
  "../fonts/pacifico-latin-400-normal.woff2", "../favicon.svg", "../icons/icon-192.png", "../icons/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(r, copy)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match("index.html")))
  );
});
