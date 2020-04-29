const CACHE_NAME = 'ventilate-{{version}}-{{randomNumber}}';

// Never cache
const nc = [
  /\.map$/,
  /^manifest.*\.js(?:on)?$/,
  /\.htaccess/,
];

// Network first
const nf = [
  // /^http.*series.json/,
  // /series.json/,
  // /players.json/,
  // /series\//,
]

// StaleWhileRevalidate
const swr = [
  /^http.*polyfill.min.js/, 
  // /^http.*rollbar.min.js/, 
  // /^http.*dic-extra*.json/,
];

// Precache bundle names e.g. main-92h028.js instead of main.js
let pcb = {{{resourceList}}};
pcb.push('/'); // add root to cache

const precacheFiles = [
  // 'dictionaryZ.json'
];

self.addEventListener('install', function(event) {
  console.log(`Install event called for ${  CACHE_NAME}`);
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`Adding files to cache ${  CACHE_NAME  }...`);
      cache.addAll(pcb.concat(precacheFiles));
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log(`Activate event called for ${  CACHE_NAME}`);
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME !== cacheName) {
            console.log(`Removing old cache: ${  cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Parse the URL:
  const requestURL = new URL(event.request.url);

  const isSWR = swr.reduce(function(hadMatch, nextRegex){
    return hadMatch || nextRegex.test(requestURL);
  }, false);

  if(isSWR) {
    StaleWhileRevalidate(event);
    return;
  }

  const isNC = nc.reduce(function(hadMatch, nextRegex){
    return hadMatch || nextRegex.test(requestURL);
  }, false);

  if(isNC) {
    NetworkOnly(event);
    return;
  }

  const isNF = nf.reduce(function(hadMatch, nextRegex){
    return hadMatch || nextRegex.test(requestURL);
  }, false);

  if(isNF) {
    NetworkWithCacheFallback(event);
    return;
  }

  // same origin
  if((new RegExp(`^${  self.origin}`)).test(requestURL))  CacheWithNetworkFallback(event);

});

/**
 * If it's in the cache use it. But always then go to the network for a fresher
 * version and put that in the cache.
 */
var StaleWhileRevalidate = function(event) {
  const id = (Math.random()*1000000).toString().substr(0,4);
  console.log(`${id}|| SWR for: ${  event.request.url}`);
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        console.log(`${id}|| SWR in cache: `, !!response);
        const fetchPromise = fetch(event.request).then(function(networkResponse) {
          console.log(`${id}|| SWR caching the network response`);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        console.log(`${id}|| SWR returning response or fetchPromise`);
        return response || fetchPromise;
      })
    })
  );
}

var CacheWithNetworkFallback = function(event){
  const id = (Math.random()*1000000).toString().substr(0,4);
  console.log(`${id}|| CWNF for: ${  event.request.url}`);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log(`${id}|| CWNF in cache: ${  !!response}`);
      return response || fetch(event.request);
    })
  );
}

var NetworkWithCacheFallback = function(event){
  const id = (Math.random()*1000000).toString().substr(0,4);
  console.log(`${id}|| NWCF for: ${  event.request.url}`);
  event.respondWith(
    fetch(event.request).catch(function() {
      console.log(`${id}|| NWCF failed - check cache: ${  !!response}`);
      return caches.match(event.request);
    })
  );
}

var NetworkOnly = function(event) {
  console.log(`${event.request.url  } || network only`)
  event.respondWith(fetch(event.request));
}