const objects = [
  {
    start: '2024-01-05',
    end: '2024-01-20',
    type: 'marker',
    latlng: [40, 10],
    popup: 'Sample Marker'
  },
  {
    start: '2024-02-10',
    end: '2024-02-25',
    type: 'polyline',
    coordinates: [
      [48, 12],
      [50, 12],
      [51, 13]
    ],
    style: { color: '#ff8800' }
  },
  {
    start: '2024-03-10',
    end: '2024-03-20',
    type: 'polygon',
    coordinates: [
      [
        [45, -2],
        [45, 2],
        [47, 2],
        [47, -2]
      ]
    ],
    style: { color: '#8800ff', weight: 2, fillColor: '#8800ff', fillOpacity: 0.3 }
  }
];
