// Import the IndexedDB utility
import { openDatabase } from './indexeddb.js';

// Global variable to hold the current book ID
let currentBookId = null;

// Initialize the app once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	setupLibrary(); // Initialize library
	setupPageSlider(); // Set up the page slider
	setupErrorHandling(); // Set up global error handling
});

// **Setup Library** - Load books from IndexedDB
async function setupLibrary() {
	console.log('Setting up the library...');
	const library = document.getElementById('library');
	library.innerHTML = 'Loading...';

	try {
		const db = await openDatabase(); // Open the database
		const books = await getBooks(db); // Fetch books from IndexedDB
		displayBooks(books); // Display books in the UI
	} catch (error) {
		library.textContent = 'Failed to load library.';
		console.error('Error loading library:', error);
		showError(error.message); // Display error message
	}
}

// **Get Books** - Fetch all books from IndexedDB
async function getBooks(db) {
	const store = db.transaction('books').objectStore('books');
	const books = [];
	let cursor = await store.openCursor();

	while (cursor) {
		books.push(cursor.value); // Add each book to the array
		cursor = await cursor.continue(); // Continue to next item
	}

	console.log('Books fetched:', books);
	return books;
}

// **Display Books** - Render the fetched books in the UI
function displayBooks(books) {
	const library = document.getElementById('library');
	library.innerHTML = ''; // Clear any existing content

	if (books.length === 0) {
		library.innerHTML = 'No books available';
		return;
	}

	books.forEach(book => {
		const bookElement = document.createElement('div');
		bookElement.className = 'book';
		bookElement.textContent = book.title;
		bookElement.addEventListener('click', () => {
			selectBook(book.id); // Handle book selection
		});
		library.appendChild(bookElement); // Add book to the library
	});
}

// **Handle Book Selection** - Load selected book and page
function selectBook(bookId) {
	currentBookId = bookId;
	console.log(`Selected book ID: ${bookId}`);
	loadBook(bookId); // Load the selected book data
	loadPage(1); // Load the first page of the book

	// Enable the page slider after selecting a book
	const pageSlider = document.getElementById('page-slider');
	pageSlider.disabled = false;
	updatePageNumber(1); // Set the initial page number
}

// **Load Book** - Fetch the selected book from IndexedDB
async function loadBook(bookId) {
	const db = await openDatabase();
	const book = await getBook(db, bookId); // Fetch the book by ID
	console.log('Loaded Book:', book);

	if (book) {
		console.log(`Book Details: ${book.title}, ${book.author}`);
	} else {
		console.error(`Book with ID ${bookId} not found`);
	}
}

// **Get a Single Book** - Retrieve a book by ID
async function getBook(db, bookId) {
	const store = db.transaction('books').objectStore('books');
	return await store.get(bookId); // Fetch the book from the database
}

// **Page Slider Interaction** - Update page number based on slider input
function setupPageSlider() {
	const pageSlider = document.getElementById('page-slider');
	pageSlider.addEventListener('input', event => {
		const pageNumber = event.target.value;
		loadPage(pageNumber); // Load content for the selected page
		updatePageNumber(pageNumber); // Update the displayed page number
	});
}

// **Update Page Number** - Display the current page number
function updatePageNumber(pageNumber) {
	const pageNumberDisplay = document.getElementById('page-number');
	pageNumberDisplay.textContent = `Page: ${pageNumber}`;
}

// **Load Page** - Fetch the content for a specific page of the selected book
async function loadPage(pageNumber) {
	const bookContent = document.getElementById('book-content');
	bookContent.textContent = 'Loading page...';

	try {
		const pageData = await fetchPage(currentBookId, pageNumber); // Fetch page data
		displayPage(pageData); // Display the content of the page
	} catch (error) {
		bookContent.textContent = 'Failed to load page';
		console.error(`Error loading page ${pageNumber}:`, error);
		showError(error.message); // Display error message
	}
}

// **Fetch Page Data** - Simulate fetching page content (image or media)
async function fetchPage(bookId, pageNumber) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (pageNumber > 0) {
				resolve({ type: 'img', src: `/books/${bookId}/page${pageNumber}.jpg` });
			} else {
				reject('Invalid page number');
			}
		}, 1000); // Simulated delay
	});
}

// **Display Page** - Show the fetched page content (image, etc.)
function displayPage(pageData) {
	const bookContent = document.getElementById('book-content');
	bookContent.innerHTML = ''; // Clear previous content

	const mediaElement = document.createElement(pageData.type); // 'img', 'video', etc.
	mediaElement.src = pageData.src; // Set the media source (image, video, etc.)
	bookContent.appendChild(mediaElement); // Display the media in the content area
}

// **Global Error Handling** - Display user-friendly error messages
function setupErrorHandling() {
	window.addEventListener('error', event => {
		console.error('Global Error:', event.message);
		showError(event.message); // Display error message to the user
	});

	window.addEventListener('unhandledrejection', event => {
		console.error('Unhandled Rejection:', event.reason);
		showError(event.reason.message); // Display error message to the user
	});
}

// **Show Error** - Display a user-friendly error message
function showError(message) {
	const errorDisplay = document.getElementById('error-display');
	errorDisplay.textContent = `Error: ${message}`;
}

// **Service Worker Registration** - Register the service worker for offline use
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js') // Ensure this points to the correct location
			.then(registration => {
				console.log('Service Worker registered with scope:', registration.scope);
			})
			.catch(error => {
				console.log('Service Worker registration failed:', error);
			});
	});
}

// **Toast Notification** - Show a toast notification on events like errors
function showToast(message) {
	const toast = document.createElement('div');
	toast.className = 'toast';
	toast.textContent = message;
	document.body.appendChild(toast);
	setTimeout(() => {
		toast.classList.add('show');
	}, 100);
	setTimeout(() => {
		toast.classList.remove('show');
		toast.remove();
	}, 3000);
}
