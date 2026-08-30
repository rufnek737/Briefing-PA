const CACHE = 'briefing-v4';
const STATIC = ['./manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 페이지 네비게이션 (index.html 포함): 항상 네트워크 우선
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // 나머지: 캐시 우선, 없으면 네트워크
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
