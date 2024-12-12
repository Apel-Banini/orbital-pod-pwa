// dbService.js
export async function openDatabase() {
	const db = await openDB('booksMediaDB', 1, {
		upgrade(db) {
			const store = db.createObjectStore('books', { keyPath: 'id' });
			store.createIndex('by-title', 'title');
		},
	});
	return db;
}

export async function getBooks(db) {
	const store = db.transaction('books').objectStore('books');
	const books = [];
	const cursor = await store.openCursor();

	while (cursor) {
		books.push(cursor.value);
		cursor.continue();
	}
	return books;
}
