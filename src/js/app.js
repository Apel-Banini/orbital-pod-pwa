// app.js - Main app logic for interacting with the DOM and fetching data

import { fetchBooks, fetchPage } from './api.js'; // Import functions for data fetching

// Global State
let currentBookId = null;

// Initialize the App
document.addEventListener('DOMContentLoaded', () => {
	setupLibrary();
	setupPageSlider();
	setupErrorHandling();
});

// Setup the Library by fetching the books and displaying them
async function setupLibrary() {
	const library = document.getElementById('library');
	library.innerHTML = 'Loading...';

	try {
		const books = await fetchBooks(); // Fetch books from the backend
		displayBooks(books);
	} catch (error) {
		library.textContent = 'Failed to load library.';
		console.error('Error loading library:', error);
	}
}

// Display books in the UI
function displayBooks(books) {
	const library = document.getElementById('library');
	library.innerHTML = ''; // Clear any existing content

	books.forEach(book => {
		const bookElement = document.createElement('div');
		bookElement.className = 'book';
		bookElement.textContent = book.title;
		bookElement.addEventListener('click', () => {
			selectBook(book.id);
		});
		library.appendChild(bookElement);
	});
}

// Handle Book Selection and load the first page
function selectBook(bookId) {
	currentBookId = bookId;
	console.log(`Selected book ID: ${bookId}`);
	loadPage(1); // Load the first page by default
}

// Setup Page Slider Interaction
function setupPageSlider() {
	const pageSlider = document.getElementById('page-slider');
	pageSlider.addEventListener('input', event => {
		const pageNumber = event.target.value;
		loadPage(pageNumber);
	});
}

// Load the content of the selected page
async function loadPage(pageNumber) {
	const bookContent = document.getElementById('book-content');
	bookContent.textContent = 'Loading page...';

	try {
		const pageData = await fetchPage(currentBookId, pageNumber); // Fetch page data from the backend
		displayPage(pageData);
	} catch (error) {
		bookContent.textContent = 'Failed to load page';
		console.error(`Error loading page ${pageNumber}:`, error);
	}
}

// Display the fetched page data in the DOM
function displayPage(pageData) {
	const bookContent = document.getElementById('book-content');
	bookContent.innerHTML = ''; // Clear existing content

	const mediaElement = document.createElement(pageData.type); // 'img', 'video', etc.
	mediaElement.src = pageData.src; // src from the fetched pageData
	bookContent.appendChild(mediaElement);
}

// Error Handling: display a user-friendly message
function setupErrorHandling() {
	window.addEventListener('error', event => {
		console.error('Global Error:', event.message);
		const errorDisplay = document.getElementById('error-display');
		errorDisplay.textContent = 'Something went wrong. Please try again later.';
	});

	// Handle unhandled promise rejections
	window.addEventListener('unhandledrejection', event => {
		console.error('Unhandled Rejection:', event.reason);
		const errorDisplay = document.getElementById('error-display');
		errorDisplay.textContent = 'Something went wrong. Please try again later.';
	});
}
