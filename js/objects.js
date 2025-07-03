    const objects = [
      {
        start: '2024-01-05',
        end: '2024-01-20',
        type: 'marker',
        latlng: [40.5, 11], // Slightly SE of Rome
        popup: 'Sample Marker (Jan 5-20)'
        // No style property here, will use default Leaflet marker
      },
      {
        start: '2024-02-10',
        end: '2024-02-25',
        type: 'polyline',
        coordinates: [
          [48, 0],  // West of Paris
          [49, 2.5], // North of Paris
          [48, 5]   // East of Paris
        ],
        style: { color: '#ff8800', weight: 3 },
        popup: 'Trade Route (Feb 10-25)',
        decorated: true
      },
      {
        start: '2024-03-10',
        end: '2024-03-20',
        type: 'polygon',
        coordinates: [
          [ // A region in southern Britain
            [51.0, -3.0],
            [51.5, -1.0],
            [50.5, -1.0],
            [50.0, -3.0]
          ]
        ],
        style: { color: '#8800ff', weight: 2, fillColor: '#8800ff', fillOpacity: 0.4 },
        popup: 'Special Region (Mar 10-20)'
      },
      { // Example of an object for the much earlier empire
        start: '2023-03-01',
        end: '2023-05-31',
        type: 'marker',
        latlng: [32.5, 35], // In the "Ancient Empire" area
        popup: 'Ancient Site (Mar-May 2023)'
      },
      {
        start: '2022-04-01',
        end: '2022-04-15',
        type: 'marker',
        latlng: [25, 25],
        popup: 'Classical Ruins (Apr 1-15, 2022)'
      },
      {
        start: '-1200-01-01',
        end: '-1000-01-01',
        type: 'polyline',
        coordinates: [
          [40.5, 22.0], // Thessaly/Macedonia
          [39.3, 21.0], // Pindus region
          [37.5, 22.0]  // Peloponneso
        ],
        style: { color: '#00ffff', weight: 2 },
        popup: 'Dorian migration path (~1200-1000 BC)',
        decorated: true
      },
      {
        start: '-1000-01-01',
        end: '-1000-01-02',
        type: 'marker',
        latlng: [37.07, 22.43],
        popup: 'Sparta settled by Dorians'
      },
      {
        start: '-1000-01-01',
        end: '-1000-01-02',
        type: 'marker',
        latlng: [37.94, 22.93],
        popup: 'Corinth as a Dorian center'
      }
      ];
