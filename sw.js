// Offline for the web build: pages come from the network when there is one (so updates arrive),
// everything else from the cache once it has been seen. Songs are not here: they live in IndexedDB.
const CACHE = 'victorymusic-v3';
const STATIC = ['./', 'manifest.webmanifest', 'app/icon-192.png', 'app/icon-512.png', 'app/apple-touch-icon.png', 'menu/back.webp', 'menu/middle.webp', 'menu/tlo.jpg'];

// on install: the page, the files it links (hashed by the build, so read from the page itself) and the art
self.addEventListener('install', (e) =>
  e.waitUntil(
    (async () => {
      const c = await caches.open(CACHE);
      const html = await (await fetch('./', { cache: 'no-cache' })).text();
      const linked = [...html.matchAll(/(?:src|href)="(\.?\/?assets\/[^"]+)"/g)].map((m) => m[1]);
      // the entry script and stylesheet name the lazy screens and the fonts, relative to assets/
      const deeper = new Set();
      for (const url of linked) {
        const text = await (await fetch(url)).text();
        for (const m of text.matchAll(/["'(]\.\/([\w.-]+\.(?:js|css|woff2?))["')]/g)) deeper.add(`assets/${m[1]}`);
      }
      await c.addAll([...new Set([...STATIC, ...linked])]);
      // names found inside the code are guesses (the code also mentions ./sw.js): a 404 on one of them
      // must not fail the whole install, as it did on GitHub Pages, which answers missing files with 404
      await Promise.all([...deeper].map((u) => c.add(u).catch(() => undefined)));
      await self.skipWaiting();
    })(),
  ),
);

self.addEventListener('activate', (e) =>
  e.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
      await self.clients.claim();
    })(),
  ),
);

/** Stores a copy; the copy is taken before the response is handed on, or its body is gone. */
const keep = (req, res) => {
  if (res.ok) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => keep(req, res))
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./'))),
    );
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => keep(req, res))));
});
