// Import the idb library for IndexedDB functionality
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7.0.1/+esm'; // CDN link for idb library

// Function to open IndexedDB and create object stores for books and media
async function openDatabase() {
	const db = await openDB('booksMediaDB', 1, {
		upgrade(db) {
			console.log('Opening database and creating object stores...');

			// Create 'books' store with 'id' as the primary key
			const booksStore = db.createObjectStore('books', { keyPath: 'id' });
			booksStore.createIndex('by-title', 'title'); // Index by title for easy lookup

			// Create 'media' store for media files (e.g., images, videos, etc.)
			const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
			mediaStore.createIndex('by-type', 'type'); // Index by media type
		},
	});

	console.log('Database opened:', db);
	return db; // Return the opened database instance
}

// Function to store a book in the 'books' store
async function storeBook(db, bookId, bookData) {
	const transaction = db.transaction('books', 'readwrite'); // Start a read-write transaction
	const store = transaction.objectStore('books');
	await store.put({ id: bookId, ...bookData }); // Store the book with its data

	console.log('Stored book:', bookData); // Log the stored book data
}

// Function to store media files (e.g., images, audio, etc.) in the 'media' store
async function storeMedia(db, mediaId, mediaBlob, type) {
	const transaction = db.transaction('media', 'readwrite'); // Start a read-write transaction
	const store = transaction.objectStore('media');
	await store.put({ id: mediaId, blob: mediaBlob, type }); // Store the media file

	console.log('Stored media:', { mediaId, type }); // Log stored media details
}

// Function to retrieve all books from the 'books' store
async function getBooks(db) {
	const store = db.transaction('books').objectStore('books');
	const books = [];
	let cursor = await store.openCursor(); // Open a cursor to iterate through books

	// Iterate through all books in the store
	console.log('Fetching books...');
	while (cursor) {
		console.log('Fetched book:', cursor.value); // Log each book as it's fetched
		books.push(cursor.value); // Add the book to the array
		cursor = await cursor.continue(); // Move to the next item in the store
	}

	console.log('All books fetched:', books); // Log the entire array of books
	return books; // Return the array of books
}

// Function to retrieve a specific book by its ID from the 'books' store
async function getBook(db, bookId) {
	const store = db.transaction('books').objectStore('books');
	const book = await store.get(bookId); // Fetch the book by its ID
	return book || null; // Return the book data or null if not found
}

// Function to retrieve a media file by its ID from the 'media' store
async function getMedia(db, mediaId) {
	const store = db.transaction('media').objectStore('media');
	const mediaFile = await store.get(mediaId); // Fetch the media file by its ID
	return mediaFile ? mediaFile.blob : null; // Return the media blob or null if not found
}

// Function to test storing and retrieving books and media (useful for development/testing)
async function testDatabase() {
	const db = await openDatabase(); // Open the IndexedDB

	// Sample book data
	const bookData = {
		title: 'Sample Book Title',
		author: 'Sample Author',
		chapters: ['Chapter 1', 'Chapter 2'],
		coverImage: '/books/book1/cover.jpg',
	};

	// Store the book in IndexedDB
	await storeBook(db, 'book1', bookData);

	// Retrieve the book from IndexedDB
	const book = await getBook(db, 'book1');
	console.log('Loaded Book:', book); // Log the retrieved book

	// Sample media data (e.g., an image or audio file)
	const mediaBlob = new Blob(
		[
			/* media file content */
		],
		{ type: 'image/png' }
	);
	await storeMedia(db, 'media1', mediaBlob, 'image'); // Store the media file

	// Retrieve the media file
	const media = await getMedia(db, 'media1');
	console.log('Loaded Media:', media); // Log the retrieved media file (blob)
}

// Function to store a sample book manually (for testing purposes)
async function storeSampleBook() {
	const db = await openDatabase();
	const sampleBook = {
		id: 'book1',
		title: 'Sample Book Title',
		author: 'Sample Author',
		chapters: ['Chapter 1', 'Chapter 2'],
		coverImage: '/path/to/cover-image.jpg',
	};

	await storeBook(db, 'book1', sampleBook);
	console.log('Sample book stored:', sampleBook); // Log the sample book stored
}

// Call the storeSampleBook function to add a book
storeSampleBook();

// Export functions for use in other modules
export { openDatabase, storeBook, storeMedia, getBooks, getBook, getMedia, testDatabase };
