import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane, Hotel, Car, Package, ArrowRight, Shield, Clock, CreditCard, Headphones,
  TrendingDown,
} from 'lucide-react';
import { popularRoutes } from '../data/flights';
import { featuredDestinations } from '../data/hotels';

const tabConfig = [
  { id: 'flights',      label: 'Flights',         icon: Plane,    color: 'brand',   to: '/flights' },
  { id: 'hotels',       label: 'Hotels',           icon: Hotel,    color: 'violet',  to: '/hotels' },
  { id: 'cars',         label: 'Cars',             icon: Car,      color: 'emerald', to: '/cars' },
  { id: 'bundle',       label: 'Flights + Hotels', icon: Package,  color: 'purple',  to: '/flight-hotel' },
];

const trustPillars = [
  { icon: Shield,      title: 'Safe & Secure',          desc: "Your data is always protected with bank-level encryption." },
  { icon: Clock,       title: 'Best Price Guarantee',   desc: "Found it cheaper? We'll match the price, no questions asked." },
  { icon: CreditCard,  title: 'Flexible Payment',       desc: 'Pay now or later — multiple currencies accepted.' },
  { icon: Headphones,  title: '24/7 Support',           desc: 'Our travel experts are always here when you need them.' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('flights');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-700 to-violet-700 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2 text-sm font-medium mb-6">
              <TrendingDown size={15} className="text-green-300" />
              Prices dropping on 500+ routes this week
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Your next adventure<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-violet-300">
                starts here
              </span>
            </h1>
            <p className="text-brand-100 text-lg sm:text-xl max-w-xl">
              Compare flights, hotels and car rentals all in one place. No hidden fees. Best price guaranteed.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 mt-8 text-sm">
            {[['500+','Airlines'],['1M+','Hotels'],['50+','Car companies'],['190','Countries']].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold">{n}</p>
                <p className="text-brand-200">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quick Search Card ─── */}
      <section className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {tabConfig.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all whitespace-nowrap px-3 ${
                  activeTab === id
                    ? 'text-brand-600 border-b-2 border-brand-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'flights' && <FlightQuickSearch navigate={navigate} />}
            {activeTab === 'hotels'  && <HotelQuickSearch  navigate={navigate} />}
            {activeTab === 'cars'    && <CarQuickSearch    navigate={navigate} />}
            {activeTab === 'bundle'  && <BundleQuickSearch navigate={navigate} />}
          </div>
        </div>
      </section>

      {/* ─── Featured Destinations ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Featured Destinations</h2>
            <p className="text-slate-500 text-sm mt-1">Hand-picked places with great hotel deals</p>
          </div>
          <button
            onClick={() => navigate('/hotels')}
            className="flex items-center gap-1 text-brand-600 font-medium text-sm hover:gap-2 transition-all"
          >
            View all <ArrowRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredDestinations.slice(0, 4).map((d) => (
            <button
              key={d.city}
              onClick={() => navigate('/hotels')}
              className="group relative rounded-2xl overflow-hidden h-48 sm:h-56 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <img src={d.image} alt={d.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
                <p className="font-bold text-lg leading-tight">{d.city}</p>
                <p className="text-white/80 text-sm">{d.country}</p>
                <p className="text-green-300 text-xs mt-1 font-medium">Hôtels dès {d.hotelsFrom} €/nuit</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Popular Flight Routes ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Popular Flight Routes</h2>
            <p className="text-slate-500 text-sm mt-1">Best fares on trending routes</p>
          </div>
          <button
            onClick={() => navigate('/flights')}
            className="flex items-center gap-1 text-brand-600 font-medium text-sm hover:gap-2 transition-all"
          >
            Search flights <ArrowRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((r) => (
            <button
              key={`${r.from}-${r.to}`}
              onClick={() => navigate('/flights')}
              className="card p-5 text-left hover:border hover:border-brand-200 group"
            >
              <div className="text-2xl mb-3">{r.flag}</div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1">
                <span>{r.from}</span>
                <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                <span>{r.to}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">
                dès <span className="text-brand-600">{r.price} €</span>
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Trust Pillars ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-20">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">Why TravelDeal?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── Quick search sub-forms ── */

function FlightQuickSearch({ navigate }) {
  const [from, setFrom] = useState('');
  const [to,   setTo]   = useState('');
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">From</label>
        <input className="input-field" placeholder="e.g. Brussels" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">To</label>
        <input className="input-field" placeholder="e.g. Marrakech" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <button onClick={() => navigate('/flights')} className="btn-primary flex items-center gap-2 whitespace-nowrap py-3">
        <Plane size={16} /> Search
      </button>
    </div>
  );
}

function HotelQuickSearch({ navigate }) {
  const [city, setCity] = useState('');
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Destination</label>
        <input className="input-field" placeholder="e.g. Paris" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Check-in</label>
        <input type="date" className="input-field" />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Check-out</label>
        <input type="date" className="input-field" />
      </div>
      <button onClick={() => navigate('/hotels')} className="btn-primary flex items-center gap-2 whitespace-nowrap py-3" style={{ background: '#7c3aed' }}>
        <Hotel size={16} /> Search
      </button>
    </div>
  );
}

function CarQuickSearch({ navigate }) {
  const [city, setCity] = useState('');
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Pickup Location</label>
        <input className="input-field" placeholder="e.g. London" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Pickup Date</label>
        <input type="date" className="input-field" />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Return Date</label>
        <input type="date" className="input-field" />
      </div>
      <button onClick={() => navigate('/cars')} className="btn-primary flex items-center gap-2 whitespace-nowrap py-3" style={{ background: '#059669' }}>
        <Car size={16} /> Search
      </button>
    </div>
  );
}

function BundleQuickSearch({ navigate }) {
  const [from, setFrom] = useState('');
  const [to,   setTo]   = useState('');
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Flying from</label>
        <input className="input-field" placeholder="e.g. Brussels" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Flying to / Hotel city</label>
        <input className="input-field" placeholder="e.g. Marrakech" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Departure</label>
        <input type="date" className="input-field" />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Return</label>
        <input type="date" className="input-field" />
      </div>
      <button
        onClick={() => navigate('/flight-hotel')}
        className="btn-primary flex items-center gap-2 whitespace-nowrap py-3"
        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
      >
        <Package size={16} /> Bundle
      </button>
    </div>
  );
}
