# History Timeline Map

This project displays historical empires on a map with a timeline indicator.

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

## License

This project is licensed under the [MIT License](LICENSE).
