/**
 * Vercel Serverless Function — Amadeus Hotel Search Proxy
 * GET /api/hotels?city=Paris&checkIn=2026-04-10&checkOut=2026-04-13&adults=2
 */

/* City name → Amadeus IATA city code */
const CITY_CODE = {
  Brussels: 'BRU', Liège: 'LGG', Antwerp: 'ANR', Ghent: 'GNE', Bruges: 'OST',
  Amsterdam: 'AMS', Rotterdam: 'RTM', Utrecht: 'UTC', Eindhoven: 'EIN',
  Berlin: 'BER', Munich: 'MUC', Hamburg: 'HAM', Frankfurt: 'FRA', Cologne: 'CGN',
  Düsseldorf: 'DUS', Stuttgart: 'STR', Luxembourg: 'LUX',
  Paris: 'PAR', Lyon: 'LYS', Marseille: 'MRS', Nice: 'NCE', Toulouse: 'TLS',
  Bordeaux: 'BOD', Strasbourg: 'SXB', Nantes: 'NTE', Lille: 'LIL',
  London: 'LON', Manchester: 'MAN', Edinburgh: 'EDI', Birmingham: 'BHX', Glasgow: 'GLA',
  Zurich: 'ZRH', Geneva: 'GVA', Basel: 'BSL', Bern: 'BRN',
  Vienna: 'VIE', Salzburg: 'SZG', Innsbruck: 'INN',
  Madrid: 'MAD', Barcelona: 'BCN', Seville: 'SVQ', Valencia: 'VLC',
  Málaga: 'AGP', Bilbao: 'BIO',
  Rome: 'ROM', Milan: 'MIL', Venice: 'VCE', Florence: 'FLR', Naples: 'NAP',
  Lisbon: 'LIS', Porto: 'OPO', Faro: 'FAO',
  Copenhagen: 'CPH', Oslo: 'OSL', Stockholm: 'STO', Helsinki: 'HEL',
  Warsaw: 'WAW', Prague: 'PRG', Budapest: 'BUD', Bucharest: 'BUH', Athens: 'ATH',
  Istanbul: 'IST', Antalya: 'AYT', Marrakech: 'RAK', Casablanca: 'CAS',
  Dubai: 'DXB', 'Abu Dhabi': 'AUH', Doha: 'DOH',
  'New York': 'NYC', 'Los Angeles': 'LAX', Miami: 'MIA', Chicago: 'CHI',
  Toronto: 'YTO', Montreal: 'YMQ', Tokyo: 'TYO', Bangkok: 'BKK',
  Singapore: 'SIN', 'Hong Kong': 'HKG', Seoul: 'SEL', Sydney: 'SYD', Melbourne: 'MEL',
};

const AMENITY_MAP = {
  WIFI: 'Free WiFi', FREE_WIFI: 'Free WiFi', INTERNET: 'Free WiFi',
  POOL: 'Pool', SWIMMING_POOL: 'Pool', SPA: 'Spa',
  FITNESS_CENTER: 'Gym', GYM: 'Gym', RESTAURANT: 'Restaurant',
  BAR: 'Bar', PARKING: 'Parking', AIR_CONDITIONING: 'A/C',
  ROOM_SERVICE: 'Room Service', CONCIERGE: 'Concierge',
  BREAKFAST: 'Petit-déjeuner', AIRPORT_SHUTTLE: 'Navette aéroport',
};

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c4a49f56?w=600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
];

function mapHotel(offer, cityName, nights) {
  const hotel      = offer.hotel;
  const firstOffer = offer.offers[0];
  const total      = parseFloat(firstOffer.price.total || firstOffer.price.base || 0);
  const pricePer   = nights > 0 ? Math.round(total / nights) : Math.round(total);

  const isFree = firstOffer.policies?.cancellations?.some(
    (c) => c.type === 'FULL_CREDIT' || c.type === 'FREE' || !c.amount
  );
  const breakfast = ['BREAKFAST','FULL_BOARD','HALF_BOARD','ALL_INCLUSIVE'].includes(firstOffer.boardType);

  const stars   = hotel.rating ? Math.min(5, Math.max(1, parseInt(hotel.rating))) : 3;
  const imgIdx  = hotel.hotelId.charCodeAt(hotel.hotelId.length - 1) % HOTEL_IMAGES.length;

  const rawAmenities = hotel.amenities || [];
  const amenities = [...new Set(
    rawAmenities.slice(0, 12).map((a) => AMENITY_MAP[a]).filter(Boolean)
  )].slice(0, 7);
  if (amenities.length === 0) amenities.push('Free WiFi');

  return {
    id:               hotel.hotelId,
    name:             hotel.name,
    city:             cityName,
    country:          hotel.address?.countryCode || '',
    address:          hotel.address?.lines?.join(', ') || cityName,
    stars,
    rating:           7.5,
    reviewCount:      0,
    pricePerNight:    pricePer,
    image:            HOTEL_IMAGES[imgIdx],
    amenities,
    tags:             stars >= 5 ? ['Luxury'] : stars >= 4 ? ['Premium'] : ['Bon rapport qualité-prix'],
    cancellation:     isFree ? 'Annulation gratuite' : 'Non remboursable',
    breakfastIncluded: breakfast,
    competitors:      null,
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

  const { city, checkIn, checkOut, adults = '2' } = req.query;
  if (!city || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing: city, checkIn, checkOut' });
  }

  const cityCode = CITY_CODE[city] || city.substring(0, 3).toUpperCase();
  const nights   = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));

  try {
    const token = await getAmadeusToken();

    /* Step 1: get hotel list */
    const listRes = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=20&radiusUnit=KM&hotelSource=ALL`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const listData = await listRes.json();
    if (!listData.data?.length) return res.json([]);

    /* Step 2: get offers for first 20 hotels */
    const hotelIds = listData.data.slice(0, 20).map((h) => h.hotelId).join(',');
    const offersParams = new URLSearchParams({
      hotelIds,
      checkInDate:  checkIn,
      checkOutDate: checkOut,
      adults:       adults,
      roomQuantity: '1',
      currency:     'EUR',
      bestRateOnly: 'true',
    });

    const offersRes = await fetch(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?${offersParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const offersData = await offersRes.json();
    if (!offersData.data?.length) return res.json([]);

    const hotels = offersData.data
      .filter((o) => o.offers?.length > 0)
      .map((o) => mapHotel(o, city, nights));

    res.json(hotels);
  } catch (err) {
    console.error('Amadeus hotels error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
