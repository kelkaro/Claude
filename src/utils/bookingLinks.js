/**
 * Deep-link builders for partner booking sites.
 * Each function returns a URL that lands directly on the specific offer.
 */

/* ─── FLIGHTS ─── */
export function buildFlightUrl(flight) {
  const { from, to, departure, airline } = flight;
  const date = departure.split('T')[0];           // "2026-05-10"
  const yymmdd = date.replace(/-/g, '').slice(2); // "260510"
  const f = from.code.toLowerCase();
  const t = to.code.toLowerCase();

  switch (airline) {
    case 'Ryanair':
      return `https://www.ryanair.com/fr/fr/flight-search?dateOut=${date}&origin=${from.code}&destination=${to.code}&adults=1&teens=0&children=0&infants=0`;

    case 'KLM Royal Dutch':
      return `https://www.klm.com/travel/fr_fr/apps/ebt/ebt_home.htm?TRIP_TYPE=OW&ORGN=${from.code}&DEST=${to.code}&OUTBOUND_DATE=${date}&CABIN_CLASS=Y&ADULT_PAXTYPE_COUNT=1`;

    case 'Emirates':
      return `https://www.emirates.com/fr/french/book/flights/search/?type=O&origin=${from.code}&destination=${to.code}&date=${date}&class=E&adults=1`;

    case 'Transavia':
      return `https://www.transavia.com/fr-FR/book-a-flight/flights/search/?routeSelection.departureStation=${from.code}&routeSelection.arrivalStation=${to.code}&dateSelection.outboundDate=${date}&passengers.adultCount=1`;

    case 'Vueling':
      return `https://www.vueling.com/fr/vols-vueling/cherchez-et-reservez?iddeparturestation=${from.code}&idarrivalstation=${to.code}&dep=${date}&pax=1&isOneWay=true`;

    case 'TUI Fly':
      return `https://www.tuifly.be/fr/vols?from=${from.code}&to=${to.code}&date=${date}&pax=1`;

    case 'Eurowings':
      return `https://www.eurowings.com/fr/offers/flights/results.html?from=${from.code}&to=${to.code}&date=${date}&pax=1`;

    case 'Brussels Airlines':
      return `https://www.brusselsairlines.com/fr/fr/flightSearch?origin=${from.code}&destination=${to.code}&departureDate=${date}&adults=1&tripType=OneWay`;

    case 'EasyJet':
      return `https://www.easyjet.com/fr/vols/${f}-${t}?departDate=${date}`;

    case 'Air France':
      return `https://www.airfrance.fr`;

    case 'Norwegian':
      return `https://www.norwegian.com/fr/booking/search-flight/?D_City=${from.code}&A_City=${to.code}&D_Date=${date}&TripType=1&Adults=1`;

    case 'Wizz Air':
      return `https://wizzair.com/fr-fr/booking/select-flight/${from.code}/${to.code}/${date}/null/1/0/0`;

    case 'Lufthansa':
      return `https://www.lufthansa.com/fr/fr/book/flights?origin=${from.code}&destination=${to.code}&date=${date}&adults=1&tripType=OW`;

    case 'Turkish Airlines':
      return `https://www.turkishairlines.com/fr-fr/flights/?from=${from.code}&to=${to.code}&departDate=${date}&tripType=OW&adult=1`;

    case 'TAP':
      return `https://www.tapairportugal.com/fr/book/search-flights?tripType=OW&orig=${from.code}&dest=${to.code}&date=${date}&adults=1`;

    default:
      // Skyscanner with exact date — deeplinks to results for that specific day
      return `https://www.skyscanner.fr/transport/vols/${f}/${t}/${yymmdd}/`;
  }
}

/* ─── CARS ─── */
const CITY_IATA = {
  Marrakech: 'RAK',
  Barcelona:  'BCN',
  Paris:      'CDG',
  Dubai:      'DXB',
  London:     'LHR',
  Tokyo:      'NRT',
  Brussels:   'BRU',
  Amsterdam:  'AMS',
  Rome:       'FCO',
  Lisbon:     'LIS',
  Lisbon:     'LIS',
  Athens:     'ATH',
  Vienna:     'VIE',
  Prague:     'PRG',
  Istanbul:   'IST',
  Milan:      'MXP',
};

const COMPANY_URL_BUILDERS = {
  'DiscoverCars': (iata, pickup, ret) =>
    `https://www.discovercars.com/search?location=${iata}&dateFrom=${pickup}T10:00&dateTo=${ret}T10:00`,

  'Hertz': (iata, pickup, ret) =>
    `https://www.hertz.fr/rentacar/reservation/?from=${iata}&fromDate=${pickup}&toDate=${ret}`,

  'Sixt': (iata, pickup, ret) =>
    `https://www.sixt.fr/location-voiture/?station=${iata}&dateFrom=${pickup}&dateTo=${ret}`,

  'Avis': (iata, pickup, ret) =>
    `https://www.avis.fr/location-voiture/?from=${iata}&fromDate=${pickup}&toDate=${ret}`,

  'Enterprise': (iata, pickup, ret) =>
    `https://www.enterprise.fr/fr/location-voiture/locations.html?fromDate=${pickup}&toDate=${ret}`,

  'Sunny Cars': (iata, pickup, ret) =>
    `https://www.sunnycars.fr/search?station=${iata}&from=${pickup}&to=${ret}`,

  'VIPCars': (iata, pickup, ret) =>
    `https://www.vipcars.com/car-hire/${iata}?pickupDate=${pickup}&dropoffDate=${ret}`,

  'Orbit Car Hire': (iata, pickup, ret) =>
    `https://www.orbitcarhire.com/car-hire/${iata}?from=${pickup}&to=${ret}`,

  'Rentalcars': (iata, pickup, ret) =>
    `https://www.rentalcars.com/fr/airport/search/?pickUpLocation=${iata}&pickUpDate=${pickup}&dropOffDate=${ret}`,
};

export function buildCarUrl(car, pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return car.bookingUrl || 'https://www.jetcost.com/location-voiture/';

  const iata = CITY_IATA[car.city] || car.city;
  const builder = COMPANY_URL_BUILDERS[car.company];

  if (builder) return builder(iata, pickupDate, returnDate);

  // Default: Jetcost deep link (exact same format as in the screenshot URL)
  return `https://www.jetcost.com/location-voiture/results/${iata}/${pickupDate}/10:00/${iata}/${returnDate}/10:00`;
}

/* ─── HOTELS ─── */

// Booking.com slug per hotel id (for hotels with a known page)
const BOOKING_SLUGS = {
  HT001:  'hotel/gb/the-dorchester',
  HT004:  'hotel/jp/shibuya-excel-tokyu',
  HT006:  'hotel/fr/plaza-athenee-paris',
  HT007:  'hotel/ma/la-rose-du-desert',
  HT008:  'hotel/ma/la-mamounia',
  HT009:  'hotel/es/arts-barcelona',
  HT010:  'hotel/ae/address-dubai-marina',
  HT031:  'hotel/gb/the-savoy-london',
  HT032:  'hotel/gb/citizenm-tower-of-london',
  HT036:  'hotel/fr/le-bristol',
  HT043:  'hotel/es/w-barcelona',
  HT045:  'hotel/es/generator-barcelona',
  HT047:  'hotel/ae/burj-al-arab',
  HT048:  'hotel/ae/atlantis-the-palm',
  HT051:  'hotel/nl/the-dylan-amsterdam',
  HT055:  'hotel/nl/andaz-amsterdam-prinsengracht',
  HT058:  'hotel/it/generator-roma',
  HT061:  'hotel/pt/bairro-alto',
  HT063:  'hotel/pt/the-independente-hostel-suites',
  HT039:  'hotel/fr/generator-paris',
};

export function buildHotelUrl(hotel, checkIn, checkOut, adults = 2, rooms = 1) {
  const dates = checkIn && checkOut
    ? `&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&no_rooms=${rooms}`
    : '';

  const slug = BOOKING_SLUGS[hotel.id];

  if (slug) {
    return `https://www.booking.com/${slug}.fr.html?${dates}`;
  }

  // Generic city search on Booking.com with dates pre-filled
  const city = encodeURIComponent(hotel.city);
  return `https://www.booking.com/searchresults.fr.html?ss=${city}${dates}`;
}
