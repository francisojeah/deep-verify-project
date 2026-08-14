/**
 * Kill switch for a service worker this site no longer ships.
 *
 * The previous worker was template leftovers from an unrelated project. It
 * routed every .js and .css request through a CacheFirst strategy, so returning
 * visitors kept whichever build they first loaded no matter what was deployed
 * afterwards. This site has no offline requirement, so the worker is gone rather
 * than retuned.
 *
 * This file stays at the same URL the old worker was registered from. Browsers
 * re-check that script on navigation, pick this up, and unregister themselves.
 * Removing the file instead would leave those browsers on the stale worker.
 */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();

      // One reload so an open tab drops the stale assets it is already running.
      // Cannot loop: the worker is unregistered by this point.
      const windows = await self.clients.matchAll({ type: "window" });
      windows.forEach((client) => client.navigate(client.url));
    })(),
  );
});
