const CACHE_NAME = 'orbital-pod-cache-v3'; // Cache versioning
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/css/styles.css',
	'/js/app.js',
	'/assets/favicon.ico',
	'/assets/logo.png',
	'/assets/background.jpg',
	// Add other static assets like images and CSS here
];

// Dynamically cache media files (like books, chapters, audio, etc.)
const DYNAMIC_ASSETS = [
	'/books/book1/index.html', // Example book page
	'/books/book1/cover.jpg', // Example image file
	'/books/book1/chapter1.mp3', // Example audio file
	// Add more book and media assets here
];

// Install Event - Cache static assets
self.addEventListener('install', event => {
	console.log('Service Worker installing...');
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(cache => {
				console.log('Caching static files');
				return cache.addAll(STATIC_ASSETS);
			})
			.catch(error => {
				console.error('Error caching files during install:', error);
			})
	);
});

// Activate Event - Remove outdated caches
self.addEventListener('activate', event => {
	console.log('Service Worker activating...');
	const cacheWhitelist = [CACHE_NAME]; // Only keep the current cache version
	event.waitUntil(
		caches
			.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cacheName => {
						if (!cacheWhitelist.includes(cacheName)) {
							console.log('Deleting old cache:', cacheName);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.catch(error => {
				console.error('Error during cache activation:', error);
			})
	);
});

// Fetch Event - Cache First, then Network (for static files)
// Network First strategy (for dynamic content like books or API requests)
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(cachedResponse => {
			// Serve from cache if available
			if (cachedResponse) {
				console.log('Serving from cache:', event.request.url);
				return cachedResponse;
			}

			// Otherwise, fetch from the network
			return fetch(event.request)
				.then(networkResponse => {
					// Only cache successful responses
					if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
						const clonedResponse = networkResponse.clone();
						caches.open(CACHE_NAME).then(cache => {
							// Cache the dynamic content (like books, media, API responses)
							if (DYNAMIC_ASSETS.some(url => event.request.url.includes(url))) {
								cache.put(event.request, clonedResponse);
							}
						});
					}
					return networkResponse;
				})
				.catch(error => {
					console.error('Fetch failed; serving fallback:', error);
					// Serve fallback page if network fails (optional, like an offline page)
					return caches.match('/index.html');
				});
		})
	);
});

// Optional: Background sync to handle network re-connection (if needed)
self.addEventListener('sync', event => {
	if (event.tag === 'sync-books') {
		event.waitUntil(syncBooks());
	}
});

// Sync function for background tasks (e.g., syncing data when the network is back)
async function syncBooks() {
	console.log('Syncing books with the server...');
	// Implement syncing logic (e.g., sending offline changes to the server)
}
