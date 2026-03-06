import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Globe size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Travel<span className="text-brand-400">Deal</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Your all-in-one travel platform for flights, hotels and car rentals at the best prices.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Travel</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/flights" className="hover:text-white transition-colors">Search Flights</Link></li>
              <li><Link to="/hotels" className="hover:text-white transition-colors">Find Hotels</Link></li>
              <li><Link to="/cars" className="hover:text-white transition-colors">Rent a Car</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} TravelDeal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
