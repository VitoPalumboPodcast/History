      // Initialize map
      const map = L.map('map').setView([45, 5], 4); // Wider initial view
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

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

      // Add event markers and store references
      const eventMarkers = {};
      for (const evt of events) {
        const marker = L.marker(evt.latlng)
          .bindPopup(evt.popup);
        marker.bindTooltip(evt.content, {
          permanent: true,
          direction: 'top',
          className: 'event-label'
        });
        eventMarkers[evt.id] = marker;
        marker.on('click', () => {
          if (timeline) {
            timeline.setSelection(evt.id, { focus: true });
          }
        });
      }

      // Prepare empire layers
      const empireLayers = {};
      for (const emp of empires) {
        // Initial coordinates are not strictly necessary as they'll be set by updateEmpires
        // But providing first segment's coordinates can prevent an error if update is delayed.
        const firstSeg = emp.segments.length > 0 ? emp.segments[0] : { coordinates: [] };
        const layer = L.polygon(firstSeg.coordinates, emp.style).bindPopup(emp.name);
        empireLayers[emp.name] = { layer, currentSegment: null };
      }

      // Prepare additional object layers
      const objectLayers = [];
      for (const obj of objects) {
        let layer;
        let decorator;
        if (obj.type === 'marker') {
          layer = L.marker(obj.latlng, obj.style || {});
        } else if (obj.type === 'polyline') {
          layer = L.polyline(obj.coordinates, obj.style);
          if (obj.decorated) {
            decorator = L.polylineDecorator(layer, {
              patterns: [
                {
                  offset: '5%',
                  repeat: '10%',
                  symbol: L.Symbol.arrowHead({
                    pixelSize: 8,
                    polygon: false,
                    pathOptions: { stroke: true, color: layer.options.color || '#000' }
                  })
                }
              ]
            });
          }
        } else if (obj.type === 'polygon') {
          layer = L.polygon(obj.coordinates, obj.style);
        }
        if (layer && obj.popup) {
          layer.bindPopup(obj.popup);
        }
        if (layer) {
          const entry = { obj, layer };
          if (decorator) {
            entry.decorator = decorator;
          }
          objectLayers.push(entry);
        }
      }

      // Calculate global time range
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

      events.forEach(evt => updateOverallTimeRange(evt.start, evt.end));
      empires.forEach(emp => emp.segments.forEach(seg => updateOverallTimeRange(seg.start, seg.end)));
      objects.forEach(obj => updateOverallTimeRange(obj.start, obj.end));
      
      if (minTimelineEdge > maxTimelineEdge) { // Fallback if no valid dates
          const now = new Date();
          minTimelineEdge = new Date(now.getFullYear(), 0, 1).getTime(); // Jan 1st of current year
          maxTimelineEdge = new Date(now.getFullYear(), 11, 31).getTime(); // Dec 31st of current year
          if (minTimelineEdge > maxTimelineEdge) { // Should not happen with current logic
            minTimelineEdge = new Date(2000,0,1).getTime();
            maxTimelineEdge = new Date(2000,11,31).getTime();
          }
      }
      
      const timelineMin = new Date(minTimelineEdge);
      const timelineMax = new Date(maxTimelineEdge);

      // Initialize timeline
      const timelineEl = document.getElementById('timeline');
      const yearLabel = document.getElementById('year-label');

      const timelineItems = new vis.DataSet(events);
      const timelineOptions = {
        height: '100%',
        start: timelineMin,
        end: new Date(Math.max(timelineMin.getTime() + (30 * 24 * 60 * 60 * 1000), timelineMax.getTime())), // Ensure at least a 30-day window or full range
        // Allow zooming in to one day and out to roughly the limits of the
        // JavaScript Date range (~275k years)
        zoomMin: 1000 * 60 * 60 * 24, // Minimum zoom level: 1 day
        zoomMax: 8640000000000000 // Max zoom level: about 275k years
      };
      
      if (timelineOptions.end.getTime() <= timelineOptions.start.getTime()) {
        timelineOptions.end = new Date(timelineOptions.start.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days
      }

      if (!window.vis) {
        console.warn('Timeline library failed to load');
        yearLabel.textContent = 'Timeline library failed to load';
        return;
      }

      const timeline = new vis.Timeline(timelineEl, timelineItems, timelineOptions);

      function updateIndicator() {
        if (!timeline) return;
        const windowRange = timeline.getWindow();
        if (windowRange.start && windowRange.end) {
            const centerTime = (windowRange.start.getTime() + windowRange.end.getTime()) / 2;
            const centerDate = new Date(centerTime);
            yearLabel.textContent = centerDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
        } else {
            yearLabel.textContent = "N/A";
        }
      }

      timeline.on('select', props => {
        const id = props.items[0];
        if (id && eventMarkers[id]) {
          const marker = eventMarkers[id];
          map.setView(marker.getLatLng(), 8); // Zoom level 8 when selecting an event
          marker.openPopup();
        }
      });
      
      function updateMapLayers() {
        if (!timeline) return;
        const range = timeline.getWindow();
        if (!range.start || !range.end) return; // Timeline not ready

        const viewStart = range.start;
        const viewEnd = range.end;

        // Update Empires
        for (const emp of empires) {
          const info = empireLayers[emp.name];
          if (!info) continue;
          const layer = info.layer;
          let activeSegment = null;
          for (const s of emp.segments) {
            const segStart = parseDate(s.start);
            const segEnd = parseDate(s.end);
            // Check for overlap: (SegStart <= ViewEnd) and (SegEnd >= ViewStart)
            if (segStart <= viewEnd && segEnd >= viewStart) {
              activeSegment = s;
              break; 
            }
          }

          if (activeSegment) {
            if (info.currentSegment !== activeSegment) {
              layer.setLatLngs(activeSegment.coordinates);
              info.currentSegment = activeSegment;
            }
            if (!map.hasLayer(layer)) {
              layer.addTo(map);
            }
          } else if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            info.currentSegment = null;
          }
        }

        // Update Objects
        for (const item of objectLayers) {
          const obj = item.obj;
          const layer = item.layer;
          const decorator = item.decorator;
          const objStart = parseDate(obj.start);
          const objEnd = parseDate(obj.end);
          // Check for overlap: (ObjStart <= ViewEnd) and (ObjEnd >= ViewStart)
          if (objStart <= viewEnd && objEnd >= viewStart) {
            if (!map.hasLayer(layer)) {
              layer.addTo(map);
            }
            if (decorator && !map.hasLayer(decorator)) {
              decorator.addTo(map);
            }
          } else {
            if (map.hasLayer(layer)) {
              map.removeLayer(layer);
            }
            if (decorator && map.hasLayer(decorator)) {
              map.removeLayer(decorator);
            }
          }
        }

        // Update Events
        for (const evt of events) {
          const marker = eventMarkers[evt.id];
          const evtStart = parseDate(evt.start);
          const evtEnd = parseDate(evt.end);
          if (evtStart <= viewEnd && evtEnd >= viewStart) {
            if (!map.hasLayer(marker)) {
              marker.addTo(map);
            }
          } else if (map.hasLayer(marker)) {
            map.removeLayer(marker);
          }
        }
      }

      timeline.on('changed', () => {
          updateIndicator();
          updateMapLayers();
      });

      // Initial updates after everything is set up
      // Use a small timeout to ensure DOM and libraries are fully ready
      setTimeout(() => {
        updateIndicator();
        updateMapLayers();
        if (timelineItems.length > 0) { // If there are items, fit timeline to them
            timeline.fit();
            const firstEvent = events.find(e => e.id === timelineItems.getIds()[0]);
            if (firstEvent && firstEvent.latlng) {
                 map.setView(firstEvent.latlng, 5); // Center map on the first event initially
            }
        } else { // Fallback if no items
            timeline.setWindow(timelineMin, timelineMax);
        }
        // Then re-run updates based on the new window
        updateIndicator();
        updateMapLayers();
      }, 100);

