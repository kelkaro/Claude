import { useState, useRef, useEffect } from 'react';
import {
  Plane, ArrowLeftRight, Users, Search, SlidersHorizontal,
  MapPin, Calendar, X,
} from 'lucide-react';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AutocompleteInput from '../components/AutocompleteInput';
import KiwiDatePicker from '../components/KiwiDatePicker';
import { searchFlights } from '../services/flightService';
import { airports } from '../data/airports';
import { cities } from '../data/cities';
import { airportsWithinRadius } from '../utils/geo';

const cabinOptions  = ['Any', 'Economy', 'Business', 'First'];
const sortOptions   = ['Cheapest', 'Fastest', 'Best'];
const RADIUS_OPTIONS = [100, 150, 200, 250, 300, 400, 500];

function fmtDay(iso) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

function DateTrigger({ label, value, placeholder, onClick, error }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
      <button
        type="button"
        onClick={onClick}
        className={`input-field w-full text-left flex items-center gap-2 ${error ? 'border-red-400' : ''}`}
      >
        <Calendar size={15} className="text-slate-400 shrink-0" />
        <span className={value ? 'text-slate-800' : 'text-slate-400'}>{value || placeholder}</span>
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function Flights() {
  /* ── origin / destination ── */
  const [tripType,    setTripType]    = useState('round');
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport,   setToAirport]   = useState(null);
  const [fromText,    setFromText]    = useState('');
  const [toText,      setToText]      = useState('');

  /* ── nearby mode ── */
  const [nearbyMode,     setNearbyMode]     = useState(false);
  const [nearbyCity,     setNearbyCity]     = useState(null);
  const [nearbyCityText, setNearbyCityText] = useState('');
  const [radius,         setRadius]         = useState(250);
  const [nearbyAirports, setNearbyAirports] = useState([]);
  const [excludedIatas,  setExcludedIatas]  = useState(new Set());

  /* ── Kiwi date state ── */
  const [dateState, setDateState] = useState({
    depStart: '', depEnd: '', depFlex: 0,
    returnMode: 'date',
    retStart: '', retEnd: '', retFlex: 0,
    durationMin: 7, durationMax: 14,
  });
  const patchDate = (patch) => setDateState((prev) => ({ ...prev, ...patch }));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  /* ── pax / cabin ── */
  const [passengers, setPassengers] = useState(1);
  const [cabin,      setCabin]      = useState('Any');

  /* ── results ── */
  const [results,     setResults]     = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [sort,        setSort]        = useState('Cheapest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxStops,    setMaxStops]    = useState(2);
  const [errors,      setErrors]      = useState({});

  /* close date picker on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── derived options ── */
  const airportOptions = airports.map((a) => ({
    ...a, label: `${a.city} (${a.iata})`, sublabel: `${a.name} · ${a.country}`,
  }));
  const cityOptions = cities.map((c) => ({ ...c, label: `${c.city}, ${c.country}` }));

  const handleSwap = () => {
    setFromAirport(toAirport); setToAirport(fromAirport);
    setFromText(toText);       setToText(fromText);
  };

  const findNearbyAirports = (city, r) => {
    if (!city) return;
    setNearbyAirports(airportsWithinRadius(city.lat, city.lng, r));
    setExcludedIatas(new Set());
  };

  const toggleExclude = (iata) =>
    setExcludedIatas((prev) => { const s = new Set(prev); s.has(iata) ? s.delete(iata) : s.add(iata); return s; });

  /* ── validation ── */
  const validate = () => {
    const e = {};
    if (nearbyMode) { if (!nearbyCity) e.from = 'Veuillez sélectionner une ville'; }
    else            { if (!fromAirport && !fromText.trim()) e.from = 'Veuillez entrer une origine'; }
    if (!toAirport && !toText.trim()) e.to = 'Veuillez entrer une destination';
    if (!dateState.depStart) e.date = 'Veuillez sélectionner une date de départ';
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ── search ── */
  const handleSearch = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true); setResults(null);

    const activeIatas = nearbyAirports.filter((a) => !excludedIatas.has(a.iata)).map((a) => a.iata);
    const params = {
      fromIatas: nearbyMode && activeIatas.length ? activeIatas : undefined,
      from:      !nearbyMode ? (fromAirport?.iata || fromText) : undefined,
      to:        toAirport?.iata || toText,
      class:     cabin,
      date:      dateState.depStart,
      returnDate: dateState.retStart,
    };
    const data = await searchFlights(params);
    setResults(data);
    setLoading(false);
  };

  /* ── sort ── */
  const sorted = results
    ? [...results]
        .filter((f) => f.stops <= maxStops)
        .sort((a, b) => {
          if (sort === 'Cheapest') return a.price - b.price;
          if (sort === 'Fastest')  return a.duration.localeCompare(b.duration);
          return (a.price * 0.5 + a.stops * 50) - (b.price * 0.5 + b.stops * 50);
        })
    : null;

  /* ── date display strings ── */
  const depLabel = dateState.depStart
    ? fmtDay(dateState.depStart) + (dateState.depEnd && dateState.depEnd !== dateState.depStart ? ` — ${fmtDay(dateState.depEnd)}` : '')
    + (dateState.depFlex ? ` (±${dateState.depFlex}j)` : '')
    : '';

  const retLabel = tripType === 'round'
    ? dateState.returnMode === 'duration'
      ? `Séjour : ${dateState.durationMin}–${dateState.durationMax} nuits`
      : dateState.retStart
        ? fmtDay(dateState.retStart) + (dateState.retEnd && dateState.retEnd !== dateState.retStart ? ` — ${fmtDay(dateState.retEnd)}` : '')
          + (dateState.retFlex ? ` (±${dateState.retFlex}j)` : '')
        : ''
    : '';

  /* ── nearby "from" chip label ── */
  const nearbyChip = nearbyCity
    ? `${nearbyCity.city.slice(0, 8)}${nearbyCity.city.length > 8 ? '…' : ''} +${radius} km`
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 pt-10 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-1">Rechercher des vols</h1>
          <p className="text-brand-200 mb-6">Comparez les meilleurs tarifs sur des centaines de compagnies</p>

          {/* trip-type + toggles */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="flex gap-1 bg-white/20 rounded-xl p-1">
              {[['round','Aller-retour'],['oneway','Aller simple']].map(([t, label]) => (
                <button key={t} type="button" onClick={() => setTripType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tripType === t ? 'bg-white text-brand-700' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setNearbyMode(!nearbyMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                nearbyMode ? 'bg-white text-brand-700 border-white' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
              }`}
            >
              <MapPin size={15} /> Aéroports proches ({radius} km)
            </button>
          </div>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-4">

            {/* Row 1: From / To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">De</label>
                {nearbyMode ? (
                  <>
                    {nearbyChip ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm font-medium">
                          <MapPin size={13} /> {nearbyChip}
                        </span>
                        <button type="button" onClick={() => { setNearbyCity(null); setNearbyCityText(''); setNearbyAirports([]); }}
                          className="text-slate-400 hover:text-slate-600">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <AutocompleteInput
                        value={nearbyCityText}
                        onChange={setNearbyCityText}
                        onSelect={(c) => { setNearbyCity(c); setNearbyCityText(c.label); findNearbyAirports(c, radius); }}
                        options={cityOptions}
                        getLabel={(c) => c.label}
                        placeholder="Entrez votre ville (ex. Liège)"
                        icon={<MapPin size={16} className="text-slate-400" />}
                        error={errors.from}
                      />
                    )}
                    {/* Radius + airport chips */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {RADIUS_OPTIONS.map((r) => (
                        <button key={r} type="button"
                          onClick={() => { setRadius(r); if (nearbyCity) findNearbyAirports(nearbyCity, r); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                            radius === r ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600 hover:border-brand-300'
                          }`}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                    {nearbyAirports.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {nearbyAirports.map((a) => (
                          <button key={a.iata} type="button" onClick={() => toggleExclude(a.iata)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                              excludedIatas.has(a.iata)
                                ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                                : 'border-brand-200 bg-brand-50 text-brand-700'
                            }`}
                          >
                            {a.iata} <span className="text-slate-400">{a.distanceKm} km</span>
                            {excludedIatas.has(a.iata) && <X size={10} />}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
                  </>
                ) : (
                  <AutocompleteInput
                    value={fromText}
                    onChange={setFromText}
                    onSelect={(a) => { setFromAirport(a); setFromText(a.label); }}
                    options={airportOptions}
                    getLabel={(a) => a.label}
                    renderOption={(a) => (
                      <div>
                        <span className="font-semibold">{a.city}</span>
                        <span className="text-slate-400 ml-1 text-xs">({a.iata})</span>
                        <div className="text-xs text-slate-400 truncate">{a.name}</div>
                      </div>
                    )}
                    placeholder="Ville ou code aéroport"
                    icon={<Plane size={16} className="text-slate-400" />}
                    error={errors.from}
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">À</label>
                <div className="relative">
                  <AutocompleteInput
                    value={toText}
                    onChange={setToText}
                    onSelect={(a) => { setToAirport(a); setToText(a.label); }}
                    options={airportOptions}
                    getLabel={(a) => a.label}
                    renderOption={(a) => (
                      <div>
                        <span className="font-semibold">{a.city}</span>
                        <span className="text-slate-400 ml-1 text-xs">({a.iata})</span>
                        <div className="text-xs text-slate-400 truncate">{a.name}</div>
                      </div>
                    )}
                    placeholder="Ville ou code aéroport"
                    icon={<Plane size={16} className="text-slate-400 rotate-90" />}
                    error={errors.to}
                  />
                  {!nearbyMode && (
                    <button type="button" onClick={handleSwap}
                      className="absolute right-2 top-3 p-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors z-10"
                      title="Inverser"
                    >
                      <ArrowLeftRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Dates (Kiwi picker) + Pax + Cabin + Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">

              {/* Date trigger */}
              <div className="relative sm:col-span-2" ref={datePickerRef}>
                <div className="grid grid-cols-2 gap-2">
                  <DateTrigger
                    label="Départ"
                    value={depLabel}
                    placeholder="Sélectionnez"
                    onClick={() => setShowDatePicker((v) => !v)}
                    error={errors.date}
                  />
                  {tripType === 'round' && (
                    <DateTrigger
                      label={dateState.returnMode === 'duration' ? 'Durée de séjour' : 'Retour'}
                      value={retLabel}
                      placeholder="Sélectionnez"
                      onClick={() => setShowDatePicker((v) => !v)}
                    />
                  )}
                </div>

                {showDatePicker && (
                  <KiwiDatePicker
                    tripType={tripType}
                    dateState={dateState}
                    onChange={patchDate}
                    onClose={() => setShowDatePicker(false)}
                    basePrice={299}
                  />
                )}
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Passagers</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number" min="1" max="9"
                    className="input-field pl-9"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Cabin + Search */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Classe</label>
                  <select className="input-field" value={cabin} onChange={(e) => setCabin(e.target.value)}>
                    {cabinOptions.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2 px-5 py-3 whitespace-nowrap">
                  <Search size={17} /> Rechercher
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading && <LoadingSpinner message="Recherche des meilleures offres…" />}

        {sorted && (
          <>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-slate-600 font-medium">
                {sorted.length} vol{sorted.length !== 1 ? 's' : ''} trouvé{sorted.length !== 1 ? 's' : ''}
                {nearbyMode && nearbyCity && (
                  <span className="text-slate-400"> · dans {radius} km de {nearbyCity.city}</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setFiltersOpen(!filtersOpen)}
                  className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
                >
                  <SlidersHorizontal size={15} /> Filtres
                </button>
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  {sortOptions.map((s) => (
                    <button key={s} onClick={() => setSort(s)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        sort === s ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filtersOpen && (
              <div className="bg-white rounded-2xl shadow-card p-5 mb-5">
                <h3 className="font-semibold text-slate-700 mb-3">Filtres</h3>
                <label className="text-sm text-slate-600 font-medium">
                  Escales max : {maxStops === 2 ? '2+' : maxStops}
                </label>
                <input type="range" min="0" max="2" value={maxStops}
                  onChange={(e) => setMaxStops(Number(e.target.value))}
                  className="w-full accent-brand-600 mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Direct</span><span>1 escale</span><span>2+ escales</span>
                </div>
              </div>
            )}

            {sorted.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-4xl mb-3">✈️</p>
                <p className="font-semibold text-lg">Aucun vol trouvé</p>
                <p className="text-sm mt-1">Essayez d'ajuster vos critères ou votre rayon</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sorted.map((f) => <FlightCard key={f.id} flight={f} />)}
              </div>
            )}
          </>
        )}

        {!loading && !results && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-5xl mb-4">✈️</p>
            <p className="font-medium text-lg text-slate-500">Où partez-vous ?</p>
            <p className="text-sm mt-1">
              Entrez votre origine et destination — ou activez les aéroports proches pour chercher depuis plusieurs aéroports à la fois
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
