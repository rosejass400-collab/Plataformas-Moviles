import { useEffect } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { formatDistance } from '../services/geo';

function Follow({ position, points }) {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    map.invalidateSize();
    return () => observer.disconnect();
  }, [map]);
  useEffect(() => {
    if (position) map.setView([position.lat, position.lng], Math.max(map.getZoom(), 16));
    else if (points?.length) map.fitBounds(points.map((point) => [point.lat, point.lng]), { padding: [30, 30] });
  }, [map, position, points]);
  return null;
}

export default function MapPanel({ position, points = [], breaks = [], places = [] }) {
  const boundaries = [0, ...breaks.filter((index) => index > 0 && index < points.length), points.length];
  const segments = boundaries.slice(0, -1).map((start, index) => points.slice(start, boundaries[index + 1])).filter((segment) => segment.length > 1);
  return (
    <div className="map-frame">
      <MapContainer center={position ? [position.lat, position.lng] : [4.5709, -74.2973]} zoom={position ? 16 : 5} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Follow position={position} points={points} />
        {segments.map((segment, index) => <Polyline key={index} positions={segment.map((point) => [point.lat, point.lng])} pathOptions={{ color: '#b14e34', weight: 5 }} />)}
        {position && <CircleMarker center={[position.lat, position.lng]} radius={9} pathOptions={{ color: '#fff', weight: 3, fillColor: '#164957', fillOpacity: 1 }}><Popup>Tu ubicación · precisión {formatDistance(position.accuracy || 0)}</Popup></CircleMarker>}
        {places.map((place) => <CircleMarker key={`${place.lat}-${place.lng}`} center={[place.lat, place.lng]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: '#d68b3f', fillOpacity: 1 }}><Popup>{place.name}<br />{formatDistance(place.distance)}</Popup></CircleMarker>)}
      </MapContainer>
    </div>
  );
}
