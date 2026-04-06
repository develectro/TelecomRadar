<script>
  import { onMount, onDestroy } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { mapTowers, mapBounds, selectedTower, simulatedUserLocation } from '../stores/appState.js';

  let mapElement;
  let map;
  let markersLayer;
  let userMarker;
  let unsubscribe;

  onMount(() => {
    map = L.map(mapElement, {
      zoomControl: false
    }).setView([24.7136, 46.6753], 5); // Default to zoomed out view if geolocation fails

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.setView([position.coords.latitude, position.coords.longitude], 13);
        },
        (err) => console.log('Geolocation disabled/failed:', err)
      );
    }

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap | CARTO',
      maxZoom: 19
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    map.on('moveend', () => {
      const bounds = map.getBounds();
      mapBounds.set({
        minLat: bounds.getSouth(),
        minLon: bounds.getWest(),
        maxLat: bounds.getNorth(),
        maxLon: bounds.getEast()
      });
    });

    map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      simulatedUserLocation.set({ lat, lon });
      
      if (userMarker) {
        userMarker.setLatLng([lat, lon]);
      } else {
        userMarker = L.circleMarker([lat, lon], {
          radius: 8,
          fillColor: '#ef4444',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map);
      }
    });

    map.fire('moveend');

    unsubscribe = mapTowers.subscribe(towers => {
      markersLayer.clearLayers();
      if (!towers) return;

      towers.forEach(tower => {
        let color = '#94a3b8'; // default
        if (tower.radio === '5G') color = '#06b6d4'; // Cyan
        if (tower.radio === 'LTE') color = '#a855f7'; // Purple
        if (tower.radio === 'UMTS') color = '#3b82f6'; // Blue

        const markerOptions = {
          radius: 5,
          fillColor: color,
          color: '#111',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        };

        const marker = L.circleMarker([tower.lat, tower.lon], markerOptions);
        marker.bindPopup(`
          <div style="text-align: center;">
            <b style="color: ${color}; font-size: 1.1em;">${tower.radio}</b>
            <br>
            <span style="color: #94a3b8; font-size: 0.9em;">Op: ${tower.operator}</span>
          </div>
        `);
        marker.on('click', () => {
          selectedTower.set(tower);
        });
        marker.addTo(markersLayer);
      });
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
    if (map) map.remove();
  });
</script>

<div bind:this={mapElement} class="map-container"></div>

<style>
  .map-container {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1; /* Map is always behind UI panels */
  }

  /* Override leaflet popup styles for premium dark mode */
  :global(.leaflet-popup-content-wrapper) {
    background: rgba(20, 24, 41, 0.9) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #e2e8f0 !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
  }
  :global(.leaflet-popup-tip) {
    background: rgba(20, 24, 41, 0.9) !important;
  }
  :global(.leaflet-container a.leaflet-popup-close-button) {
    color: #94a3b8 !important;
  }
</style>
