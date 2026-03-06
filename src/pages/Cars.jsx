import { useState } from 'react';
import { Calendar, Car, Search, SlidersHorizontal, Clock, MapPin } from 'lucide-react';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AutocompleteInput from '../components/AutocompleteInput';
import { searchCars } from '../services/carService';
import { carCategories } from '../data/cars';
import { cities } from '../data/cities';

const sortOptions = ['Price', 'Category'];

export default function Cars() {
  const [cityText,    setCityText]    = useState('');
  const [cityObj,     setCityObj]     = useState(null);
  const [pickupDate,  setPickupDate]  = useState('');
  const [pickupTime,  setPickupTime]  = useState('10:00');
  const [returnDate,  setReturnDate]  = useState('');
  const [returnTime,  setReturnTime]  = useState('10:00');
  const [category,    setCategory]    = useState('Any');

  const [results,     setResults]     = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [sort,        setSort]        = useState('Price');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice,    setMaxPrice]    = useState(200);
  const [transmission,setTransmission]= useState('Any');
  const [errors,      setErrors]      = useState({});

  const cityOptions = cities.map((c) => ({ ...c, label: `${c.city}, ${c.country}` }));

  const validate = () => {
    const e = {};
    if (!cityText.trim()) e.city = 'Please enter a pickup location';
    if (!pickupDate)      e.pickupDate = 'Please select a pickup date';
    if (!returnDate)      e.returnDate = 'Please select a return date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const runSearch = async (params) => {
    setLoading(true);
    setResults(null);
    const data = await searchCars(params);
    setResults(data);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    runSearch({ city: cityObj?.city || cityText, category, maxPrice });
  };

  const handleCategorySearch = (cat) => {
    setCategory(cat);
    setErrors({});
    runSearch({ category: cat, maxPrice });
  };

  const sorted = results
    ? [...results]
        .filter((c) => transmission === 'Any' ? true : c.transmission === transmission)
        .sort((a, b) => {
          if (sort === 'Price') return a.pricePerDay - b.pricePerDay;
          return a.category.localeCompare(b.category);
        })
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 pt-10 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-1">Car Rental</h1>
          <p className="text-emerald-200 mb-8">Hire a car at hundreds of destinations worldwide</p>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-4">

            {/* Row 1: Location + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Pickup location</label>
                <AutocompleteInput
                  value={cityText}
                  onChange={setCityText}
                  onSelect={(c) => { setCityObj(c); setCityText(c.label); }}
                  options={cityOptions}
                  getLabel={(c) => c.label}
                  placeholder="City or airport"
                  icon={<MapPin size={16} className="text-slate-400" />}
                  error={errors.city}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Car type</label>
                <div className="relative">
                  <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    className="input-field pl-9"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Any">Any type</option>
                    {carCategories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Dates + Times */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Pickup date</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className={`input-field pl-9 ${errors.pickupDate ? 'border-red-400' : ''}`}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Pickup time</label>
                <div className="relative">
                  <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    className="input-field pl-9"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Return date</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className={`input-field pl-9 ${errors.returnDate ? 'border-red-400' : ''}`}
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
                {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Return time</label>
                <div className="relative">
                  <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    className="input-field pl-9"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 py-2.5 px-8 text-sm font-semibold rounded-xl text-white transition-colors"
                style={{ background: '#059669' }}
              >
                <Search size={17} /> Search Cars
              </button>
            </div>
          </form>

          {/* Category quick pick */}
          {!results && !loading && (
            <div className="mt-8">
              <p className="text-emerald-200 text-sm font-medium mb-3">Browse by category</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {carCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategorySearch(cat.name)}
                    className="bg-white/15 hover:bg-white/25 text-white rounded-xl p-4 text-left transition-all backdrop-blur"
                  >
                    <p className="text-2xl mb-1">{cat.icon}</p>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-xs text-emerald-200">{cat.description}</p>
                    <p className="text-xs text-white/70 mt-1">dès {cat.from} €/jour</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading && <LoadingSpinner message="Finding available cars…" />}

        {sorted && (
          <>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-slate-600 font-medium">
                {sorted.length} car{sorted.length !== 1 ? 's' : ''} available
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
                        sort === s ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filtersOpen && (
              <div className="bg-white rounded-2xl shadow-card p-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">Max price per day</h3>
                  <input
                    type="range" min="20" max="200" step="5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>20 €</span>
                    <span className="font-semibold text-emerald-700">Jusqu'à {maxPrice} €/jour</span>
                    <span>200 €+</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">Transmission</h3>
                  <div className="flex gap-2">
                    {['Any','Automatic','Manual'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTransmission(t)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          transmission === t
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {sorted.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-4xl mb-3">🚗</p>
                <p className="font-semibold text-lg">No cars found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sorted.map((c) => <CarCard key={c.id} car={c} pickupDate={pickupDate} returnDate={returnDate} />)}
              </div>
            )}
          </>
        )}

        {!loading && !results && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-5xl mb-4">🚗</p>
            <p className="font-medium text-lg text-slate-500">Ready to hit the road?</p>
            <p className="text-sm mt-1">Search for cars above or browse by category</p>
          </div>
        )}
      </div>
    </div>
  );
}
