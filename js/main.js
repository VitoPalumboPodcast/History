// Initialize map
const map = L.map('map').setView([41.9, 12.5], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Prepare markers for all events
const markers = {};
for (const evt of events) {
  const marker = L.marker(evt.latlng).bindPopup(evt.popup);
  markers[evt.id] = marker;
  marker.on('click', () => {
    timeline.setSelection(evt.id, { focus: true });
  });
}

// Initialize timeline and groups
const container = document.getElementById('timeline');
const items = new vis.DataSet();
const groups = new vis.DataSet();
let currentEvents = events.slice();

function buildDatasets(list) {
  items.clear();
  groups.clear();
  const cats = new Set();
  for (const evt of list) {
    items.add({
      id: evt.id,
      content: evt.content,
      start: evt.start,
      end: evt.end,
      group: evt.category,
      className: 'category-' + evt.category
    });
    cats.add(evt.category);
  }
  for (const c of cats) {
    groups.add({ id: c, content: c });
  }
}

buildDatasets(currentEvents);

const timeline = new vis.Timeline(container, items, { height: '100%' });
timeline.setGroups(groups);

timeline.on('select', props => {
  const id = props.items[0];
  if (id && markers[id]) {
    const marker = markers[id];
    map.setView(marker.getLatLng(), 8);
    marker.openPopup();
  }
});

function updateMarkers(list) {
  const visible = new Set(list.map(e => e.id));
  for (const [id, marker] of Object.entries(markers)) {
    if (visible.has(Number(id))) {
      if (!map.hasLayer(marker)) marker.addTo(map);
    } else if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  }
}

const regionFilter = document.getElementById('regionFilter');
regionFilter.addEventListener('change', applyFilter);

function applyFilter() {
  const region = regionFilter.value;
  currentEvents = region === 'all' ? events : events.filter(e => e.region === region);
  buildDatasets(currentEvents);
  timeline.setGroups(groups);
  timeline.fit();
  updateMarkers(currentEvents);
}

timeline.on('rangechanged', props => {
  const start = props.start;
  const end = props.end;
  const list = currentEvents.filter(e => new Date(e.start) <= end && new Date(e.end) >= start);
  updateMarkers(list);
});

updateMarkers(currentEvents);
