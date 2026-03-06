import { useState } from 'react';
import { Users, Calendar, Search, SlidersHorizontal, Star } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AutocompleteInput from '../components/AutocompleteInput';
import { searchHotels } from '../services/hotelService';
import { featuredDestinations } from '../data/hotels';
import { cities } from '../data/cities';
import { MapPin } from 'lucide-react';

const sortOptions = ['Price', 'Rating', 'Stars'];

export default function Hotels() {
  const [cityText,   setCityText]   = useState('');
  const [cityObj,    setCityObj]    = useState(null);
  const [checkIn,    setCheckIn]    = useState('');
  const [checkOut,   setCheckOut]   = useState('');
  const [guests,     setGuests]     = useState(2);
  const [rooms,      setRooms]      = useState(1);
  const [minStars,   setMinStars]   = useState(0);

  const [results,    setResults]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [sort,       setSort]       = useState('Rating');
  const [filtersOpen,setFiltersOpen]= useState(false);
  const [maxPrice,   setMaxPrice]   = useState(600);
  const [errors,     setErrors]     = useState({});

  const cityOptions = cities.map((c) => ({ ...c, label: `${c.city}, ${c.country}` }));

  const validate = () => {
    const e = {};
    if (!cityText.trim()) e.city = 'Please enter a destination';
    if (!checkIn)  e.checkIn  = 'Please select a check-in date';
    if (!checkOut) e.checkOut = 'Please select a check-out date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const runSearch = async (params) => {
    setLoading(true);
    setResults(null);
    const data = await searchHotels(params);
    setResults(data);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    runSearch({ city: cityObj?.city || cityText, minStars, maxPrice });
  };

  const handleQuickSearch = (city) => {
    setCityText(city);
    setCityObj(null);
    setErrors({});
    runSearch({ city, minStars, maxPrice });
  };

  const sorted = results
    ? [...results].sort((a, b) => {
        if (sort === 'Price')  return a.pricePerNight - b.pricePerNight;
        if (sort === 'Rating') return b.rating - a.rating;
        return b.stars - a.stars;
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700 pt-10 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-1">Find Hotels</h1>
          <p className="text-violet-200 mb-8">Compare thousands of hotels worldwide</p>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

              {/* Destination autocomplete */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Destination</label>
                <AutocompleteInput
                  value={cityText}
                  onChange={setCityText}
                  onSelect={(c) => { setCityObj(c); setCityText(c.label); }}
                  options={cityOptions}
                  getLabel={(c) => c.label}
                  placeholder="City or region"
                  icon={<MapPin size={16} className="text-slate-400" />}
                  error={errors.city}
                />
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Check-in</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className={`input-field pl-9 ${errors.checkIn ? 'border-red-400' : ''}`}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Check-out</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className={`input-field pl-9 ${errors.checkOut ? 'border-red-400' : ''}`}
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
              </div>

              {/* Guests + Rooms */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Guests & Rooms</label>
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Users size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number" min="1" max="20"
                      className="input-field pl-8"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    />
                  </div>
                  <select
                    className="input-field flex-1"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                  >
                    {[1,2,3,4,5].map((n) => (
                      <option key={n} value={n}>{n} room{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stars filter + submit */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-slate-500 font-medium">Min. stars:</span>
              {[0, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setMinStars(s)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    minStars === s
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {s === 0 ? 'Any' : (
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: s }).map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                  )}
                </button>
              ))}
              <button
                type="submit"
                className="ml-auto flex items-center gap-2 py-2.5 px-6 text-sm font-semibold rounded-xl text-white transition-colors"
                style={{ background: '#7c3aed' }}
              >
                <Search size={17} /> Search Hotels
              </button>
            </div>
          </form>

          {/* Popular destinations */}
          {!results && !loading && (
            <div className="mt-8">
              <p className="text-violet-200 text-sm font-medium mb-3">Popular destinations</p>
              <div className="flex gap-3 flex-wrap">
                {featuredDestinations.map((d) => (
                  <button
                    key={d.city}
                    onClick={() => handleQuickSearch(d.city)}
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all backdrop-blur"
                  >
                    <span>{d.emoji}</span>
                    {d.city}
                    <span className="text-violet-200 text-xs">dès {d.hotelsFrom} €</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading && <LoadingSpinner message="Searching for hotels…" />}

        {sorted && (
          <>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-slate-600 font-medium">
                {sorted.length} hotel{sorted.length !== 1 ? 's' : ''} found
                {cityText && <span className="text-slate-400"> in {cityText}</span>}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
                >
                  <SlidersHorizontal size={15} /> Filters
                </button>
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  {sortOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSort(s)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        sort === s ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'
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
                <h3 className="font-semibold text-slate-700 mb-3">Price per night</h3>
                <input
                  type="range" min="50" max="600" step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>50 €</span>
                  <span className="font-semibold text-violet-700">Jusqu'à {maxPrice} €</span>
                  <span>600 €+</span>
                </div>
              </div>
            )}

            {sorted.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-4xl mb-3">🏨</p>
                <p className="font-semibold text-lg">No hotels found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sorted.map((h) => <HotelCard key={h.id} hotel={h} checkIn={checkIn} checkOut={checkOut} guests={guests} rooms={rooms} />)}
              </div>
            )}
          </>
        )}

        {!loading && !results && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-5xl mb-4">🏨</p>
            <p className="font-medium text-lg text-slate-500">Find your perfect stay</p>
            <p className="text-sm mt-1">Search by city or pick a popular destination above</p>
          </div>
        )}
      </div>
    </div>
  );
}
