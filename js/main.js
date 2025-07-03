// Initialize map with a wider view
const map = L.map('map').setView([45, 5], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Helper to parse dates including negative years (BC)
function parseDate(str) {
  if (typeof str === 'string' && str.startsWith('-')) {
    const parts = str.slice(1).split('-');
    const year = -Number(parts[0]);
    const month = Number(parts[1] || 1);
    const day = Number(parts[2] || 1);
    return new Date(year, month - 1, day);
  }
  return new Date(str);
}

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
    const startTime = parseDate(startTimeStr).getTime();
    if (!isNaN(startTime) && startTime < minTimelineEdge) {
      minTimelineEdge = startTime;
    }
  }
  if (endTimeStr) {
    const endTime = parseDate(endTimeStr).getTime();
    if (!isNaN(endTime) && endTime > maxTimelineEdge) {
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
  start: timelineMin,
  end: new Date(Math.max(timelineMin.getTime() + (30 * 24 * 60 * 60 * 1000), timelineMax.getTime())),
  // Allow zooming in to one day and out to roughly the limits of the
  // JavaScript Date range (~275k years)
  zoomMin: 1000 * 60 * 60 * 24,
  zoomMax: 8640000000000000
};
if (options.end.getTime() <= options.start.getTime()) {
  options.end = new Date(options.start.getTime() + 30 * 24 * 60 * 60 * 1000);
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
      const segStart = parseDate(s.start);
      const segEnd = parseDate(s.end);
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
    const objStart = parseDate(obj.start);
    const objEnd = parseDate(obj.end);
    if (objEnd >= start && objStart <= end) {
      if (!map.hasLayer(layer)) {
        layer.addTo(map);
      }
    } else if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  }
}

// Initial updates after timeline and map are ready
setTimeout(() => {
  updateIndicator();
  updateEmpires();
  updateObjects();
  if (items.getIds().length > 0) {
    timeline.fit();
    const firstEvent = events.find(e => e.id === items.getIds()[0]);
    if (firstEvent && firstEvent.latlng) {
      map.setView(firstEvent.latlng, 5);
    }
  } else {
    timeline.setWindow(timelineMin, timelineMax);
  }
  updateIndicator();
  updateEmpires();
  updateObjects();
}, 100);
