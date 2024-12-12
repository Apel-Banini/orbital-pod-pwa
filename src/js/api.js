// api.js
export async function fetchBooks() {
	const response = await fetch('/api/books');
	if (!response.ok) {
		throw new Error('Failed to fetch books');
	}
	return await response.json(); // or appropriate data format
}

export async function fetchPage(bookId, pageNumber) {
	const response = await fetch(`/api/books/${bookId}/pages/${pageNumber}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch page ${pageNumber}`);
	}
	return await response.json();
}
