import { useState } from 'react';
import { TrendingDown, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

/**
 * Shows our price vs competitor prices.
 * Competitor rows are clickable links to the partner site.
 *
 * Props:
 *  ourPrice    – number (our best price)
 *  competitors – array of { platform: string, price: number, url?: string }
 */
export default function PriceComparisonBadge({ ourPrice, competitors = [] }) {
  const [expanded, setExpanded] = useState(false);

  if (!competitors.length) return null;

  const highestCompetitor = Math.max(...competitors.map((c) => c.price));
  const savings = highestCompetitor - ourPrice;
  const cheapestCompetitor = Math.min(...competitors.map((c) => c.price));
  const weCheaper = ourPrice <= cheapestCompetitor;

  return (
    <div className="mt-2">
      {/* Summary line */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {weCheaper && savings > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 rounded-full px-2 py-0.5">
            <TrendingDown size={11} />
            Save {formatPrice(savings)} vs competitors
          </span>
        ) : (
          <span className="text-xs text-slate-400">Price comparison</span>
        )}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-0.5 text-xs text-brand-500 hover:text-brand-700 font-medium transition-colors"
        >
          {expanded ? <>Hide <ChevronUp size={12} /></> : <>Compare <ChevronDown size={12} /></>}
        </button>
      </div>

      {/* Expanded comparison table */}
      {expanded && (
        <div className="mt-2 rounded-lg border border-slate-100 overflow-hidden text-xs">
          {/* Our price row */}
          <div className="flex items-center justify-between px-3 py-2 bg-green-50 border-b border-slate-100">
            <span className="font-semibold text-green-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              TravelDeal
            </span>
            <span className="font-bold text-green-700">{formatPrice(ourPrice)}</span>
          </div>

          {/* Competitor rows — clickable links */}
          {[...competitors]
            .sort((a, b) => a.price - b.price)
            .map((c) => {
              const row = (
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-50 last:border-0">
                  <span className="text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                    {c.platform}
                    <ExternalLink size={10} className="text-slate-400" />
                  </span>
                  <span className={c.price > ourPrice ? 'text-slate-400 line-through' : 'text-slate-600 font-medium'}>
                    {formatPrice(c.price)}
                  </span>
                </div>
              );

              return c.url ? (
                <a
                  key={c.platform}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {row}
                </a>
              ) : (
                <div key={c.platform}>{row}</div>
              );
            })}
        </div>
      )}
    </div>
  );
}
