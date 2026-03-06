import { Wifi, UtensilsCrossed, Monitor, Star, ExternalLink } from 'lucide-react';
import { formatPrice, formatTime, formatDate } from '../utils/formatters';
import { buildFlightUrl } from '../utils/bookingLinks';
import PriceComparisonBadge from './PriceComparisonBadge';

const amenityIcons = {
  WiFi: <Wifi size={13} />,
  Meals: <UtensilsCrossed size={13} />,
  Entertainment: <Monitor size={13} />,
  Lounge: <Star size={13} />,
};

export default function FlightCard({ flight }) {
  const {
    airline, from, to, departure, arrival, duration,
    stops, stopCity, price, seatsLeft, amenities, class: cabin,
    competitors,
  } = flight;

  // Build a deep link to the exact flight/date on the airline or Skyscanner
  const handleBook = () => {
    const url = buildFlightUrl(flight);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleBook}
    >
      {/* Airline */}
      <div className="flex items-center gap-3 min-w-[140px]">
        <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-xl">✈</div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{airline}</p>
          <span className={`badge text-xs mt-0.5 ${
            cabin === 'Business' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {cabin}
          </span>
        </div>
      </div>

      {/* Route & times */}
      <div className="flex-1 flex items-center gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800">{formatTime(departure)}</p>
          <p className="text-sm font-semibold text-slate-600">{from.code}</p>
          <p className="text-xs text-slate-400">{formatDate(departure)}</p>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <p className="text-xs text-slate-400">{duration}</p>
          <div className="relative w-full flex items-center">
            <div className="flex-1 h-px bg-slate-200" />
            {stops > 0 ? (
              <div className="flex gap-1 mx-2">
                {Array.from({ length: stops }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-slate-300" />
                ))}
              </div>
            ) : (
              <div className="mx-2 text-brand-500">✈</div>
            )}
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <p className="text-xs text-slate-500">
            {stops === 0 ? 'Direct' : `${stops} escale${stops > 1 ? 's' : ''}${stopCity ? ` · ${stopCity}` : ''}`}
          </p>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800">{formatTime(arrival)}</p>
          <p className="text-sm font-semibold text-slate-600">{to.code}</p>
          <p className="text-xs text-slate-400">{formatDate(arrival)}</p>
        </div>
      </div>

      {/* Amenities */}
      <div className="hidden lg:flex items-center gap-2 min-w-[120px]">
        {amenities.map((a) => (
          <span key={a} title={a} className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
            {amenityIcons[a] ?? a[0]}
          </span>
        ))}
      </div>

      {/* Price & CTA — stop propagation so badge clicks don't trigger booking */}
      <div className="text-right min-w-[140px]" onClick={(e) => e.stopPropagation()}>
        <p className="text-2xl font-bold text-slate-800">{formatPrice(price)}</p>
        <p className="text-xs text-slate-400 mb-1">par personne</p>
        {competitors && (
          <div className="mb-2">
            <PriceComparisonBadge ourPrice={price} competitors={competitors} />
          </div>
        )}
        {seatsLeft <= 5 && (
          <p className="text-xs text-accent-600 font-medium mb-2">Plus que {seatsLeft} places !</p>
        )}
        <button
          onClick={handleBook}
          className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-1.5"
        >
          Sélectionner <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
}
