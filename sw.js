/**
 * Nettoyage de l'ancien service worker.
 *
 * Cette version ne met plus l'invitation en cache. Lorsqu'un ancien service
 * worker est encore installé (notamment dans le navigateur intégré Messenger),
 * son prochain contrôle de mise à jour charge ce fichier, efface les anciens
 * caches puis se désinscrit.
 */
const LEGACY_CACHE_PREFIX = 'invitation-digitale';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(LEGACY_CACHE_PREFIX))
        .map((key) => caches.delete(key))
    );
    await self.registration.unregister();
    await self.clients.claim();
  })());
});
