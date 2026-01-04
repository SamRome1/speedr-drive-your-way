import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Ftcm9tZSIsImEiOiJjbWp6ZWJ5YnM2bnh3M2RvYnZzdjVmZzFsIn0.RfRXY3j4zut1QX-EFCKGTg';

interface MapProps {
  className?: string;
}

const Map = ({ className = '' }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 12,
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Add user location marker
    map.current.on('load', () => {
      // Add a pulsing dot for current location
      const el = document.createElement('div');
      el.className = 'current-location-marker';
      el.innerHTML = `
        <div style="
          width: 20px;
          height: 20px;
          background: hsl(190 100% 50%);
          border: 3px solid hsl(190 100% 70%);
          border-radius: 50%;
          box-shadow: 0 0 20px hsl(190 100% 50% / 0.6);
        "></div>
      `;
      
      new mapboxgl.Marker(el)
        .setLngLat([-122.4194, 37.7749])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10" />
    </div>
  );
};

export default Map;
