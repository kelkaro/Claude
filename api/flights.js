/**
 * Vercel Serverless Function — Amadeus Flight Search Proxy
 * GET /api/flights?origin=BRU&destination=MAD&date=2026-04-10&adults=1&cabin=Economy
 */

function formatDuration(iso) {
  // PT2H30M → "2h 30m"
  const match = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso || '';
  const h = match[1] ? `${match[1]}h ` : '';
  const m = match[2] ? `${match[2]}m` : '';
  return (h + m).trim();
}

function mapFlight(offer, dictionaries) {
  const itinerary = offer.itineraries[0];
  const segments  = itinerary.segments;
  const firstSeg  = segments[0];
  const lastSeg   = segments[segments.length - 1];

  const carrierCode = firstSeg.carrierCode;
  const airlineName = dictionaries?.carriers?.[carrierCode] || carrierCode;

  const fromLoc = dictionaries?.locations?.[firstSeg.departure.iataCode];
  const toLoc   = dictionaries?.locations?.[lastSeg.arrival.iataCode];

  const stops    = segments.length - 1;
  const stopCity = stops > 0 ? (dictionaries?.locations?.[segments[0].arrival.iataCode]?.cityCode || segments[0].arrival.iataCode) : undefined;

  const cabin    = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin;
  const cabinMap = { ECONOMY: 'Economy', BUSINESS: 'Business', FIRST: 'First', PREMIUM_ECONOMY: 'Premium Economy' };

  return {
    id:           offer.id,
    from:         { code: firstSeg.departure.iataCode, city: fromLoc?.cityCode || firstSeg.departure.iataCode, country: fromLoc?.countryCode || '' },
    to:           { code: lastSeg.arrival.iataCode,    city: toLoc?.cityCode   || lastSeg.arrival.iataCode,    country: toLoc?.countryCode   || '' },
    departure:    firstSeg.departure.at,
    arrival:      lastSeg.arrival.at,
    duration:     formatDuration(itinerary.duration),
    airline:      airlineName,
    flightNumber: `${carrierCode}${firstSeg.number}`,
    price:        parseFloat(offer.price.total),
    class:        cabinMap[cabin] || 'Economy',
    stops,
    stopCity,
    seatsLeft:    offer.numberOfBookableSeats,
    amenities:    [],
    competitors:  null,
  };
}

async function getAmadeusToken() {
  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    `grant_type=client_credentials&client_id=${process.env.AMADEUS_CLIENT_ID}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`,
  });
  if (!res.ok) throw new Error('Amadeus token error: ' + res.status);
  const { access_token } = await res.json();
  return access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { origin, destination, date, adults = '1', cabin } = req.query;
  if (!origin || !destination || !date) {
    return res.status(400).json({ error: 'Missing: origin, destination, date' });
  }

  try {
    const token = await getAmadeusToken();

    const cabinMap = { Economy: 'ECONOMY', Business: 'BUSINESS', First: 'FIRST' };
    const params   = new URLSearchParams({
      originLocationCode:      origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate:           date,
      adults:                  adults,
      max:                     '20',
      currencyCode:            'EUR',
    });
    if (cabin && cabinMap[cabin]) params.set('travelClass', cabinMap[cabin]);

    const flightsRes = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await flightsRes.json();

    if (!data.data?.length) return res.json([]);

    const flights = data.data.map((o) => mapFlight(o, data.dictionaries));
    res.json(flights);
  } catch (err) {
    console.error('Amadeus flights error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
