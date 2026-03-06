import { useState, useRef, useEffect } from 'react';
import {
  Plane, Hotel, Search, Users, Calendar, Clock3, ChevronDown, X,
  Star, MapPin, TrendingDown, Wifi, Coffee,
} from 'lucide-react';
import AutocompleteInput from '../components/AutocompleteInput';
import LoadingSpinner from '../components/LoadingSpinner';
import PriceComparisonBadge from '../components/PriceComparisonBadge';
import { searchFlights } from '../services/flightService';
import { searchHotels } from '../services/hotelService';
import { airports } from '../data/airports';
import { cities } from '../data/cities';
import { formatPrice, renderStars, ratingLabel } from '../utils/formatters';

/* ── Duration options (like CHECK24) ── */
const DURATION_PRESETS = [
  { id: 'exact',   label: 'Dates exactes' },
  { id: '1w',      label: '1 semaine',     nights: 7  },
  { id: '2w',      label: '2 semaines',    nights: 14 },
  { id: '3w',      label: '3 semaines',    nights: 21 },
  { id: 'custom',  label: 'X à Y nuits'              },
];

/* ── Duration picker popup ── */
function DurationPicker({ value, onChange, onClose }) {
  const [mode,   setMode]   = useState(value.mode   || '1w');
  const [from,   setFrom]   = useState(value.from   || 5);
  const [to,     setTo]     = useState(value.to     || 8);
  const [exact,  setExact]  = useState(value.exact  || 7);

  const apply = () => {
    onChange({ mode, from, to, exact });
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 w-80 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-slate-700">Durée du séjour</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DURATION_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setMode(p.id)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
              mode === p.id
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {mode === 'custom' && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-slate-500">de</span>
          <input
            type="number" min="1" max="30"
            value={from}
            onChange={(e) => setFrom(Number(e.target.value))}
            className="w-16 input-field text-center py-1.5"
          />
          <span className="text-slate-500">à</span>
          <input
            type="number" min="1" max="30"
            value={to}
            onChange={(e) => setTo(Number(e.target.value))}
            className="w-16 input-field text-center py-1.5"
          />
          <span className="text-slate-500">nuits</span>
        </div>
      )}

      {mode === 'exact' && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-slate-500">exactement</span>
          <input
            type="number" min="1" max="30"
            value={exact}
            onChange={(e) => setExact(Number(e.target.value))}
            className="w-16 input-field text-center py-1.5"
          />
          <span className="text-slate-500">nuits</span>
        </div>
      )}

      <button onClick={apply} className="mt-4 w-full btn-primary py-2.5 text-sm">
        Appliquer
      </button>
    </div>
  );
}

/* ── Travelers picker popup ── */
function TravelersPicker({ value, onChange, onClose }) {
  const [adults,   setAdults]   = useState(value.adults   || 2);
  const [children, setChildren] = useState(value.children || 0);
  const [rooms,    setRooms]    = useState(value.rooms    || 1);

  const Counter = ({ label, sub, val, onDec, onInc, min = 0 }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="font-medium text-slate-700 text-sm">{label}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          disabled={val <= min}
          className="w-8 h-8 rounded-full border border-slate-200 text-slate-600 hover:border-brand-400 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors"
        >
          −
        </button>
        <span className="w-5 text-center font-semibold text-slate-800">{val}</span>
        <button
          onClick={onInc}
          className="w-8 h-8 rounded-full border border-slate-200 text-slate-600 hover:border-brand-400 hover:text-brand-600 font-bold transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 w-72 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-slate-700">Voyageurs & chambres</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
      </div>
      <Counter label="Adultes" sub="18 ans et plus" val={adults} min={1}
        onDec={() => setAdults(a => Math.max(1, a - 1))}
        onInc={() => setAdults(a => a + 1)} />
      <Counter label="Enfants" sub="0–17 ans" val={children} min={0}
        onDec={() => setChildren(c => Math.max(0, c - 1))}
        onInc={() => setChildren(c => c + 1)} />
      <Counter label="Chambres" val={rooms} min={1}
        onDec={() => setRooms(r => Math.max(1, r - 1))}
        onInc={() => setRooms(r => r + 1)} />
      <button
        onClick={() => { onChange({ adults, children, rooms }); onClose(); }}
        className="mt-4 w-full btn-primary py-2.5 text-sm"
      >
        Appliquer
      </button>
    </div>
  );
}

/* ── Duration label helper ── */
function durationLabel(dur) {
  if (!dur) return 'Durée ?';
  if (dur.mode === '1w') return '1 semaine';
  if (dur.mode === '2w') return '2 semaines';
  if (dur.mode === '3w') return '3 semaines';
  if (dur.mode === 'exact') return `${dur.exact} nuits`;
  if (dur.mode === 'custom') return `${dur.from}–${dur.to} nuits`;
  return 'Durée ?';
}

function travelersLabel(t) {
  if (!t) return '2 adultes, 0 enfant (1 ch.)';
  return `${t.adults} adulte${t.adults > 1 ? 's' : ''}, ${t.children} enfant${t.children > 1 ? 's' : ''} (${t.rooms} ch.)`;
}

/* ── Package result card ── */
function PackageCard({ flight, hotel }) {
  const nights = 7; // default
  const totalPrice = flight.price + hotel.pricePerNight * nights;
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="card overflow-hidden">
      {/* Hotel image + info row */}
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden relative">
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 left-2">
            <span className="bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-lg">Vol + Hôtel</span>
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between gap-2">
          {/* Hotel info */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {hotel.tags.map(t => <span key={t} className="badge bg-brand-50 text-brand-700">{t}</span>)}
                </div>
                <h3 className="font-bold text-lg text-slate-800 leading-tight">{hotel.name}</h3>
                <p className="text-amber-400 text-sm">{renderStars(hotel.stars)}</p>
                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                  <MapPin size={11} /><span>{hotel.city}, {hotel.country}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="inline-flex items-center justify-center w-11 h-9 bg-brand-600 rounded-xl text-white font-bold text-sm">{hotel.rating}</div>
                <p className="text-xs text-slate-400 mt-0.5">{ratingLabel(hotel.rating)}</p>
                <p className="text-xs text-slate-400">{hotel.reviewCount.toLocaleString()} avis</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1 mt-2">
              {hotel.amenities.slice(0, 4).map(a => (
                <span key={a} className="badge bg-slate-100 text-slate-600">{a}</span>
              ))}
            </div>
          </div>

          {/* Flight summary */}
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 text-sm">
            <Plane size={15} className="text-brand-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-slate-700">{flight.airline}</span>
              <span className="text-slate-400 mx-2">·</span>
              <span className="text-slate-500">{flight.from.code} → {flight.to.code}</span>
              <span className="text-slate-400 mx-2">·</span>
              <span className="text-slate-500">{flight.duration}</span>
              {flight.stops === 0 && <span className="ml-2 text-green-600 font-medium text-xs">Direct</span>}
            </div>
            <span className="text-slate-600 font-medium flex-shrink-0">{formatPrice(flight.price)}</span>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between flex-wrap gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <p className={`text-xs font-medium ${hotel.cancellation === 'Free cancellation' ? 'text-green-600' : 'text-red-500'}`}>
                {hotel.cancellation === 'Free cancellation' ? 'Annulation gratuite' : 'Non remboursable'}
              </p>
              {hotel.breakfastIncluded && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Coffee size={11} /> Petit-déjeuner inclus
                </div>
              )}
              <p className="text-xs text-slate-400">{nights} nuits · 2 adultes</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Total package</p>
              <p className="text-3xl font-bold text-slate-800">{formatPrice(totalPrice)}</p>
              <p className="text-xs text-slate-400 mb-2">vol + {nights} nuits</p>
              {hotel.competitors && (
                <div className="mb-2">
                  <PriceComparisonBadge ourPrice={hotel.pricePerNight} competitors={hotel.competitors} />
                </div>
              )}
              <button className="btn-primary text-sm py-2 px-6">Réserver</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   Main Page
══════════════════════════════════════ */
export default function FlightHotel() {
  /* search fields */
  const [destText,    setDestText]    = useState('');
  const [destObj,     setDestObj]     = useState(null);
  const [originText,  setOriginText]  = useState('');
  const [originAp,    setOriginAp]    = useState(null);
  const [dateFrom,    setDateFrom]    = useState('');
  const [dateTo,      setDateTo]      = useState('');
  const [duration,    setDuration]    = useState({ mode: '1w', nights: 7 });
  const [travelers,   setTravelers]   = useState({ adults: 2, children: 0, rooms: 1 });

  /* UI state */
  const [showDuration,  setShowDuration]  = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);
  const [errors,        setErrors]        = useState({});

  /* results */
  const [packages, setPackages] = useState(null);
  const [loading,  setLoading]  = useState(false);

  const durationRef  = useRef(null);
  const travelersRef = useRef(null);

  // Close popups on outside click
  useEffect(() => {
    const h = (e) => {
      if (!durationRef.current?.contains(e.target))  setShowDuration(false);
      if (!travelersRef.current?.contains(e.target)) setShowTravelers(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const airportOptions = airports.map(a => ({ ...a, label: `${a.city} (${a.iata})` }));
  const cityOptions    = cities.map(c => ({ ...c, label: `${c.city}, ${c.country}` }));

  const validate = () => {
    const e = {};
    if (!destText.trim())   e.dest   = 'Entrez une destination';
    if (!originText.trim()) e.origin = 'Entrez un aéroport de départ';
    if (!dateFrom)          e.date   = 'Choisissez une période de départ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setPackages(null);

    const [flights, hotels] = await Promise.all([
      searchFlights({
        from: originAp?.iata || originText,
        to: destObj?.city || destText,
      }),
      searchHotels({
        city: destObj?.city || destText,
      }),
    ]);

    // Build package combinations: pair each flight with each hotel
    const combos = [];
    flights.slice(0, 5).forEach(f => {
      hotels.slice(0, 4).forEach(h => {
        combos.push({ flight: f, hotel: h, totalPrice: f.price + h.pricePerNight * 7 });
      });
    });
    combos.sort((a, b) => a.totalPrice - b.totalPrice);

    setPackages(combos);
    setLoading(false);
  };

  /* ── Popular destinations ── */
  const popularDests = [
    { label: 'Marrakech',  emoji: '🕌', from: 'BRU' },
    { label: 'Barcelona',  emoji: '🏖️', from: 'BRU' },
    { label: 'Dubaï',      emoji: '🏙️', from: 'BRU' },
    { label: 'Paris',      emoji: '🗼', from: 'BRU' },
    { label: 'Tokyo',      emoji: '⛩️', from: 'AMS' },
  ];

  const quickSearch = (dest) => {
    setDestText(dest.label);
    setOriginText('Brussels (BRU)');
    setOriginAp(airports.find(a => a.iata === dest.from) || null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-brand-800 via-violet-700 to-purple-800 pt-8 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 bg-white/20 rounded-xl px-3 py-1.5">
              <Plane size={16} className="text-white" />
              <span className="text-white text-sm font-medium">+</span>
              <Hotel size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-2 bg-green-400/20 rounded-full px-3 py-1 text-sm text-green-200 font-medium">
              <TrendingDown size={14} /> Économisez jusqu'à 60% sur les forfaits
            </div>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-1">Vols + Hôtels</h1>
          <p className="text-brand-200 mb-8">Trouvez les meilleures offres tout compris — vol et hôtel réunis</p>

          {/* ── CHECK24-style search bar ── */}
          <form onSubmit={handleSearch}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-visible">
              {/* Main row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

                {/* 1. Destination */}
                <div className="lg:col-span-2 p-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Destination / Hôtel
                  </label>
                  <AutocompleteInput
                    value={destText}
                    onChange={setDestText}
                    onSelect={(c) => { setDestObj(c); setDestText(c.label); }}
                    options={cityOptions}
                    getLabel={(c) => c.label}
                    placeholder="Où voulez-vous aller ?"
                    icon={<MapPin size={16} className="text-slate-400" />}
                    error={errors.dest}
                  />
                </div>

                {/* 2. Origin airport */}
                <div className="p-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Vol depuis
                  </label>
                  <AutocompleteInput
                    value={originText}
                    onChange={setOriginText}
                    onSelect={(a) => { setOriginAp(a); setOriginText(a.label); }}
                    options={airportOptions}
                    getLabel={(a) => a.label}
                    renderOption={(a) => (
                      <div>
                        <span className="font-semibold">{a.city}</span>
                        <span className="text-slate-400 ml-1 text-xs">({a.iata})</span>
                        <div className="text-xs text-slate-400 truncate">{a.name}</div>
                      </div>
                    )}
                    placeholder="D'où partez-vous ?"
                    icon={<Plane size={15} className="text-slate-400" />}
                    error={errors.origin}
                  />
                </div>

                {/* 3. Travel period */}
                <div className="p-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Période de départ
                  </label>
                  <div className="flex gap-1.5 items-center">
                    <div className="relative flex-1">
                      <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        className={`input-field pl-8 text-sm ${errors.date ? 'border-red-400' : ''}`}
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <span className="text-slate-400 text-sm">—</span>
                    <div className="relative flex-1">
                      <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        className="input-field pl-8 text-sm"
                        value={dateTo}
                        min={dateFrom}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                {/* 4. Duration + Travelers */}
                <div className="p-4 flex flex-col gap-2">
                  {/* Duration */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Durée du séjour
                    </label>
                    <div ref={durationRef} className="relative">
                      <button
                        type="button"
                        onClick={() => { setShowDuration(v => !v); setShowTravelers(false); }}
                        className="input-field w-full flex items-center justify-between gap-2 text-sm text-left"
                      >
                        <span className="flex items-center gap-2 text-slate-700">
                          <Clock3 size={14} className="text-slate-400" />
                          {durationLabel(duration)}
                        </span>
                        <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                      </button>
                      {showDuration && (
                        <DurationPicker
                          value={duration}
                          onChange={setDuration}
                          onClose={() => setShowDuration(false)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Travelers */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Voyageurs & chambres
                    </label>
                    <div ref={travelersRef} className="relative">
                      <button
                        type="button"
                        onClick={() => { setShowTravelers(v => !v); setShowDuration(false); }}
                        className="input-field w-full flex items-center justify-between gap-2 text-sm text-left"
                      >
                        <span className="flex items-center gap-2 text-slate-700 truncate">
                          <Users size={14} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate text-xs">{travelersLabel(travelers)}</span>
                        </span>
                        <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                      </button>
                      {showTravelers && (
                        <TravelersPicker
                          value={travelers}
                          onChange={setTravelers}
                          onClose={() => setShowTravelers(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search button row */}
              <div className="px-4 pb-4 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2 px-10 py-3 text-base font-bold rounded-xl"
                >
                  <Search size={18} /> Rechercher
                </button>
              </div>
            </div>
          </form>

          {/* Popular destinations chips */}
          {!packages && !loading && (
            <div className="mt-6">
              <p className="text-brand-200 text-sm font-medium mb-3">Destinations populaires</p>
              <div className="flex gap-2 flex-wrap">
                {popularDests.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => quickSearch(d)}
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all backdrop-blur"
                  >
                    <span>{d.emoji}</span> {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && <LoadingSpinner message="Recherche des meilleures offres vol + hôtel…" />}

        {packages && (
          <>
            {/* Summary banner */}
            {packages.length > 0 && (
              <div className="bg-gradient-to-r from-brand-600 to-violet-600 rounded-2xl p-5 mb-6 text-white flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white/70 text-sm">Meilleur forfait trouvé</p>
                  <p className="text-3xl font-bold">{formatPrice(packages[0].totalPrice)}</p>
                  <p className="text-white/60 text-xs mt-0.5">vol + hôtel · {durationLabel(duration)}</p>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-white/60 text-xs">Forfaits</p>
                    <p className="text-2xl font-bold">{packages.length}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Destination</p>
                    <p className="text-lg font-bold">{destText || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            {packages.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-5xl mb-3">✈️🏨</p>
                <p className="font-semibold text-lg">Aucun forfait trouvé</p>
                <p className="text-sm mt-1">Essayez une autre destination ou période</p>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((pkg, i) => (
                  <PackageCard key={i} flight={pkg.flight} hotel={pkg.hotel} />
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !packages && (
          <div className="text-center py-20 text-slate-400">
            <div className="text-6xl mb-4">✈️🏨</div>
            <p className="font-medium text-xl text-slate-500">Trouvez votre forfait idéal</p>
            <p className="text-sm mt-2 max-w-md mx-auto">
              Entrez votre destination, aéroport de départ et période — nous combinons les meilleurs vols et hôtels pour vous.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
