/**
 * Flight Service
 * Tries Amadeus API first (via /api/flights Vercel function),
 * then falls back to mock data if API is unavailable.
 */
import { mockFlights, generateDatePrices } from '../data/flights';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const isIata = (s) => /^[A-Z]{3}$/i.test(s?.trim());

/**
 * Search flights.
 * params.from      – IATA code or city name
 * params.fromIatas – string[] IATA codes (nearby-airport mode)
 * params.to        – IATA code or city name
 * params.date      – YYYY-MM-DD departure date
 * params.adults    – number of passengers
 * params.class     – cabin class filter
 */
export async function searchFlights(params) {
  const origin = params.fromIatas?.[0] || params.from;
  const dest   = params.to;

  /* ── Try Amadeus API if both origin & dest are IATA codes ── */
  if (origin && dest && params.date && isIata(origin) && isIata(dest)) {
    try {
      const q = new URLSearchParams({
        origin:      origin.toUpperCase(),
        destination: dest.toUpperCase(),
        date:        params.date,
        adults:      String(params.adults || 1),
        ...(params.class && params.class !== 'Any' ? { cabin: params.class } : {}),
      });

      const res = await fetch(`/api/flights?${q}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Amadeus flight search failed, using mock data:', e.message);
    }
  }

  /* ── Fallback: mock data ── */
  await delay(650);
  let results = [...mockFlights];

  if (params.fromIatas?.length > 0) {
    results = results.filter((f) => params.fromIatas.includes(f.from.code));
  } else if (params.from) {
    const q = params.from.trim();
    if (isIata(q)) {
      results = results.filter((f) => f.from.code.toUpperCase() === q.toUpperCase());
    } else {
      const ql = q.toLowerCase();
      results = results.filter(
        (f) => f.from.city.toLowerCase().includes(ql) || f.from.code.toLowerCase().includes(ql)
      );
    }
  }

  if (params.to) {
    const q = params.to.trim();
    if (isIata(q)) {
      results = results.filter((f) => f.to.code.toUpperCase() === q.toUpperCase());
    } else {
      const ql = q.toLowerCase();
      results = results.filter(
        (f) => f.to.city.toLowerCase().includes(ql) || f.to.code.toLowerCase().includes(ql)
      );
    }
  }

  if (params.class && params.class !== 'Any') {
    results = results.filter((f) => f.class === params.class);
  }

  return results;
}

/** Flexible-date price calendar. */
export async function getDatePrices({ basePrice = 299, startDate, days = 30 }) {
  await delay(350);
  const start = startDate ?? new Date().toISOString().split('T')[0];
  return generateDatePrices(basePrice, start, days);
}

export async function getFlightById(id) {
  await delay(150);
  return mockFlights.find((f) => f.id === id) ?? null;
}
