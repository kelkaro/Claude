/**
 * Hotel Service
 * Tries Amadeus API first (via /api/hotels Vercel function),
 * then falls back to mock data if API is unavailable.
 */
import { mockHotels } from '../data/hotels';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Search hotels.
 * params.city     – city name (e.g. "Paris")
 * params.checkIn  – YYYY-MM-DD
 * params.checkOut – YYYY-MM-DD
 * params.adults   – number of guests
 * params.minStars – minimum star rating (0 = any)
 * params.maxPrice – max price per night
 */
export async function searchHotels(params) {
  /* ── Try Amadeus API if dates are provided ── */
  if (params.city && params.checkIn && params.checkOut) {
    try {
      const q = new URLSearchParams({
        city:     params.city,
        checkIn:  params.checkIn,
        checkOut: params.checkOut,
        adults:   String(params.adults || 2),
      });

      const res = await fetch(`/api/hotels?${q}`);
      if (res.ok) {
        let data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          /* Apply local filters on top of real results */
          if (params.minStars) data = data.filter((h) => h.stars >= Number(params.minStars));
          if (params.maxPrice) data = data.filter((h) => h.pricePerNight <= Number(params.maxPrice));
          return data;
        }
      }
    } catch (e) {
      console.warn('Amadeus hotel search failed, using mock data:', e.message);
    }
  }

  /* ── Fallback: mock data ── */
  await delay(700);
  let results = [...mockHotels];

  if (params.city) {
    const q = params.city.toLowerCase();
    results = results.filter((h) => h.city.toLowerCase().includes(q));
  }
  if (params.minStars) results = results.filter((h) => h.stars >= Number(params.minStars));
  if (params.maxPrice) results = results.filter((h) => h.pricePerNight <= Number(params.maxPrice));

  return results;
}

export async function getHotelById(id) {
  await delay(150);
  return mockHotels.find((h) => h.id === id) ?? null;
}
