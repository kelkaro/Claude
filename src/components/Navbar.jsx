import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Hotel, Car, Menu, X, Globe, Package } from 'lucide-react';

const navLinks = [
  { to: '/flights',      label: 'Flights',         icon: Plane    },
  { to: '/hotels',       label: 'Hotels',           icon: Hotel    },
  { to: '/cars',         label: 'Car Rental',       icon: Car      },
  { to: '/flight-hotel', label: 'Flights + Hotels', icon: Package  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-brand-700 transition-colors">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              Travel<span className="text-brand-600">Deal</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(to + '/');
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors px-3 py-2">
              Sign in
            </button>
            <button className="btn-primary text-sm py-2 px-4">Sign up</button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button className="flex-1 btn-secondary text-sm py-2">Sign in</button>
            <button className="flex-1 btn-primary text-sm py-2">Sign up</button>
          </div>
        </div>
      )}
    </nav>
  );
}
