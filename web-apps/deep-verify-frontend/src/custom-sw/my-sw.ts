/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache essential assets for the sports website.
precacheAndRoute(self.__WB_MANIFEST);

// Define common cache plugin options.
const commonCacheOptions = {
  plugins: [
    new ExpirationPlugin({ maxEntries: 50 }),
  ],
};

// Cache images, CSS, and JS files with CacheFirst strategy.
registerRoute(
  /\.(?:png|jpg|svg)$/,
  new CacheFirst({
    cacheName: 'images-cache',
    ...commonCacheOptions,
  })
);

registerRoute(
  /\.(?:css|js)$/,
  new CacheFirst({
    cacheName: 'css-js-cache',
    ...commonCacheOptions,
  })
);

// Cache API responses using appropriate strategies.
// Example endpoints from appApi are used here, replace them with your actual endpoints.
const apiEndpoints = [
  { url: "/seasons", cacheName: "seasons-cache" },
  { url: "/videos", cacheName: "videos-cache" },
  { url: "/videos/videos-with-limit/:maxLimit", cacheName: "videos-limit-cache" },
  { url: "/posts/:postId", cacheName: "posts-cache" },
  { url: "/posts/season/:seasonId", cacheName: "season-posts-cache" },
  { url: "/posts/season/:seasonId/posts-with-limit/:maxLimit", cacheName: "season-posts-limit-cache" },
  // { url: "/pictures/:pictureId", cacheName: "pictures-cache" },
  // { url: "/pictures/season/:seasonId/:sport", cacheName: "season-pictures-cache" },
  // { url: "/pictures/season/:seasonId/:seasonId/pictures-with-limit/:maxLimit", cacheName: "season-pictures-limit-cache" },
  { url: "/standings", cacheName: "standings-cache" },
  { url: "/standings/season/:seasonId", cacheName: "season-standings-cache" },
  { url: "/standings/:seasonId/:division/:sport", cacheName: "division-sport-standings-cache" },
  { url: "/players/:seasonId/:division/:sport", cacheName: "division-sport-players-cache" },
  { url: "/players/:seasonId", cacheName: "season-players-cache" },
  { url: "/players/season/current-season-count", cacheName: "current-season-count-cache" },
  { url: "/fixture-results/:seasonId/:division/:sport", cacheName: "fixture-results-cache" },
  { url: "/fixture-results", cacheName: "all-fixture-results-cache" },
  // Add more endpoints here as needed
];


apiEndpoints.forEach(({ url, cacheName }) => {
  registerRoute(
    url,
    new NetworkFirst({
      cacheName,
      ...commonCacheOptions,
    })
  );
});
// Cache static assets such as logos, icons, and fonts with CacheFirst strategy.
registerRoute(
  /\.(?:ico|svg|woff2)$/,
  new CacheFirst({
    cacheName: 'static-assets-cache',
    ...commonCacheOptions,
  })
);

// Push notification event listener for live updates.
self.addEventListener('push', event => {
  const data = event.data?.json();
  if (!data) return;

  const options = {
    body: data.body,
    icon: '/assets/images/logo.png',
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Push subscription change event listener.
self.addEventListener('pushsubscriptionchange', async event => {
  const subscription = await self.registration.pushManager.getSubscription();
  console.log(event)
  if (subscription) {
    const successful = await subscription.unsubscribe();
    if (successful) {
      try {
        await fetch('/api/unsubscribe', { method: 'POST' });
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    }
  }
});

// Message event listener to trigger skipWaiting.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
