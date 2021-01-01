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


importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();

workbox.core.clientsClaim();


const cacheName='static-shell-v1'
const resourcesToPrecache=["./index.html","inline-scripts\/analytics.js","inline-scripts\/app-install.js","inline-scripts\/app.js","inline-scripts\/fallback.js","inline-scripts\/fs-helpers.js","inline-scripts\/idb-keyval-iife.js","inline-scripts\/jscd.js","inline-scripts\/keyboard-events.js","inline-scripts\/load-sw.js","inline-scripts\/menu-edit.js","inline-scripts\/menu-file.js","inline-scripts\/menu-recent.js","inline-scripts\/menu-spelling.js","inline-scripts\/menu-tool.js","inline-scripts\/menu-tools-keyboard.js","inline-scripts\/menu-tools-translate.js","inline-scripts\/menu-view.js","inline-scripts\/menus.js","inline-scripts\/personal-db.js","inline-scripts\/rum.js","inline-scripts\/text-area.js","inline-scripts\/ui-db.js","inline-scripts\/ui.js","styles\/main.css","styles\/print.css","styles\/standalone.css","images\/favicon.png","images\/icon-144.png","images\/icon-192.png","images\/icon-256.png","images\/icon-512.png","images\/icon-72.png","images\/icon-96.png","json\/bo.json","json\/boFull.json","json\/gianPhonThe.json","json\/hanNom.json","json\/hanViet.json","css\/font-awesome.min.css","css\/google-icon-editor.css","fonts\/fontawesome-webfont.eot","fonts\/fontawesome-webfont.woff2","fonts\/google-icon-editor.woff2"];
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

self.addEventListener('activate', function(e) {
  // eslint-disable-next-line no-console
  console.log('[ServiceWorker] Activate');
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  //console.log(e.request);
	// e.respondWith(
	// 	caches.match(e.request) || 
	// 	fetch(e.request)
	// )

  // e.respondWith(caches.match(e.request)
  //   .then(cachedResponse=>{
  //     return cachedResponse || fetch(e.request)
  //   })
  // );

   e.respondWith(caches.match(e.request)
    .then(cachedResponse=>{
      return cachedResponse || fetch(e.request)
    })
  );

});
