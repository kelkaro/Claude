/**
 * City database used for:
 *  - Hotel / car rental destination autocomplete
 *  - Radius-based nearby-airport departure city search
 */
export const cities = [
  // Belgium
  { city: 'Brussels',   country: 'Belgium',     lat: 50.8503, lng:  4.3517 },
  { city: 'Liège',      country: 'Belgium',     lat: 50.6326, lng:  5.5797 },
  { city: 'Antwerp',    country: 'Belgium',     lat: 51.2194, lng:  4.4025 },
  { city: 'Ghent',      country: 'Belgium',     lat: 51.0543, lng:  3.7174 },
  { city: 'Bruges',     country: 'Belgium',     lat: 51.2093, lng:  3.2247 },
  { city: 'Namur',      country: 'Belgium',     lat: 50.4674, lng:  4.8720 },
  { city: 'Charleroi',  country: 'Belgium',     lat: 50.4108, lng:  4.4444 },
  { city: 'Mons',       country: 'Belgium',     lat: 50.4542, lng:  3.9563 },

  // Netherlands
  { city: 'Amsterdam',  country: 'Netherlands', lat: 52.3676, lng:  4.9041 },
  { city: 'Rotterdam',  country: 'Netherlands', lat: 51.9244, lng:  4.4777 },
  { city: 'The Hague',  country: 'Netherlands', lat: 52.0705, lng:  4.3007 },
  { city: 'Utrecht',    country: 'Netherlands', lat: 52.0907, lng:  5.1214 },
  { city: 'Eindhoven',  country: 'Netherlands', lat: 51.4416, lng:  5.4697 },

  // Germany
  { city: 'Berlin',     country: 'Germany',     lat: 52.5200, lng: 13.4050 },
  { city: 'Munich',     country: 'Germany',     lat: 48.1351, lng: 11.5820 },
  { city: 'Hamburg',    country: 'Germany',     lat: 53.5753, lng: 10.0153 },
  { city: 'Cologne',    country: 'Germany',     lat: 50.9333, lng:  6.9500 },
  { city: 'Frankfurt',  country: 'Germany',     lat: 50.1109, lng:  8.6821 },
  { city: 'Düsseldorf', country: 'Germany',     lat: 51.2217, lng:  6.7762 },
  { city: 'Stuttgart',  country: 'Germany',     lat: 48.7758, lng:  9.1829 },
  { city: 'Dortmund',   country: 'Germany',     lat: 51.5136, lng:  7.4653 },

  // Luxembourg
  { city: 'Luxembourg', country: 'Luxembourg',  lat: 49.6117, lng:  6.1319 },

  // France
  { city: 'Paris',      country: 'France',      lat: 48.8566, lng:  2.3522 },
  { city: 'Lyon',       country: 'France',      lat: 45.7640, lng:  4.8357 },
  { city: 'Marseille',  country: 'France',      lat: 43.2965, lng:  5.3698 },
  { city: 'Nice',       country: 'France',      lat: 43.7102, lng:  7.2620 },
  { city: 'Toulouse',   country: 'France',      lat: 43.6047, lng:  1.4442 },
  { city: 'Bordeaux',   country: 'France',      lat: 44.8378, lng: -0.5792 },
  { city: 'Strasbourg', country: 'France',      lat: 48.5734, lng:  7.7521 },
  { city: 'Nantes',     country: 'France',      lat: 47.2184, lng: -1.5536 },
  { city: 'Lille',      country: 'France',      lat: 50.6292, lng:  3.0573 },
  { city: 'Rennes',     country: 'France',      lat: 48.1173, lng: -1.6778 },

  // United Kingdom
  { city: 'London',     country: 'UK',          lat: 51.5074, lng: -0.1278 },
  { city: 'Manchester', country: 'UK',          lat: 53.4808, lng: -2.2426 },
  { city: 'Edinburgh',  country: 'UK',          lat: 55.9533, lng: -3.1883 },
  { city: 'Birmingham', country: 'UK',          lat: 52.4862, lng: -1.8904 },
  { city: 'Glasgow',    country: 'UK',          lat: 55.8642, lng: -4.2518 },

  // Switzerland
  { city: 'Zurich',     country: 'Switzerland', lat: 47.3769, lng:  8.5417 },
  { city: 'Geneva',     country: 'Switzerland', lat: 46.2044, lng:  6.1432 },
  { city: 'Basel',      country: 'Switzerland', lat: 47.5596, lng:  7.5886 },
  { city: 'Bern',       country: 'Switzerland', lat: 46.9481, lng:  7.4474 },

  // Austria
  { city: 'Vienna',     country: 'Austria',     lat: 48.2082, lng: 16.3738 },
  { city: 'Salzburg',   country: 'Austria',     lat: 47.8095, lng: 13.0550 },
  { city: 'Innsbruck',  country: 'Austria',     lat: 47.2692, lng: 11.4041 },

  // Spain
  { city: 'Madrid',     country: 'Spain',       lat: 40.4168, lng: -3.7038 },
  { city: 'Barcelona',  country: 'Spain',       lat: 41.3851, lng:  2.1734 },
  { city: 'Seville',    country: 'Spain',       lat: 37.3891, lng: -5.9845 },
  { city: 'Valencia',   country: 'Spain',       lat: 39.4699, lng: -0.3763 },
  { city: 'Málaga',     country: 'Spain',       lat: 36.7213, lng: -4.4213 },
  { city: 'Bilbao',     country: 'Spain',       lat: 43.2630, lng: -2.9350 },

  // Italy
  { city: 'Rome',       country: 'Italy',       lat: 41.9028, lng: 12.4964 },
  { city: 'Milan',      country: 'Italy',       lat: 45.4654, lng:  9.1859 },
  { city: 'Venice',     country: 'Italy',       lat: 45.4408, lng: 12.3155 },
  { city: 'Florence',   country: 'Italy',       lat: 43.7696, lng: 11.2558 },
  { city: 'Naples',     country: 'Italy',       lat: 40.8518, lng: 14.2681 },
  { city: 'Bologna',    country: 'Italy',       lat: 44.4949, lng: 11.3426 },

  // Portugal
  { city: 'Lisbon',     country: 'Portugal',    lat: 38.7167, lng: -9.1333 },
  { city: 'Porto',      country: 'Portugal',    lat: 41.1496, lng: -8.6109 },
  { city: 'Faro',       country: 'Portugal',    lat: 37.0194, lng: -7.9322 },
  { city: 'Algarve',    country: 'Portugal',    lat: 37.0179, lng: -8.0000 },

  // Scandinavia
  { city: 'Copenhagen', country: 'Denmark',     lat: 55.6761, lng: 12.5683 },
  { city: 'Oslo',       country: 'Norway',      lat: 59.9139, lng: 10.7522 },
  { city: 'Stockholm',  country: 'Sweden',      lat: 59.3293, lng: 18.0686 },
  { city: 'Helsinki',   country: 'Finland',     lat: 60.1699, lng: 24.9384 },

  // Eastern Europe
  { city: 'Warsaw',     country: 'Poland',      lat: 52.2297, lng: 21.0122 },
  { city: 'Kraków',     country: 'Poland',      lat: 50.0647, lng: 19.9450 },
  { city: 'Prague',     country: 'Czech Republic', lat: 50.0755, lng: 14.4378 },
  { city: 'Budapest',   country: 'Hungary',     lat: 47.4979, lng: 19.0402 },
  { city: 'Bucharest',  country: 'Romania',     lat: 44.4268, lng: 26.1025 },

  // Greece & Turkey
  { city: 'Athens',     country: 'Greece',      lat: 37.9838, lng: 23.7275 },
  { city: 'Santorini',  country: 'Greece',      lat: 36.3932, lng: 25.4615 },
  { city: 'Mykonos',    country: 'Greece',      lat: 37.4467, lng: 25.3289 },
  { city: 'Rhodes',     country: 'Greece',      lat: 36.4349, lng: 28.2176 },
  { city: 'Istanbul',   country: 'Turkey',      lat: 41.0082, lng: 28.9784 },
  { city: 'Antalya',    country: 'Turkey',      lat: 36.8969, lng: 30.7133 },

  // Morocco
  { city: 'Marrakech',  country: 'Morocco',     lat: 31.6295, lng: -7.9811 },
  { city: 'Casablanca', country: 'Morocco',     lat: 33.5731, lng: -7.5898 },
  { city: 'Agadir',     country: 'Morocco',     lat: 30.4278, lng: -9.5981 },
  { city: 'Fès',        country: 'Morocco',     lat: 34.0181, lng: -5.0078 },
  { city: 'Tangier',    country: 'Morocco',     lat: 35.7595, lng: -5.8340 },

  // Middle East
  { city: 'Dubai',      country: 'UAE',         lat: 25.2048, lng: 55.2708 },
  { city: 'Abu Dhabi',  country: 'UAE',         lat: 24.4539, lng: 54.3773 },
  { city: 'Doha',       country: 'Qatar',       lat: 25.2854, lng: 51.5310 },

  // Americas
  { city: 'New York',   country: 'USA',         lat: 40.7128, lng:-74.0060 },
  { city: 'Los Angeles',country: 'USA',         lat: 34.0522, lng:-118.2437},
  { city: 'Miami',      country: 'USA',         lat: 25.7617, lng:-80.1918 },
  { city: 'Chicago',    country: 'USA',         lat: 41.8781, lng:-87.6298 },
  { city: 'San Francisco',country:'USA',        lat: 37.7749, lng:-122.4194},
  { city: 'Toronto',    country: 'Canada',      lat: 43.6532, lng:-79.3832 },
  { city: 'Montreal',   country: 'Canada',      lat: 45.5017, lng:-73.5673 },
  { city: 'Cancún',     country: 'Mexico',      lat: 21.1619, lng:-86.8515 },

  // Asia & Pacific
  { city: 'Tokyo',      country: 'Japan',       lat: 35.6762, lng:139.6503 },
  { city: 'Osaka',      country: 'Japan',       lat: 34.6937, lng:135.5023 },
  { city: 'Bangkok',    country: 'Thailand',    lat: 13.7563, lng:100.5018 },
  { city: 'Bali',       country: 'Indonesia',   lat: -8.3405, lng:115.0920 },
  { city: 'Singapore',  country: 'Singapore',   lat:  1.3521, lng:103.8198 },
  { city: 'Hong Kong',  country: 'China',       lat: 22.3193, lng:114.1694 },
  { city: 'Seoul',      country: 'South Korea', lat: 37.5665, lng:126.9780 },
  { city: 'Kuala Lumpur',country:'Malaysia',    lat:  3.1390, lng:101.6869 },
  { city: 'Sydney',     country: 'Australia',   lat:-33.8688, lng:151.2093 },
  { city: 'Melbourne',  country: 'Australia',   lat:-37.8136, lng:144.9631 },
];
