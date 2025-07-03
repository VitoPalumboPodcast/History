    const empires = [
      {
        name: 'Imperium Italicum',
        segments: [
          {
            start: '2024-01-01',
            end: '2024-01-15',
            coordinates: [ // Smaller Italy
              [
                [44.0, 7.5],  // NW
                [46.5, 13.5], // NE
                [40.0, 18.0], // SE
                [38.0, 12.0], // SW
                [41.0, 9.0]   // W
              ]
            ]
          },
          {
            start: '2024-01-16',
            end: '2024-01-31',
            coordinates: [ // Larger Italy, expanded
              [
                [46, 7],      // Further NW
                [47, 14],     // Further NE
                [39, 19],     // Further SE
                [37, 11],     // Further SW
                [40, 8]       // Further W
              ]
            ]
          }
        ],
        style: { color: '#ff0000', weight: 2, fillColor: '#ff0000', fillOpacity: 0.3 }
      },
      {
        name: 'Regnum Francorum',
        segments: [
          {
            start: '2024-02-01',
            end: '2024-02-14',
            coordinates: [ // Smaller France
              [
                [50, -2],
                [50, 4],
                [45, 4],
                [45, -2]
              ]
            ]
          },
          {
            start: '2024-02-15',
            end: '2024-02-29', // Note: 2024 is a leap year
            coordinates: [ // Larger France
              [
                [51, -5], // NW
                [51, 7],  // NE
                [43, 7],  // SE
                [43, -5]  // SW
              ]
            ]
          }
        ],
        style: { color: '#0000ff', weight: 2, fillColor: '#0000ff', fillOpacity: 0.3 }
      },
      {
        name: 'Britannia',
        segments: [
          {
            start: '2024-03-01',
            end: '2024-03-31',
            coordinates: [
              [
                [58, -7], // Scotland North
                [58, 2],  // East coast
                [50, 2],  // SE England
                [50, -7]  // SW England/Wales
              ]
            ]
          }
        ],
        style: { color: '#00ff00', weight: 2, fillColor: '#00ff00', fillOpacity: 0.3 }
      },
      { // Example of an empire that appears much earlier to test timeline range
        name: 'Ancient Empire',
        segments: [
            {
                start: '2023-01-01',
                end: '2023-06-30',
                coordinates: [
                    [
                        [35, 30], [35, 40], [30, 40], [30, 30] // A fictional area
                    ]
                ]
            }
        ],
        style: { color: '#ffff00', weight: 2, fillColor: '#ffff00', fillOpacity: 0.2 }
      },
      {
        name: 'Classical Empire',
        segments: [
          {
            start: '2022-01-01',
            end: '2022-12-31',
            coordinates: [
              [
                [20, 20], [20, 30], [10, 30], [10, 20]
              ]
            ]
          }
        ],
        style: { color: '#00ffff', weight: 2, fillColor: '#00ffff', fillOpacity: 0.2 }
      }
      ];
