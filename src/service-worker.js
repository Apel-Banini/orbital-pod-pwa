const CACHE_NAME = 'orbital-pod-cache-v2'; // Updated cache version
const urlsToCache = [
	'/',
	'/index.html',
	'/css/styles.css',
	'/js/app.js',
	'/assets/favicon.ico',
	'/assets/logo.png',
	'/assets/background.jpg', // Add other assets as necessary
	'/books/book1/index.html', // Example book page
	'/books/book1/cover.jpg', // Example image file
	'/books/book1/chapter1.mp3', // Example audio file
	// Add more books and media here
];

// Install Service Worker and cache important assets
self.addEventListener('install', event => {
	console.log('Service Worker installing...');
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			console.log('Caching essential files');
			return cache.addAll(urlsToCache);
		})
	);
});

// Fetch Event - Serve from Cache First, then Network
self.addEventListener('fetch', event => {
	event.respondWith(
		caches
			.match(event.request)
			.then(response => {
				// If the request is cached, return the cached response
				if (response) {
					console.log('Serving from cache:', event.request.url);
					return response;
				}

				// Otherwise, fetch from the network and cache the response
				return fetch(event.request).then(networkResponse => {
					// Check if the response is valid before caching
					if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
						return networkResponse;
					}

					// Clone the response and cache it
					const responseToCache = networkResponse.clone();
					caches.open(CACHE_NAME).then(cache => {
						cache.put(event.request, responseToCache);
					});
					return networkResponse;
				});
			})
			.catch(error => {
				console.error('Fetch failed; serving fallback page', error);
				// Optionally, return a fallback page in case of network failure
				return caches.match('/index.html');
			})
	);
});

// Activate Service Worker and Clean Old Caches
self.addEventListener('activate', event => {
	console.log('Service Worker activating...');
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					// Delete outdated caches
					if (cacheName !== CACHE_NAME) {
						console.log('Deleting old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

self.addEventListener('install', event => {
	console.log('Service Worker installing...');
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			console.log('Caching essential files');
			return cache.addAll(urlsToCache).catch(error => {
				console.error('Error caching files:', error);
			});
		})
	);
});
