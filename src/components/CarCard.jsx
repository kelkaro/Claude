import { Users, Briefcase, DoorOpen, Settings, MapPin, ExternalLink } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { buildCarUrl } from '../utils/bookingLinks';
import PriceComparisonBadge from './PriceComparisonBadge';

export default function CarCard({ car, pickupDate, returnDate }) {
  const {
    company, name, category, seats, bags, doors, transmission,
    airConditioning, pricePerDay, location, image, features,
    cancellation, mileage, minAge, competitors,
  } = car;

  const handleBook = () => {
    const url = buildCarUrl(car, pickupDate, returnDate);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="card overflow-hidden flex flex-col sm:flex-row">
      {/* Image — clickable */}
      <div
        className="sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer"
        onClick={handleBook}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="badge bg-brand-50 text-brand-700 mb-1">{category}</span>
              <h3
                className="font-bold text-lg text-slate-800 hover:text-brand-600 transition-colors cursor-pointer"
                onClick={handleBook}
              >
                {name}
              </h3>
              <p className="text-sm text-slate-500">{company}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-2">
            <MapPin size={13} />
            <span>{location}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Users size={14} />,     label: `${seats} Sièges` },
            { icon: <Briefcase size={14} />, label: `${bags} Valises` },
            { icon: <DoorOpen size={14} />,  label: `${doors} Portes` },
            { icon: <Settings size={14} />,  label: transmission },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 rounded-lg px-2 py-1.5">
              <span className="text-slate-400">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5">
          {features.map((f) => <span key={f} className="badge bg-slate-100 text-slate-600">{f}</span>)}
          {airConditioning && <span className="badge bg-slate-100 text-slate-600">A/C</span>}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between flex-wrap gap-3 pt-1 border-t border-slate-100">
          <div className="space-y-1 text-xs text-slate-500">
            <p className={`font-medium ${
              cancellation === 'Annulation gratuite' || cancellation === 'Free cancellation'
                ? 'text-green-600' : 'text-red-500'
            }`}>
              {cancellation}
            </p>
            <p>{mileage} · Min. {minAge} ans</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">{formatPrice(pricePerDay)}</p>
            <p className="text-xs text-slate-400 mb-1">par jour</p>
            {competitors && (
              <div className="mb-2">
                <PriceComparisonBadge ourPrice={pricePerDay} competitors={competitors} />
              </div>
            )}
            <button
              onClick={handleBook}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5"
            >
              Réserver <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
