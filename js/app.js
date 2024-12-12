import { fetchBooks, fetchPage } from './api.js'; // Import API functions

// Global State
let currentBookId = null;

// Initialize the App
document.addEventListener('DOMContentLoaded', () => {
	setupLibrary();
	setupPageSlider();
});

// Fetch and Populate the Library
async function setupLibrary() {
	const library = document.getElementById('library');

	try {
		const books = await fetchBooks(); // Fetch books from the backend
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
	} catch (error) {
		console.error('Error loading library:', error);
		library.textContent = 'Failed to load library';
	}
}

// Handle Book Selection
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

// Load a Page's Content
async function loadPage(pageNumber) {
	const bookContent = document.getElementById('book-content');
	bookContent.textContent = 'Loading page...';

	try {
		const pageData = await fetchPage(currentBookId, pageNumber); // Fetch page data
		bookContent.innerHTML = ''; // Clear existing content

		// Create and append the media element
		const mediaElement = document.createElement(pageData.type); // e.g., 'img', 'video'
		mediaElement.src = pageData.src;
		bookContent.appendChild(mediaElement);
	} catch (error) {
		console.error(`Error loading page ${pageNumber}:`, error);
		bookContent.textContent = 'Failed to load page';
	}
}
