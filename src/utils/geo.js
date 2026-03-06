import { airports } from '../data/airports';

/** Haversine distance in kilometres between two lat/lng points. */
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns all airports within radiusKm of the given coordinates,
 * sorted by distance ascending.
 * Each result is enriched with a `distanceKm` field.
 */
export function airportsWithinRadius(lat, lng, radiusKm) {
  return airports
    .map((a) => ({ ...a, distanceKm: Math.round(haversineKm(lat, lng, a.lat, a.lng)) }))
    .filter((a) => a.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
