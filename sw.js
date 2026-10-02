/* Retires the old root-level service worker (the app now lives in /app/ with its own). Safe to leave in place. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => /^eazie-v\d+$/.test(k)).map(k => caches.delete(k)));
    await self.registration.unregister();
  })());
});
