import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export type MapWithRadiusProps = {
  center: { lat: number; lng: number };
  radiusMiles: number; // service radius in miles (data value)
  height?: string | number;
  zoom?: number;
  visualScale?: number; // optional scale factor to shrink displayed circle (e.g. 0.6)
};

// Helper to fit the map view around the circle
// Removed react-leaflet FitCircleView; bounds fitting handled imperatively after circle creation.

export const MapWithRadius: React.FC<MapWithRadiusProps> = ({ center, radiusMiles, height = 320, zoom = 12, visualScale = 1 }) => {
  const radiusMeters = radiusMiles * 1609.34 * visualScale;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return; // already initialized
    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: false,
      scrollWheelZoom: false,
    });
    leafletMapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    const circle = L.circle([center.lat, center.lng], {
      radius: radiusMeters,
      color: '#ff385c',
      fillColor: '#ff385c',
      fillOpacity: 0.12,
      weight: 2,
    }).addTo(map);
    // Fit bounds around circle
    map.fitBounds(circle.getBounds(), { padding: [20, 20] });
  }, [center.lat, center.lng, zoom, radiusMeters]);

  return (
    <div ref={mapRef} style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(2,6,23,0.08)' }} />
  );
};

export default MapWithRadius;
