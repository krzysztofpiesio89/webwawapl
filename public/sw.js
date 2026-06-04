// Gracefully handle legacy service worker registrations from localhost to prevent 404 errors
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});
