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

// Prepare empire layers
const empireLayers = {};
for (const emp of empires) {
  const firstSeg = emp.segments[0];
  const layer = L.polygon(firstSeg.coordinates, emp.style).bindPopup(emp.name);
  empireLayers[emp.name] = { layer, currentSegment: null };
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

function updateEmpires() {
  const range = timeline.getWindow();
  const start = range.start;
  const end = range.end;

  for (const emp of empires) {
    const info = empireLayers[emp.name];
    const layer = info.layer;

    let seg = null;
    for (const s of emp.segments) {
      const segStart = new Date(s.start);
      const segEnd = new Date(s.end);
      if (segEnd >= start && segStart <= end) {
        seg = s;
        break;
      }
    }

    if (seg) {
      if (info.currentSegment !== seg) {
        layer.setLatLngs(seg.coordinates);
        info.currentSegment = seg;
      }
      if (!map.hasLayer(layer)) {
        layer.addTo(map);
      }
    } else if (map.hasLayer(layer)) {
      map.removeLayer(layer);
      info.currentSegment = null;
    }
  }
}

timeline.on('rangechanged', updateEmpires);
updateEmpires();
