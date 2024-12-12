// api.js - Exporting functions to be imported in app.js

export async function fetchBooks() {
	try {
		const response = await fetch('/api/books'); // Adjust the path as necessary
		if (!response.ok) throw new Error('Failed to fetch books');
		return await response.json();
	} catch (error) {
		console.error('Error fetching books:', error);
		throw error;
	}
}

export async function fetchPage(bookId, pageNumber) {
	try {
		const response = await fetch(`/api/book/${bookId}/page/${pageNumber}`); // Adjust the path as necessary
		if (!response.ok) throw new Error('Failed to fetch page');
		return await response.json();
	} catch (error) {
		console.error(`Error fetching page ${pageNumber} for book ${bookId}:`, error);
		throw error;
	}
}
