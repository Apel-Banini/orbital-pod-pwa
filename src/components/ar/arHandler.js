// arHandler.js
export async function setupARMarkers(db) {
	const markers = await loadMarkers(db);

	markers.forEach(marker => {
		document.getElementById(marker.id).addEventListener('markerFound', () => {
			loadMedia(marker);
		});
	});
}

// Function to load markers from JSON or IndexedDB
async function loadMarkers(db) {
	const markersData = await fetch('/config/markers.json');
	const jsonData = await markersData.json();
	return jsonData.markers;
}

// Function to load media based on marker data
function loadMedia(marker) {
	const mediaElement = document.getElementById('media-entity');

	if (marker.type === 'image') {
		mediaElement.setAttribute('material', `src: url(${marker.media})`);
	} else if (marker.type === 'video') {
		mediaElement.setAttribute('material', `src: url(${marker.media})`);
	} else if (marker.type === 'audio') {
		mediaElement.setAttribute('sound', `src: url(${marker.media}); autoplay: true;`);
	}
}
