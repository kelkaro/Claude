/**
 * Airport database with IATA codes and coordinates.
 * Coordinates are used for radius-based nearby-airport search.
 */
export const airports = [
  // ── Belgium ──────────────────────────────────────────────────
  { iata: 'BRU', name: 'Brussels Airport',             city: 'Brussels',    country: 'Belgium',        lat: 50.9014, lng:  4.4844 },
  { iata: 'CRL', name: 'Brussels South Charleroi',     city: 'Charleroi',   country: 'Belgium',        lat: 50.4592, lng:  4.4531 },
  { iata: 'LGG', name: 'Liège Airport',                city: 'Liège',       country: 'Belgium',        lat: 50.6374, lng:  5.4432 },
  { iata: 'OST', name: 'Ostend-Bruges Airport',        city: 'Ostend',      country: 'Belgium',        lat: 51.2008, lng:  2.8622 },

  // ── Netherlands ──────────────────────────────────────────────
  { iata: 'AMS', name: 'Amsterdam Schiphol',           city: 'Amsterdam',   country: 'Netherlands',    lat: 52.3086, lng:  4.7639 },
  { iata: 'RTM', name: 'Rotterdam The Hague',          city: 'Rotterdam',   country: 'Netherlands',    lat: 51.9569, lng:  4.4372 },
  { iata: 'EIN', name: 'Eindhoven Airport',            city: 'Eindhoven',   country: 'Netherlands',    lat: 51.4501, lng:  5.3742 },

  // ── Germany ───────────────────────────────────────────────────
  { iata: 'DUS', name: 'Düsseldorf Airport',           city: 'Düsseldorf',  country: 'Germany',        lat: 51.2895, lng:  6.7668 },
  { iata: 'CGN', name: 'Cologne Bonn Airport',         city: 'Cologne',     country: 'Germany',        lat: 50.8658, lng:  7.1427 },
  { iata: 'DTM', name: 'Dortmund Airport',             city: 'Dortmund',    country: 'Germany',        lat: 51.5183, lng:  7.6122 },
  { iata: 'FRA', name: 'Frankfurt Airport',            city: 'Frankfurt',   country: 'Germany',        lat: 50.0379, lng:  8.5622 },
  { iata: 'MUC', name: 'Munich Airport',               city: 'Munich',      country: 'Germany',        lat: 48.3538, lng: 11.7861 },
  { iata: 'BER', name: 'Berlin Brandenburg Airport',  city: 'Berlin',      country: 'Germany',        lat: 52.3667, lng: 13.5033 },
  { iata: 'HAM', name: 'Hamburg Airport',              city: 'Hamburg',     country: 'Germany',        lat: 53.6304, lng:  9.9882 },
  { iata: 'STR', name: 'Stuttgart Airport',            city: 'Stuttgart',   country: 'Germany',        lat: 48.6899, lng:  9.2220 },
  { iata: 'NUE', name: 'Nuremberg Airport',            city: 'Nuremberg',   country: 'Germany',        lat: 49.4987, lng: 11.0669 },
  { iata: 'PAD', name: 'Paderborn Lippstadt Airport', city: 'Paderborn',   country: 'Germany',        lat: 51.6141, lng:  8.6163 },

  // ── Luxembourg ───────────────────────────────────────────────
  { iata: 'LUX', name: 'Luxembourg Findel Airport',   city: 'Luxembourg',  country: 'Luxembourg',     lat: 49.6233, lng:  6.2044 },

  // ── France ───────────────────────────────────────────────────
  { iata: 'CDG', name: 'Paris Charles de Gaulle',      city: 'Paris',       country: 'France',         lat: 49.0097, lng:  2.5479 },
  { iata: 'ORY', name: 'Paris Orly Airport',           city: 'Paris',       country: 'France',         lat: 48.7233, lng:  2.3794 },
  { iata: 'LIL', name: 'Lille Lesquin Airport',        city: 'Lille',       country: 'France',         lat: 50.5636, lng:  3.0890 },
  { iata: 'SXB', name: 'Strasbourg Airport',           city: 'Strasbourg',  country: 'France',         lat: 48.5383, lng:  7.6283 },
  { iata: 'LYS', name: 'Lyon Saint-Exupéry',          city: 'Lyon',        country: 'France',         lat: 45.7256, lng:  5.0811 },
  { iata: 'MRS', name: 'Marseille Provence Airport',   city: 'Marseille',   country: 'France',         lat: 43.4392, lng:  5.2214 },
  { iata: 'NCE', name: "Nice Côte d'Azur Airport",    city: 'Nice',        country: 'France',         lat: 43.6584, lng:  7.2159 },
  { iata: 'TLS', name: 'Toulouse Blagnac Airport',     city: 'Toulouse',    country: 'France',         lat: 43.6293, lng:  1.3638 },
  { iata: 'BOD', name: 'Bordeaux Mérignac Airport',   city: 'Bordeaux',    country: 'France',         lat: 44.8283, lng: -0.7156 },
  { iata: 'NTE', name: 'Nantes Atlantique Airport',    city: 'Nantes',      country: 'France',         lat: 47.1532, lng: -1.6108 },

  // ── United Kingdom ───────────────────────────────────────────
  { iata: 'LHR', name: 'London Heathrow Airport',      city: 'London',      country: 'UK',             lat: 51.4700, lng: -0.4543 },
  { iata: 'LGW', name: 'London Gatwick Airport',       city: 'London',      country: 'UK',             lat: 51.1537, lng: -0.1821 },
  { iata: 'STN', name: 'London Stansted Airport',      city: 'London',      country: 'UK',             lat: 51.8850, lng:  0.2350 },
  { iata: 'MAN', name: 'Manchester Airport',           city: 'Manchester',  country: 'UK',             lat: 53.3537, lng: -2.2750 },
  { iata: 'BHX', name: 'Birmingham Airport',           city: 'Birmingham',  country: 'UK',             lat: 52.4538, lng: -1.7480 },
  { iata: 'EDI', name: 'Edinburgh Airport',            city: 'Edinburgh',   country: 'UK',             lat: 55.9500, lng: -3.3725 },
  { iata: 'GLA', name: 'Glasgow Airport',              city: 'Glasgow',     country: 'UK',             lat: 55.8719, lng: -4.4330 },

  // ── Switzerland ──────────────────────────────────────────────
  { iata: 'ZRH', name: 'Zurich Airport',               city: 'Zurich',      country: 'Switzerland',    lat: 47.4647, lng:  8.5492 },
  { iata: 'GVA', name: 'Geneva Airport',               city: 'Geneva',      country: 'Switzerland',    lat: 46.2381, lng:  6.1089 },
  { iata: 'BSL', name: 'EuroAirport Basel-Mulhouse',   city: 'Basel',       country: 'Switzerland',    lat: 47.5896, lng:  7.5299 },

  // ── Austria ──────────────────────────────────────────────────
  { iata: 'VIE', name: 'Vienna International Airport', city: 'Vienna',      country: 'Austria',        lat: 48.1103, lng: 16.5697 },
  { iata: 'SZG', name: 'Salzburg Airport',             city: 'Salzburg',    country: 'Austria',        lat: 47.7933, lng: 13.0043 },

  // ── Spain ────────────────────────────────────────────────────
  { iata: 'MAD', name: 'Madrid Barajas Airport',       city: 'Madrid',      country: 'Spain',          lat: 40.4719, lng: -3.5626 },
  { iata: 'BCN', name: 'Barcelona El Prat Airport',    city: 'Barcelona',   country: 'Spain',          lat: 41.2971, lng:  2.0785 },
  { iata: 'AGP', name: 'Málaga Airport',              city: 'Málaga',     country: 'Spain',          lat: 36.6749, lng: -4.4991 },
  { iata: 'PMI', name: 'Palma de Mallorca Airport',    city: 'Palma',       country: 'Spain',          lat: 39.5517, lng:  2.7388 },
  { iata: 'ALC', name: 'Alicante Airport',             city: 'Alicante',    country: 'Spain',          lat: 38.2822, lng: -0.5582 },
  { iata: 'TFS', name: 'Tenerife South Airport',       city: 'Tenerife',    country: 'Spain',          lat: 28.0445, lng:-16.5725 },
  { iata: 'IBZ', name: 'Ibiza Airport',                city: 'Ibiza',       country: 'Spain',          lat: 38.8729, lng:  1.3731 },

  // ── Italy ────────────────────────────────────────────────────
  { iata: 'FCO', name: 'Rome Fiumicino Airport',       city: 'Rome',        country: 'Italy',          lat: 41.8003, lng: 12.2389 },
  { iata: 'MXP', name: 'Milan Malpensa Airport',       city: 'Milan',       country: 'Italy',          lat: 45.6306, lng:  8.7281 },
  { iata: 'BGY', name: 'Bergamo Orio al Serio',        city: 'Bergamo',     country: 'Italy',          lat: 45.6739, lng:  9.7042 },
  { iata: 'VCE', name: 'Venice Marco Polo Airport',    city: 'Venice',      country: 'Italy',          lat: 45.5053, lng: 12.3519 },
  { iata: 'NAP', name: 'Naples International Airport', city: 'Naples',      country: 'Italy',          lat: 40.8860, lng: 14.2908 },

  // ── Portugal ─────────────────────────────────────────────────
  { iata: 'LIS', name: 'Lisbon Humberto Delgado',      city: 'Lisbon',      country: 'Portugal',       lat: 38.7756, lng: -9.1354 },
  { iata: 'OPO', name: 'Porto Airport',                city: 'Porto',       country: 'Portugal',       lat: 41.2481, lng: -8.6814 },
  { iata: 'FAO', name: 'Faro Airport',                 city: 'Faro',        country: 'Portugal',       lat: 37.0144, lng: -7.9659 },

  // ── Scandinavia ──────────────────────────────────────────────
  { iata: 'CPH', name: 'Copenhagen Airport',           city: 'Copenhagen',  country: 'Denmark',        lat: 55.6181, lng: 12.6561 },
  { iata: 'OSL', name: 'Oslo Gardermoen Airport',      city: 'Oslo',        country: 'Norway',         lat: 60.1939, lng: 11.1004 },
  { iata: 'ARN', name: 'Stockholm Arlanda Airport',    city: 'Stockholm',   country: 'Sweden',         lat: 59.6519, lng: 17.9186 },
  { iata: 'HEL', name: 'Helsinki Vantaa Airport',      city: 'Helsinki',    country: 'Finland',        lat: 60.3172, lng: 24.9633 },

  // ── Eastern Europe ───────────────────────────────────────────
  { iata: 'WAW', name: 'Warsaw Chopin Airport',        city: 'Warsaw',      country: 'Poland',         lat: 52.1657, lng: 20.9671 },
  { iata: 'PRG', name: 'Prague Václav Havel Airport', city: 'Prague',      country: 'Czech Republic', lat: 50.1008, lng: 14.2600 },
  { iata: 'BUD', name: 'Budapest Ferenc Liszt',        city: 'Budapest',    country: 'Hungary',        lat: 47.4369, lng: 19.2556 },
  { iata: 'OTP', name: 'Bucharest Henri Coanda',       city: 'Bucharest',   country: 'Romania',        lat: 44.5711, lng: 26.0850 },

  // ── Greece & Turkey ──────────────────────────────────────────
  { iata: 'ATH', name: 'Athens Eleftherios Venizelos', city: 'Athens',      country: 'Greece',         lat: 37.9364, lng: 23.9445 },
  { iata: 'HER', name: 'Heraklion Nikos Kazantzakis', city: 'Heraklion',   country: 'Greece',         lat: 35.3397, lng: 25.1803 },
  { iata: 'SKG', name: 'Thessaloniki Airport',         city: 'Thessaloniki',country: 'Greece',         lat: 40.5197, lng: 22.9709 },
  { iata: 'IST', name: 'Istanbul Airport',             city: 'Istanbul',    country: 'Turkey',         lat: 41.2753, lng: 28.7519 },
  { iata: 'AYT', name: 'Antalya Airport',              city: 'Antalya',     country: 'Turkey',         lat: 36.8987, lng: 30.8003 },
  { iata: 'SAW', name: 'Istanbul Sabiha Gökçen',      city: 'Istanbul',    country: 'Turkey',         lat: 40.8986, lng: 29.3092 },

  // ── Morocco ──────────────────────────────────────────────────
  { iata: 'RAK', name: 'Marrakech Menara Airport',     city: 'Marrakech',   country: 'Morocco',        lat: 31.6069, lng: -8.0363 },
  { iata: 'CMN', name: 'Casablanca Mohammed V',        city: 'Casablanca',  country: 'Morocco',        lat: 33.3675, lng: -7.5900 },
  { iata: 'AGA', name: 'Agadir Al Massira Airport',    city: 'Agadir',      country: 'Morocco',        lat: 30.3250, lng: -9.4131 },
  { iata: 'FEZ', name: 'Fès Saïss Airport',           city: 'Fès',         country: 'Morocco',        lat: 33.9272, lng: -4.9780 },
  { iata: 'TNG', name: 'Tangier Ibn Battouta Airport', city: 'Tangier',     country: 'Morocco',        lat: 35.7269, lng: -5.9169 },
  { iata: 'NDR', name: 'Nador Aroui Airport',          city: 'Nador',       country: 'Morocco',        lat: 34.9888, lng: -3.0282 },

  // ── Middle East ──────────────────────────────────────────────
  { iata: 'DXB', name: 'Dubai International Airport',  city: 'Dubai',       country: 'UAE',            lat: 25.2532, lng: 55.3657 },
  { iata: 'AUH', name: 'Abu Dhabi International',      city: 'Abu Dhabi',   country: 'UAE',            lat: 24.4330, lng: 54.6511 },
  { iata: 'DOH', name: 'Hamad International Airport',  city: 'Doha',        country: 'Qatar',          lat: 25.2731, lng: 51.6081 },

  // ── North America ────────────────────────────────────────────
  { iata: 'JFK', name: 'New York John F. Kennedy',     city: 'New York',    country: 'USA',            lat: 40.6413, lng:-73.7781 },
  { iata: 'EWR', name: 'Newark Liberty Airport',       city: 'New York',    country: 'USA',            lat: 40.6895, lng:-74.1745 },
  { iata: 'LAX', name: 'Los Angeles International',    city: 'Los Angeles', country: 'USA',            lat: 33.9425, lng:-118.4081},
  { iata: 'ORD', name: "Chicago O'Hare International", city: 'Chicago',     country: 'USA',            lat: 41.9742, lng:-87.9073 },
  { iata: 'MIA', name: 'Miami International Airport',  city: 'Miami',       country: 'USA',            lat: 25.7959, lng:-80.2870 },
  { iata: 'SFO', name: 'San Francisco International', city: 'San Francisco',country: 'USA',            lat: 37.6213, lng:-122.379 },
  { iata: 'BOS', name: 'Boston Logan International',   city: 'Boston',      country: 'USA',            lat: 42.3656, lng:-71.0096 },
  { iata: 'YYZ', name: 'Toronto Pearson International',city: 'Toronto',     country: 'Canada',         lat: 43.6777, lng:-79.6248 },
  { iata: 'YUL', name: 'Montréal Pierre E. Trudeau',  city: 'Montreal',    country: 'Canada',         lat: 45.4706, lng:-73.7408 },

  // ── Asia ─────────────────────────────────────────────────────
  { iata: 'NRT', name: 'Tokyo Narita Airport',         city: 'Tokyo',       country: 'Japan',          lat: 35.7720, lng:140.3929 },
  { iata: 'HND', name: 'Tokyo Haneda Airport',         city: 'Tokyo',       country: 'Japan',          lat: 35.5494, lng:139.7798 },
  { iata: 'SIN', name: 'Singapore Changi Airport',     city: 'Singapore',   country: 'Singapore',      lat:  1.3644, lng:103.9915 },
  { iata: 'HKG', name: 'Hong Kong International',      city: 'Hong Kong',   country: 'China',          lat: 22.3080, lng:113.9185 },
  { iata: 'BKK', name: 'Bangkok Suvarnabhumi Airport', city: 'Bangkok',     country: 'Thailand',       lat: 13.6900, lng:100.7501 },
  { iata: 'DEL', name: 'Delhi Indira Gandhi Intl',     city: 'Delhi',       country: 'India',          lat: 28.5562, lng: 77.1000 },
  { iata: 'BOM', name: 'Mumbai Chhatrapati Shivaji',   city: 'Mumbai',      country: 'India',          lat: 19.0896, lng: 72.8656 },
  { iata: 'ICN', name: 'Seoul Incheon International',  city: 'Seoul',       country: 'South Korea',    lat: 37.4602, lng:126.4407 },
  { iata: 'KUL', name: 'Kuala Lumpur International',   city: 'Kuala Lumpur',country: 'Malaysia',       lat:  2.7456, lng:101.7099 },

  // ── Africa & Oceania ─────────────────────────────────────────
  { iata: 'CAI', name: 'Cairo International Airport',  city: 'Cairo',       country: 'Egypt',          lat: 30.1219, lng: 31.4056 },
  { iata: 'TUN', name: 'Tunis Carthage Airport',       city: 'Tunis',       country: 'Tunisia',        lat: 36.8510, lng: 10.2272 },
  { iata: 'JNB', name: 'Johannesburg O.R. Tambo',      city: 'Johannesburg',country: 'South Africa',   lat:-26.1392, lng: 28.2460 },
  { iata: 'SYD', name: 'Sydney Kingsford Smith',       city: 'Sydney',      country: 'Australia',      lat:-33.9399, lng:151.1753 },
  { iata: 'MEL', name: 'Melbourne Airport',            city: 'Melbourne',   country: 'Australia',      lat:-37.6733, lng:144.8430 },
];

/** Quick lookup map: IATA → airport object */
export const airportByIata = Object.fromEntries(airports.map(a => [a.iata, a]));
