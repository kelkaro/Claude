import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable autocomplete input with keyboard navigation.
 *
 * Props:
 *  value         – controlled text value
 *  onChange      – (text) => void
 *  onSelect      – (item) => void  called when user picks an option
 *  options       – array of items to search through
 *  getLabel      – (item) => string  primary search + display text
 *  renderOption  – (item, highlighted) => JSX  full option row
 *  placeholder   – string
 *  icon          – ReactNode  left icon
 *  error         – string | null  validation error message
 *  className     – extra wrapper classes
 *  minChars      – minimum chars before showing suggestions (default 1)
 */
export default function AutocompleteInput({
  value = '',
  onChange,
  onSelect,
  options = [],
  getLabel,
  renderOption,
  placeholder = 'Type to search…',
  icon,
  error,
  className = '',
  minChars = 1,
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [filtered, setFiltered] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filter options when value changes
  useEffect(() => {
    if (!value || value.length < minChars) {
      setFiltered([]);
      setOpen(false);
      return;
    }
    const q = value.toLowerCase().trim();
    const res = options
      .filter((o) => getLabel(o).toLowerCase().includes(q))
      .slice(0, 10);
    setFiltered(res);
    setOpen(res.length > 0);
    setHighlighted(-1);
  }, [value, options, getLabel, minChars]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const item = listRef.current.children[highlighted];
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  const handleKeyDown = (e) => {
    if (!open) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlighted >= 0 && filtered[highlighted]) {
          onSelect(filtered[highlighted]);
          setOpen(false);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => filtered.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className={[
            'input-field w-full',
            icon ? 'pl-9' : '',
            value ? 'pr-8' : '',
            error ? 'border-red-400 focus:ring-red-300' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {value && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl z-[100] border border-slate-100 overflow-hidden">
          <ul
            ref={listRef}
            className="max-h-60 overflow-y-auto py-1"
            role="listbox"
          >
            {filtered.map((item, i) => (
              <li key={i} role="option" aria-selected={highlighted === i}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => handleSelect(item)}
                  className={[
                    'w-full text-left px-4 py-2.5 transition-colors',
                    highlighted === i ? 'bg-brand-50' : 'hover:bg-slate-50',
                  ].join(' ')}
                >
                  {renderOption
                    ? renderOption(item, highlighted === i)
                    : <span>{getLabel(item)}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
