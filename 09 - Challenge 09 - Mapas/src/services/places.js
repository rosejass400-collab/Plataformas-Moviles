import { distanceMeters } from './geo';

const ENDPOINT = 'https://api.opencagedata.com/geocode/v1/json';

async function query(params, key) {
  const url = new URL(ENDPOINT);
  Object.entries({ ...params, key, language: 'es', no_record: 1 }).forEach(([name, value]) => {
    url.searchParams.set(name, String(value));
  });
  const response = await fetch(url);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.status?.message || 'OpenCage no respondió.');
  return payload.results || [];
}

export async function lookupPlace(position, key) {
  const results = await query({ q: `${position.lat},${position.lng}`, no_annotations: 1 }, key);
  return results[0]?.formatted || 'Sin dirección disponible';
}

export async function findNearby(position, key, search) {
  const latitudeDelta = 0.045;
  const longitudeDelta = 0.045 / Math.max(0.2, Math.cos(position.lat * Math.PI / 180));
  const bounds = [
    position.lng - longitudeDelta,
    position.lat - latitudeDelta,
    position.lng + longitudeDelta,
    position.lat + latitudeDelta,
  ].join(',');
  const results = await query({
    q: search,
    proximity: `${position.lat},${position.lng}`,
    bounds,
    limit: 10,
    no_annotations: 1,
  }, key);
  return results.map((result) => ({
    name: result.formatted,
    lat: result.geometry.lat,
    lng: result.geometry.lng,
    distance: distanceMeters(position, { lat: result.geometry.lat, lng: result.geometry.lng }),
  })).sort((a, b) => a.distance - b.distance).slice(0, 5);
}
