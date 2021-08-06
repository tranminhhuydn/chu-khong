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

var listURL = [];
const cacheName='static-shell-v1'
const resourcesToPrecache =[
    "index.html",
    "inline-scripts/analytics.js",
    "styles/main.css",
    "styles/standalone.css",
    "css/google-icon-editor.css",
    "css/font-awesome.min.css",
    "json/hanViet.json",
    "json/hanNom.json",
    "json/gianPhonThe.json",
    "jszip/jszip.min.js",
    "inline-scripts/plugin-recode-text.js",
    "inline-scripts/idb-keyval-iife.js",
    "inline-scripts/rum.js",
    "inline-scripts/app.js",
    "inline-scripts/menus.js",
    "inline-scripts/text-area.js",
    "inline-scripts/fs-helpers.js",
    "inline-scripts/menu-file.js",
    "inline-scripts/menu-edit.js",
    "inline-scripts/menu-tool.js",
    "inline-scripts/menu-tools-keyboard.js",
    "inline-scripts/menu-tools-translate.js",
    "inline-scripts/menu-spelling.js",
    "inline-scripts/menu-view.js",
    "inline-scripts/menu-recent.js",
    "inline-scripts/ui.js",
    "inline-scripts/ui-db.js",
    "inline-scripts/loadDB.js",
    "inline-scripts/personal-db.js",
    "inline-scripts/keyboard-events.js",
    "inline-scripts/load-sw.js",
    "inline-scripts/app-install.js",
    "inline-scripts/fallback.js",
    "inline-scripts/jscd.js",
    "styles/print.css",
    "fonts/google-icon-editor.woff2",
    "images/icon-192.png",
    '/tu-dien-thieu-chuu/hanviet/dbzip/bktd_dv.json.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/CV_Lac_Viet_Hoa_Viet.json.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/Free_Chinese_Vietnamese.json.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/Han_Hoa_Anh.json.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/Han_viet_dai_tu_dien.json.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_3_0.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_3_1.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_3_2.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/Khang_Hi.json.zip',
    '/tu-dien-thieu-chuu/hanviet/dbzip/Nguyen_Quoc_Hung.json.zip',
    "images/favicon.png"
];
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
