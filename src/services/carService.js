/**
 * Car Rental Service — swap mock with real API (RentalCars, CarTrawler…) here.
 */
import { mockCars } from '../data/cars';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function searchCars(params) {
  await delay(500);
  let results = [...mockCars];

  if (params.city) {
    const q = params.city.toLowerCase();
    results = results.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }
  if (params.category && params.category !== 'Any') {
    results = results.filter((c) => c.category === params.category);
  }
  if (params.maxPrice) {
    results = results.filter((c) => c.pricePerDay <= Number(params.maxPrice));
  }
  return results;
}

export async function getCarById(id) {
  await delay(150);
  return mockCars.find((c) => c.id === id) ?? null;
}
