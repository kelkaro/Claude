/**
 * Hotel Service — swap mock with real API (Booking.com, Hotels.com…) here.
 */
import { mockHotels } from '../data/hotels';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function searchHotels(params) {
  await delay(700);
  let results = [...mockHotels];

  if (params.city) {
    const q = params.city.toLowerCase();
    results = results.filter((h) => h.city.toLowerCase().includes(q));
  }
  if (params.minStars) {
    results = results.filter((h) => h.stars >= Number(params.minStars));
  }
  if (params.maxPrice) {
    results = results.filter((h) => h.pricePerNight <= Number(params.maxPrice));
  }
  return results;
}

export async function getHotelById(id) {
  await delay(150);
  return mockHotels.find((h) => h.id === id) ?? null;
}
