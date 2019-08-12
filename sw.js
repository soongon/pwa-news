const cacheName = 'news-static';
const staticAsseets = [
    './',
    './styles.css',
    './app.js',
    './fallback.json',
    './images/fetch-dog.jpg'
];

self.addEventListener('install',  async evt => {
    console.log('[Service Worker] installed..');
    const cache = await caches.open(cacheName);
    cache.addAll(staticAsseets);
});

self.addEventListener('fetch', evt => {
    const req = evt.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        evt.respondWith(cacheFirst(req));
    } else {
        evt.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);

    try {
        const res = await fetch(req);
        await cache.put(req, res.clone());
        return res;
    } catch (err) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}