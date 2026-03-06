import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Cars from './pages/Cars';
import FlightHotel from './pages/FlightHotel';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/flights"       element={<Flights />} />
            <Route path="/hotels"        element={<Hotels />} />
            <Route path="/cars"          element={<Cars />} />
            <Route path="/flight-hotel"  element={<FlightHotel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
