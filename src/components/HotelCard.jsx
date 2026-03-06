import { MapPin, Coffee, ExternalLink } from 'lucide-react';
import { formatPrice, renderStars, ratingLabel } from '../utils/formatters';
import { buildHotelUrl } from '../utils/bookingLinks';
import PriceComparisonBadge from './PriceComparisonBadge';

export default function HotelCard({ hotel, checkIn, checkOut, guests = 2, rooms = 1 }) {
  const {
    name, city, country, address, stars, rating, reviewCount,
    pricePerNight, image, amenities, tags, cancellation, breakfastIncluded,
    competitors,
  } = hotel;

  const handleBook = () => {
    const url = buildHotelUrl(hotel, checkIn, checkOut, guests, rooms);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="card overflow-hidden flex flex-col sm:flex-row">
      {/* Image — clickable */}
      <div
        className="sm:w-56 h-48 sm:h-auto flex-shrink-0 overflow-hidden cursor-pointer"
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
              <div className="flex flex-wrap gap-1.5 mb-1">
                {tags.map((tag) => (
                  <span key={tag} className="badge bg-brand-50 text-brand-700">{tag}</span>
                ))}
              </div>
              <h3
                className="font-bold text-lg text-slate-800 leading-tight hover:text-brand-600 transition-colors cursor-pointer"
                onClick={handleBook}
              >
                {name}
              </h3>
              <p className="text-amber-400 text-sm mt-0.5">{renderStars(stars)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="inline-flex items-center justify-center w-12 h-10 bg-brand-600 rounded-xl text-white font-bold text-base">
                {rating}
              </div>
              <p className="text-xs text-slate-500 mt-1">{ratingLabel(rating)}</p>
              <p className="text-xs text-slate-400">{reviewCount.toLocaleString()} avis</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1.5">
            <MapPin size={13} className="flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>
        </div>

        {/* Amenity pills */}
        <div className="flex flex-wrap gap-1.5">
          {amenities.slice(0, 5).map((a) => (
            <span key={a} className="badge bg-slate-100 text-slate-600">{a}</span>
          ))}
          {amenities.length > 5 && (
            <span className="badge bg-slate-100 text-slate-500">+{amenities.length - 5} more</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between flex-wrap gap-3 pt-1 border-t border-slate-100">
          <div className="space-y-1">
            <p className={`text-xs font-medium ${
              cancellation === 'Free cancellation' || cancellation === 'Annulation gratuite'
                ? 'text-green-600' : 'text-red-500'
            }`}>
              {cancellation}
            </p>
            {breakfastIncluded && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Coffee size={12} /> Petit-déjeuner inclus
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">{formatPrice(pricePerNight)}</p>
            <p className="text-xs text-slate-400 mb-1">par nuit</p>
            {competitors && (
              <div className="mb-2">
                <PriceComparisonBadge ourPrice={pricePerNight} competitors={competitors} />
              </div>
            )}
            <button
              onClick={handleBook}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5"
            >
              Voir l'offre <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
