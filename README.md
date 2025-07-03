# History Timeline Map

This project displays historical empires on a map with a timeline indicator.

## Live Demo

Visit the live map at <https://vitopalumbopodcast.github.io/History/>.

## Serving the Site Locally

The project is a static website. From the repository root run:

```bash
python -m http.server
```

Then open <http://localhost:8000> in your browser to view the map.

## Empire Data Format

Empires are defined in `js/empires.js`. Each entry contains a list of
`segments` representing the empire's boundaries over time. A segment has its own
`start`, `end` and polygon `coordinates` array. Example:

```javascript
{
  name: 'Imperium Italicum',
  segments: [
    { start: '2024-01-01', end: '2024-01-15', coordinates: [...] },
    { start: '2024-01-16', end: '2024-01-31', coordinates: [...] }
  ],
  style: { color: '#ff0000', weight: 2, fillColor: '#ff0000', fillOpacity: 0.3 }
}
```

`updateEmpires()` chooses the segment that overlaps the visible timeline range
and updates the displayed geometry accordingly.

## Object Dataset Format

Additional map objects are defined in `js/objects.js`. Each object has a
`start` and `end` date, a `type` (`"marker"`, `"polyline"` or `"polygon"`) and the
geometry information required for that type. Markers use a single `latlng`
coordinate while polylines and polygons use `coordinates` arrays. Optional
properties such as `popup` text or a Leaflet `style` object control how the
object is displayed. `updateObjects()` shows or hides these layers based on the
visible timeline range.

## Modifying Events, Empires and Objects

* **Events** are listed in `js/data.js` as an array named `events`. Each entry
  includes an `id`, `content`, `start`, `end`, a `latlng` coordinate and optional
  `popup` text.
* **Empires** are defined in `js/empires.js` under the `empires` array. Empires
  contain one or more `segments` with `start`, `end` and polygon `coordinates`
  describing how their territory changes over time.
* **Objects** such as markers, polylines and polygons live in `js/objects.js` in
  the `objects` array. They use `start` and `end` dates along with geometry and
  optional `style` and `popup` properties.

Dates may also represent BC years by prefixing the year with a minus sign,
e.g. `-44-03-15` for 44&nbsp;BC. These values are parsed automatically.

Edit these files to add or update entries. Reload the page after making changes
to see the updated map.

## Browser Requirements

The application uses [Leaflet](https://leafletjs.com/) 1.9.4 and
[vis-timeline](https://visjs.github.io/vis-timeline/) 7.7.0. A modern
browser with ES6 support such as recent versions of Chrome, Firefox or Edge is
recommended.

## License

This project is licensed under the [MIT License](LICENSE).
