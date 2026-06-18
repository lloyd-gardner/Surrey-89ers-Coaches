// Surrey 89ers Coaches Hub — Service Worker
const CACHE = '89ers-hub-v1';
const CORE = [
  '/index.html',
  '/practice-plan.html',
  '/time-tracking.html',
  '/drill-tracking.html',
  '/practice-videos.html',
  '/attendance.html',
  '/players.html',
  '/schedule.html',
  '/game-schedule.html',
  '/video-library.html',
  '/recruitment.html',
];

// Install — cache core pages
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

// Activate — clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses for HTML pages
        if (res.ok && e.request.url.includes(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
