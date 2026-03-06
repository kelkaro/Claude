/**
 * Flight Service
 * Swap mock logic with real API (Amadeus, Skyscanner…) here.
 */
import { mockFlights, generateDatePrices } from '../data/flights';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Search flights.
 * params.fromIatas – string[] IATA codes for radius multi-airport search
 * params.from      – free-text city / IATA (single origin)
 * params.to        – free-text city / IATA
 * params.class     – cabin class filter
 */
export async function searchFlights(params) {
  await delay(650);
  let results = [...mockFlights];

  // Helper: detect 3-letter IATA codes → use exact match
  const isIata = (s) => /^[A-Z]{3}$/i.test(s.trim());

  if (params.fromIatas && params.fromIatas.length > 0) {
    results = results.filter((f) => params.fromIatas.includes(f.from.code));
  } else if (params.from) {
    const q = params.from.trim();
    if (isIata(q)) {
      results = results.filter((f) => f.from.code.toUpperCase() === q.toUpperCase());
    } else {
      const ql = q.toLowerCase();
      results = results.filter(
        (f) =>
          f.from.city.toLowerCase().includes(ql) ||
          f.from.code.toLowerCase().includes(ql)
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
        (f) =>
          f.to.city.toLowerCase().includes(ql) ||
          f.to.code.toLowerCase().includes(ql)
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
