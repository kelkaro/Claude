/**
 * Kiwi.com-style dual-month date picker with per-day prices,
 * range selection, flexibility buttons, and duration mode.
 *
 * Props:
 *   tripType     'round' | 'oneway'
 *   dateState    { depStart, depEnd, depFlex, returnMode, retStart, retEnd, retFlex, durationMin, durationMax }
 *   onChange     (patch) => void  – merges patch into dateState
 *   onClose      () => void
 *   basePrice    number
 */
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { getDatePrices } from '../services/flightService';

const DAY_NAMES   = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const FLEX_OPTS   = [0, 1, 3, 5];

function toIso(d) {
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function fmtDay(iso) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

export default function KiwiDatePicker({ tripType, dateState, onChange, onClose, basePrice }) {
  const { depStart, depEnd, depFlex, returnMode, retStart, retEnd, retFlex, durationMin, durationMax } = dateState;
  const todayIso = toIso(new Date());

  const [month1, setMonth1]     = useState(() => { const t = new Date(); return { y: t.getFullYear(), m: t.getMonth() }; });
  const [prices,  setPrices]    = useState({});
  const [loading, setLoading]   = useState(false);
  const [selecting, setSelecting] = useState('depStart'); // depStart | depEnd | retStart | retEnd

  // derived second month
  const month2 = { y: month1.m === 11 ? month1.y + 1 : month1.y, m: (month1.m + 1) % 12 };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const startDate = `${month1.y}-${String(month1.m + 1).padStart(2,'0')}-01`;
    getDatePrices({ basePrice: basePrice || 299, startDate, days: 62 }).then((data) => {
      if (cancelled) return;
      const map = {};
      data.forEach((p) => { map[p.date] = p.price; });
      setPrices(map);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [month1.y, month1.m, basePrice]);

  const vals = Object.values(prices);
  const minP = vals.length ? Math.min(...vals) : 0;
  const maxP = vals.length ? Math.max(...vals) : 1;

  const priceColor = (p) => {
    const r = (p - minP) / (maxP - minP + 1);
    if (r < 0.33) return 'text-green-600';
    if (r < 0.66) return 'text-amber-500';
    return 'text-red-500';
  };

  const handleDayClick = (iso) => {
    if (iso < todayIso) return;

    if (selecting === 'depStart') {
      onChange({ depStart: iso, depEnd: '', retStart: '', retEnd: '' });
      setSelecting('depEnd');

    } else if (selecting === 'depEnd') {
      if (iso <= depStart) { onChange({ depStart: iso, depEnd: '' }); return; }
      onChange({ depEnd: iso });
      if (tripType === 'round' && returnMode === 'date') setSelecting('retStart');
      else onClose();

    } else if (selecting === 'retStart') {
      const minRet = depEnd || depStart;
      if (iso < minRet) return;
      onChange({ retStart: iso, retEnd: '' });
      setSelecting('retEnd');

    } else if (selecting === 'retEnd') {
      if (iso < retStart) return;
      onChange({ retEnd: iso });
      onClose();
    }
  };

  const isInDepRange = (iso) => depStart && depEnd && iso > depStart && iso < depEnd;
  const isInRetRange = (iso) => retStart && retEnd && iso > retStart && iso < retEnd;
  const isEdge       = (iso) => iso === depStart || iso === depEnd || iso === retStart || iso === retEnd;

  const renderMonth = ({ y, m }) => {
    const firstDayJs = new Date(y, m, 1).getDay(); // 0=Sun
    const offset     = (firstDayJs + 6) % 7;       // shift to Mon=0
    const days       = new Date(y, m + 1, 0).getDate();
    const cells      = Array(offset).fill(null);
    for (let d = 1; d <= days; d++) {
      const iso = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells.push({ d, iso, price: prices[iso], past: iso < todayIso });
    }

    return (
      <div className="flex-1 min-w-0">
        <div className="text-center font-semibold text-slate-700 text-sm mb-3">
          {MONTH_NAMES[m]} {y}
        </div>
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map((n) => (
            <div key={n} className="text-center text-[10px] font-semibold text-slate-400 py-1">{n}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`e${i}`} />;
            const edge    = isEdge(cell.iso);
            const inDep   = isInDepRange(cell.iso);
            const inRet   = isInRetRange(cell.iso);
            const inRange = inDep || inRet;
            const isDepEdge = cell.iso === depStart || cell.iso === depEnd;
            const isRetEdge = cell.iso === retStart  || cell.iso === retEnd;

            let cls = 'py-1 px-0 text-center transition-all select-none ';
            if (cell.past) { cls += 'opacity-25 cursor-not-allowed'; }
            else           { cls += 'cursor-pointer '; }

            if (edge) {
              cls += 'bg-brand-600 text-white rounded-lg z-10 ';
            } else if (inRange) {
              cls += 'bg-brand-100 ';
              if (cell.iso === depStart || cell.iso === retStart) cls += 'rounded-l-lg ';
              if (cell.iso === depEnd   || cell.iso === retEnd)   cls += 'rounded-r-lg ';
            } else if (!cell.past) {
              cls += 'hover:bg-slate-100 rounded-lg ';
            }

            return (
              <div key={cell.iso} onClick={() => !cell.past && handleDayClick(cell.iso)} className={cls}>
                <div className={`text-xs font-medium ${edge ? 'text-white' : 'text-slate-700'}`}>{cell.d}</div>
                {cell.price && !loading && (
                  <div className={`text-[9px] leading-tight ${edge ? 'text-white/90' : priceColor(cell.price)}`}>
                    {cell.price}€
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const instruction = {
    depStart: 'Cliquez sur la date de départ',
    depEnd:   depStart ? 'Cliquez sur la fin de la période de départ' : 'Cliquez sur la date de départ',
    retStart: 'Cliquez sur la date de retour',
    retEnd:   retStart ? 'Cliquez sur la fin de la période de retour' : 'Cliquez sur la date de retour',
  }[selecting];

  return (
    <div
      className="absolute top-full left-0 z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5"
      style={{ width: 680, maxWidth: '95vw' }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Instruction */}
      <p className="text-center text-sm text-brand-600 font-medium mb-4">{instruction}</p>

      {/* Two-month grid */}
      <div className="flex items-start gap-1 mb-4">
        <button
          type="button"
          onClick={() => { const d = new Date(month1.y, month1.m - 1); setMonth1({ y: d.getFullYear(), m: d.getMonth() }); }}
          className="p-1.5 rounded-lg hover:bg-slate-100 mt-7 shrink-0"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {renderMonth(month1)}
          {renderMonth(month2)}
        </div>

        <button
          type="button"
          onClick={() => { const d = new Date(month1.y, month1.m + 1); setMonth1({ y: d.getFullYear(), m: d.getMonth() }); }}
          className="p-1.5 rounded-lg hover:bg-slate-100 mt-7 shrink-0"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-slate-500 mb-4">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-200 inline-block" /> Bon prix</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-200 inline-block" /> Moyen</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-200 inline-block" /> Cher</span>
        {loading && <span className="ml-auto text-slate-400 italic">Chargement des prix…</span>}
      </div>

      {/* Departure summary + flex */}
      <div className="border border-slate-200 rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Aller</span>
          <button
            type="button"
            onClick={() => setSelecting('depStart')}
            className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${['depStart','depEnd'].includes(selecting) ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:text-brand-600'}`}
          >
            Modifier
          </button>
        </div>
        <div className="text-sm font-medium text-slate-800">
          {depStart
            ? <>{fmtDay(depStart)}{depEnd && depEnd !== depStart ? <span className="text-slate-400"> — </span> : ''}{depEnd && depEnd !== depStart ? fmtDay(depEnd) : ''}</>
            : <span className="text-slate-400">Non sélectionné</span>
          }
        </div>
        {depStart && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-[11px] text-slate-400 mr-1">Flexibilité :</span>
            {FLEX_OPTS.map((f) => (
              <button
                key={f} type="button"
                onClick={() => onChange({ depFlex: f })}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium border transition-all ${
                  depFlex === f ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600 hover:border-brand-300'
                }`}
              >
                {f === 0 ? 'Exact' : `±${f}j`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Return section */}
      {tripType === 'round' && (
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Retour</span>
            <div className="flex items-center gap-2">
              {/* Mode toggle */}
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                {['date', 'duration'].map((mode) => (
                  <button
                    key={mode} type="button"
                    onClick={() => onChange({ returnMode: mode })}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all ${returnMode === mode ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
                  >
                    {mode === 'date' ? 'Date' : 'Durée'}
                  </button>
                ))}
              </div>
              {returnMode === 'date' && (
                <button
                  type="button"
                  onClick={() => setSelecting('retStart')}
                  className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${['retStart','retEnd'].includes(selecting) ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:text-brand-600'}`}
                >
                  Modifier
                </button>
              )}
            </div>
          </div>

          {returnMode === 'date' ? (
            <>
              <div className="text-sm font-medium text-slate-800">
                {retStart
                  ? <>{fmtDay(retStart)}{retEnd && retEnd !== retStart ? <span className="text-slate-400"> — </span> : ''}{retEnd && retEnd !== retStart ? fmtDay(retEnd) : ''}</>
                  : <span className="text-slate-400">Non sélectionné</span>
                }
              </div>
              {retStart && (
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 mr-1">Flexibilité :</span>
                  {FLEX_OPTS.map((f) => (
                    <button
                      key={f} type="button"
                      onClick={() => onChange({ retFlex: f })}
                      className={`px-2 py-0.5 rounded-lg text-xs font-medium border transition-all ${
                        retFlex === f ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600 hover:border-brand-300'
                      }`}
                    >
                      {f === 0 ? 'Exact' : `±${f}j`}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Duration mode */
            <div>
              <div className="text-sm font-medium text-slate-800 mb-3">
                Séjour de <span className="text-brand-600">{durationMin}</span> à <span className="text-brand-600">{durationMax}</span> nuits
              </div>
              <div className="px-2 space-y-2">
                <div className="relative flex items-center h-5">
                  <input
                    type="range" min="1" max="31" value={durationMin}
                    onChange={(e) => { const v = Math.min(Number(e.target.value), durationMax - 1); onChange({ durationMin: Math.max(1, v) }); }}
                    className="absolute inset-0 w-full accent-brand-600 cursor-pointer"
                    style={{ zIndex: durationMin > 20 ? 5 : 3 }}
                  />
                  <input
                    type="range" min="1" max="31" value={durationMax}
                    onChange={(e) => { const v = Math.max(Number(e.target.value), durationMin + 1); onChange({ durationMax: Math.min(31, v) }); }}
                    className="absolute inset-0 w-full accent-brand-600 cursor-pointer"
                    style={{ zIndex: 4 }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 nuit</span><span>31 nuits</span>
                </div>
                <div className="flex gap-1.5 flex-wrap mt-1">
                  {[[7,'1 sem.'],[14,'2 sem.'],[21,'3 sem.']].map(([n, label]) => (
                    <button
                      key={n} type="button"
                      onClick={() => onChange({ durationMin: n, durationMax: n })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        durationMin === n && durationMax === n ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600 hover:border-brand-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="button" onClick={onClose}
          className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <Check size={14} /> Confirmer
        </button>
      </div>
    </div>
  );
}
