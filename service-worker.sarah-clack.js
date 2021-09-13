/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

importScripts("./inline-scripts/list-cache.js");
importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
workbox.core.skipWaiting();

workbox.core.clientsClaim();

var listURL = [];
const cacheName='static-shell-v1'
self.__precacheManifest = [].concat(resourcesToPrecache|| []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});



self.addEventListener('install', function(e) {
  // eslint-disable-next-line no-console
  console.log('[ServiceWorker] Install');

  //self.skipWaiting();
  // e.waitUntil(
  //   caches.open(cacheName)
  //   .then(function(cache){
  //     return cache.addAll(resourcesToPrecache)
  //   })
  // );
});
// self.addEventListener('appinstalled', (e) => {
//   console.log('Install', 'installed');
// });
self.addEventListener('activate', function(e) {
  // eslint-disable-next-line no-console
  //console.log('[ServiceWorker] Activate');
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
   e.respondWith(caches.match(e.request)
    .then(cachedResponse=>{
      // get all link
      // listURL.push(e.request.url)
      // console.clear();
      // console.log(listURL)
      return cachedResponse || fetch(e.request)
    })
  );

});
