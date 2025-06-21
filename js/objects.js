const objects = [
  {
    start: '2024-01-05',
    end: '2024-01-20',
    type: 'marker',
    latlng: [40.5, 11],
    popup: 'Sample Marker (Jan 5-20)'
  },
  {
    start: '2024-02-10',
    end: '2024-02-25',
    type: 'polyline',
    coordinates: [
      [48, 0],
      [49, 2.5],
      [48, 5]
    ],
    style: { color: '#ff8800', weight: 3 },
    popup: 'Trade Route (Feb 10-25)'
  },
  {
    start: '2024-03-10',
    end: '2024-03-20',
    type: 'polygon',
    coordinates: [
      [
        [51.0, -3.0],
        [51.5, -1.0],
        [50.5, -1.0],
        [50.0, -3.0]
      ]
    ],
    style: { color: '#8800ff', weight: 2, fillColor: '#8800ff', fillOpacity: 0.4 },
    popup: 'Special Region (Mar 10-20)'
  },
  {
    start: '2023-03-01',
    end: '2023-05-31',
    type: 'marker',
    latlng: [32.5, 35],
    popup: 'Ancient Site (Mar-May 2023)'
  }
];
