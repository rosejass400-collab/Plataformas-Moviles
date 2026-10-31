const EARTH_METERS = 6371000;

export function distanceMeters(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const lat = toRad(b.lat - a.lat);
  const lon = toRad(b.lng - a.lng);
  const h = Math.sin(lat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(lon / 2) ** 2;
  return 2 * EARTH_METERS * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters) {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(2)} km`;
}
