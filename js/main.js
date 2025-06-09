// Utility to create Date objects supporting negative years (e.g. "-0500-01-01")
function parseDate(str) {
  if (!str) return null;
  const parts = str.split('-').map(Number);
  const year = parts[0];
  const month = parts[1] - 1 || 0;
  const day = parts[2] || 1;
  return new Date(year, month, day);
}

// Initialize map
const map = L.map('map').setView([41.9, 12.5], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add markers and store references
const markers = {};
for (const evt of events) {
  const marker = L.marker(evt.latlng).addTo(map).bindPopup(evt.popup);
  markers[evt.id] = marker;
  marker.on('click', () => {
    timeline.setSelection(evt.id, { focus: true });
  });
}

// Initialize timeline
const container = document.getElementById('timeline');
const items = new vis.DataSet(
  events.map(evt => ({
    ...evt,
    start: parseDate(evt.start),
    end: evt.end ? parseDate(evt.end) : undefined
  }))
);
const options = {
  height: '100%',
  zoomMin: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
  zoomMax: 1000 * 60 * 60 * 24 * 365 * 3000, // several millennia
  start: parseDate('-0600-01-01'),
  end: parseDate('2050-01-01')
};
const timeline = new vis.Timeline(container, items, options);

timeline.on('select', props => {
  const id = props.items[0];
  if (id && markers[id]) {
    const marker = markers[id];
    map.setView(marker.getLatLng(), 8);
    marker.openPopup();
  }
});
