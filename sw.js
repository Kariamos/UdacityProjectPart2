/*Code got from https://developers.google.com/web/tools/workbox/guides/get-started and adapted to my case */


importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

/*if (workbox) {
  console.log(`Yay! Workbox is loaded`);
} else {
  console.log(`Boo! Workbox didn't load `);
}*/

workbox.core.setLogLevel(workbox.core.LOG_LEVELS.error);

workbox.precaching.precacheAndRoute([
  {url: '/index.html'},
  {url: '/restaurant.html?id=1'},
  {url: '/restaurant.html?id=2'},
  {url: '/restaurant.html?id=3'},
  {url: '/restaurant.html?id=4'},
  {url: '/restaurant.html?id=5'},
  {url: '/restaurant.html?id=6'},
  {url: '/restaurant.html?id=7'},
  {url: '/restaurant.html?id=8'},
  {url: '/restaurant.html?id=9'},
  {url: '/restaurant.html?id=10'},
  ]);





workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.networkFirst({
	  cacheName: 'js-cache'
  })
);


workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache'
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Only cache requests for a month
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ]
  })
);







/* NOT USED

var cacheName = 'project1-v1';
var allCaches = [
  cacheName
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        'js/dbhelper.js',
        'js/main.js',
        'css/styles.css',
        'imgs/icon.png',
        'index.html',
        'restaurant.html',
		'js/restaurant_info.js',
		'data/restaurants.json'
      ]);
    })
  );
  console.log("cached");
});

*/