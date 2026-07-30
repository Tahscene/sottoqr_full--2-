/*
 * Minimal offline-first service worker.
 *
 * Scope, honestly: this caches the STATIC shell (HTML/CSS/JS/images) so the
 * site still opens and looks right with no connection. It does NOT make
 * /api/verify or the Justice Tracker work offline - those genuinely need a
 * server. Real offline evidence *verification* is handled separately by
 * scripts/verify_offline.py (Ed25519 signature check, works with zero
 * network at all) - this service worker is just about the page not going
 * blank on a bad connection.
 */
const CACHE_NAME = "sottoqr-shell-v1";
const SHELL_ASSETS = [
  "/",
  "/static/css/style.css",
  "/static/js/main.js",
  "/static/img/logo.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // never cache API calls - those must always hit the live server
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res.ok && event.request.method === "GET") {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
