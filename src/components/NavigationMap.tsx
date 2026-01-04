import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Ftcm9tZSIsImEiOiJjbWp6ZWJ5YnM2bnh3M2RvYnZzdjVmZzFsIn0.RfRXY3j4zut1QX-EFCKGTg';

interface NavigationMapProps {
  progress: number; // 0-1 representing journey progress
  className?: string;
}

// Mock route coordinates (SF downtown to SFO airport)
const routeCoordinates: [number, number][] = [
  [-122.4194, 37.7749], // Start: SF downtown
  [-122.4089, 37.7835],
  [-122.4013, 37.7879],
  [-122.3964, 37.7850],
  [-122.3903, 37.7792],
  [-122.3851, 37.7713],
  [-122.3796, 37.7621],
  [-122.3749, 37.7498],
  [-122.3712, 37.7341],
  [-122.3689, 37.7189],
  [-122.3701, 37.7012],
  [-122.3756, 37.6853],
  [-122.3831, 37.6695],
  [-122.3894, 37.6533],
  [-122.3921, 37.6213], // End: SFO Airport
];

const NavigationMap = ({ progress, className = '' }: NavigationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);

  // Calculate current position based on progress
  const getCurrentPosition = (): [number, number] => {
    const totalPoints = routeCoordinates.length - 1;
    const exactIndex = progress * totalPoints;
    const lowerIndex = Math.floor(exactIndex);
    const upperIndex = Math.min(lowerIndex + 1, routeCoordinates.length - 1);
    const fraction = exactIndex - lowerIndex;

    const lowerPoint = routeCoordinates[lowerIndex];
    const upperPoint = routeCoordinates[upperIndex];

    return [
      lowerPoint[0] + (upperPoint[0] - lowerPoint[0]) * fraction,
      lowerPoint[1] + (upperPoint[1] - lowerPoint[1]) * fraction,
    ];
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const startPos = routeCoordinates[0];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: startPos,
      zoom: 15,
      pitch: 60,
      bearing: -20,
    });

    map.current.on('load', () => {
      // Add the route line
      map.current!.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        },
      });

      // Route glow effect
      map.current!.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(190, 100%, 50%)',
          'line-width': 12,
          'line-blur': 8,
          'line-opacity': 0.4,
        },
      });

      // Main route line
      map.current!.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(190, 100%, 60%)',
          'line-width': 5,
        },
      });

      // Destination marker
      const destEl = document.createElement('div');
      destEl.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background: hsl(0, 0%, 100%);
          border: 3px solid hsl(190, 100%, 50%);
          border-radius: 50%;
          box-shadow: 0 0 15px hsl(190 100% 50% / 0.6);
        "></div>
      `;
      new mapboxgl.Marker(destEl)
        .setLngLat(routeCoordinates[routeCoordinates.length - 1])
        .addTo(map.current!);

      // User position marker (navigation arrow style)
      const userEl = document.createElement('div');
      userEl.innerHTML = `
        <div style="
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 24px solid hsl(190, 100%, 50%);
          filter: drop-shadow(0 0 10px hsl(190 100% 50% / 0.8));
          transform: rotate(0deg);
        "></div>
      `;
      userMarker.current = new mapboxgl.Marker(userEl)
        .setLngLat(startPos)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update user position and map center based on progress
  useEffect(() => {
    if (!map.current || !userMarker.current) return;

    const currentPos = getCurrentPosition();
    userMarker.current.setLngLat(currentPos);

    // Smoothly pan the map to follow the user
    map.current.easeTo({
      center: currentPos,
      duration: 1000,
      easing: (t) => t,
    });
  }, [progress]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default NavigationMap;
