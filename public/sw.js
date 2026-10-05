const CACHE_NAME = 'gym-tracker-v2.3';

const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/images/icon.svg',
  '/images/favicon.svg',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/icon-maskable-192.png',
  '/images/icon-maskable-512.png',
  '/images/apple-touch-icon.png',
  '/images/bench_press_form.jpg',
  '/images/lat_pulldown_form.jpg',
  '/images/rdl_form.jpg',
  '/images/squat_form.jpg',
  '/images/leg_press_form.jpg',
  '/images/shoulder_press_form.jpg',
  '/images/face_pull_form.jpg',
  '/images/seated_row_form.jpg',
  '/images/tricep_pushdown_form.jpg',
  '/images/bicep_curl_form.jpg'
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches & take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Offline-first with Stale-While-Revalidate for performance
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Strategy for HTML documents: Network-first, fallback to cache
  if (request.mode === 'navigate') {
    // If accessing legacy /index.html from old PWA shortcut, fetch root /
    const targetUrl = (url.pathname === '/index.html' || url.pathname.endsWith('/index.html')) ? '/' : request;

    event.respondWith(
      fetch(targetUrl)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            return response;
          }
          if (response && response.status === 404) {
            // If navigation returns 404 (e.g. stale PWA index.html), fall back to root page
            return caches.match('/').then((cached) => cached || fetch('/'));
          }
          return response;
        })
        .catch(() => caches.match('/') || caches.match(request))
    );
    return;
  }

  // Strategy for Fonts (Google Fonts) & Images: Cache-first with network fallback
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy for other assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => {/* Offline fallback */});

      return cachedResponse || fetchPromise;
    })
  );
});
