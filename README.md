# Timeline Map

This project demonstrates a basic historical timeline connected to an interactive map.
It uses **Leaflet** for map rendering and **vis.js** for the timeline component.

## Usage

Serve the repository with a simple HTTP server and open `index.html` in a browser:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000` and navigate to `index.html`.

## External Dependencies

The following libraries are loaded from CDNs in `index.html`:

- [Leaflet](https://unpkg.com/leaflet) – map rendering library.
- [vis-timeline](https://unpkg.com/vis-timeline) – timeline component.
- OpenStreetMap tile layer for basemap imagery.

## Map Features

- **Markers** show event locations defined in `js/data.js`. Selecting a marker focuses the associated timeline item.
- **Empire polygons** defined in `js/empires.js` display historical boundaries. Their visibility changes as you move through the timeline.
- The timeline controls which empires are visible and lets you focus the map on event markers when selecting timeline items.

