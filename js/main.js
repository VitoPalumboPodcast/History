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
const timelineEl = document.getElementById('timeline');
const timelineContainer = document.getElementById('timeline-container');
const indicator = document.getElementById('indicator');

const items = new vis.DataSet(events);
const options = {
  height: '100%'
};
const timeline = new vis.Timeline(timelineEl, items, options);

// calculate global time range
let minTime = Infinity;
let maxTime = -Infinity;
for (const evt of events) {
  const start = new Date(evt.start).getTime();
  const end = new Date(evt.end).getTime();
  if (start < minTime) minTime = start;
  if (end < minTime) minTime = end;
  if (start > maxTime) maxTime = start;
  if (end > maxTime) maxTime = end;
}
minTime = new Date(minTime);
maxTime = new Date(maxTime);

function updateIndicator() {
  const windowRange = timeline.getWindow();
  const center = new Date((windowRange.start.getTime() + windowRange.end.getTime()) / 2);
  const progress = (center - minTime) / (maxTime - minTime);
  const width = timelineContainer.clientWidth;
  indicator.style.left = (progress * width) + 'px';
}

timeline.on('rangechanged', updateIndicator);
updateIndicator();

timeline.on('select', props => {
  const id = props.items[0];
  if (id && markers[id]) {
    const marker = markers[id];
    map.setView(marker.getLatLng(), 8);
    marker.openPopup();
  }
});
