// Fetch all books from the backend
export async function fetchBooks() {
	try {
		const response = await fetch('http://localhost:3000/api/library');
		if (!response.ok) {
			throw new Error(`Failed to fetch books: ${response.statusText}`);
		}
		return response.json();
	} catch (error) {
		console.error('Error fetching books:', error);
		throw error;
	}
}

// Fetch a specific page of a book
export async function fetchPage(bookId, pageNumber) {
	try {
		const response = await fetch(`http://localhost:3000/api/book/${bookId}/page/${pageNumber}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch page ${pageNumber} for book ${bookId}: ${response.statusText}`);
		}
		return response.json();
	} catch (error) {
		console.error(`Error fetching page ${pageNumber} for book ${bookId}:`, error);
		throw error;
	}
}
