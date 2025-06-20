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

// Prepare additional object layers
const objectLayers = [];
for (const obj of objects) {
  let layer;
  if (obj.type === 'marker') {
    layer = L.marker(obj.latlng, obj.style || {}); // Pass empty object if style is undefined
  } else if (obj.type === 'polyline') {
    layer = L.polyline(obj.coordinates, obj.style);
  } else if (obj.type === 'polygon') {
    layer = L.polygon(obj.coordinates, obj.style);
  }
  if (obj.popup) {
    layer.bindPopup(obj.popup);
  }
  objectLayers.push({ obj, layer });
}

// calculate global time range
let minTimelineEdge = new Date('9999-12-31').getTime();
let maxTimelineEdge = new Date('0000-01-01').getTime();

function updateOverallTimeRange(startTimeStr, endTimeStr) {
  if (startTimeStr) {
    const startTime = new Date(startTimeStr).getTime();
    if (startTime < minTimelineEdge) {
      minTimelineEdge = startTime;
    }
  }
  if (endTimeStr) {
    const endTime = new Date(endTimeStr).getTime();
    if (endTime > maxTimelineEdge) {
      maxTimelineEdge = endTime;
    }
  }
}

for (const evt of events) {
  updateOverallTimeRange(evt.start, evt.end);
}

for (const emp of empires) {
  for (const seg of emp.segments) {
    updateOverallTimeRange(seg.start, seg.end);
  }
}

for (const obj of objects) {
  updateOverallTimeRange(obj.start, obj.end);
}

// Handle case where no dates were found (e.g., all data arrays empty)
if (minTimelineEdge === new Date('9999-12-31').getTime() || maxTimelineEdge === new Date('0000-01-01').getTime()) {
    const now = new Date();
    const currentYear = now.getFullYear();
    minTimelineEdge = new Date(currentYear, 0, 1).getTime(); // Jan 1st of current year
    maxTimelineEdge = new Date(currentYear, 11, 31).getTime(); // Dec 31st of current year
    // If still default (e.g. current year is 9999 or 0000), set a more reasonable default
    if (minTimelineEdge > maxTimelineEdge) {
        minTimelineEdge = new Date(2000, 0, 1).getTime();
        maxTimelineEdge = new Date(2000, 11, 31).getTime();
    }
}

const timelineMin = new Date(minTimelineEdge);
const timelineMax = new Date(maxTimelineEdge);

// Initialize timeline
const timelineEl = document.getElementById('timeline');
const timelineContainer = document.getElementById('timeline-container');
const indicator = document.getElementById('indicator');
const yearLabel = document.getElementById('year-label');

const items = new vis.DataSet(events);
const options = {
  height: '100%',
  min: timelineMin,
  max: timelineMax,
  // Ensure the initial window shows some data if possible
  // If min and max are the same, vis.js might error or behave unexpectedly.
  // Add a small buffer if they are identical.
  start: timelineMin,
  end: new Date(Math.max(timelineMin.getTime() + (24*60*60*1000), timelineMax.getTime())) // At least one day window or full range
};
// If timelineMin and timelineMax are too close, Vis.js might have issues.
// It's good practice to ensure there's a reasonable default span.
if (options.end.getTime() === options.start.getTime()) {
    options.end = new Date(options.start.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days if start and end are identical
}

const timeline = new vis.Timeline(timelineEl, items, options);

function updateIndicator() {
  const windowRange = timeline.getWindow();
  const center = new Date((windowRange.start.getTime() + windowRange.end.getTime()) / 2);
  yearLabel.textContent = center.getFullYear();
}

timeline.on('rangechanged', updateIndicator);
// Call updateIndicator after timeline is fully initialized and has a window
timeline.on('changed', () => {
    updateIndicator();
    updateEmpires();
    updateObjects();
});
// Initial calls are still good for first load before 'changed' might fire or to ensure state.
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

function updateObjects() {
  const range = timeline.getWindow();
  const start = range.start;
  const end = range.end;

  for (const item of objectLayers) {
    const obj = item.obj;
    const layer = item.layer;
    const objStart = new Date(obj.start);
    const objEnd = new Date(obj.end);
    if (objEnd >= start && objStart <= end) {
      if (!map.hasLayer(layer)) {
        layer.addTo(map);
      }
    } else if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  }
}

// Removed duplicate rangechanged listeners
// 'changed' event listener above now handles these updates.

// Initial state update
// updateEmpires(); // Called by 'changed' event now
// updateObjects(); // Called by 'changed' event now

// Force a redraw/recheck after timeline is initialized to set initial state
timeline.redraw();
// Alternatively, directly call after a short delay or ensure options.start/end are valid for initial window
// For safety, explicit initial calls if 'changed' is not guaranteed on first load with all data.
// The `timeline.on('changed', ...)` should cover the initial setup as well.
// If not, these can be reinstated:
Promise.resolve().then(() => {
    updateIndicator();
    updateEmpires();
    updateObjects();
});
