import { Outlet, Link } from 'react-router-dom';
import { Info, Map as MapIcon, Activity } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <header className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="h-2 w-full bg-[var(--color-saffron)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--color-navy)] flex items-center justify-center">
                <span className="font-bold text-[var(--color-navy)] text-xs">UIMS</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-[var(--color-navy)] leading-tight">UIMS Portal</h1>
                <p className="text-xs text-gray-500 font-medium">Citizen Information System</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-[var(--color-navy)] font-semibold flex items-center gap-1">
                <MapIcon size={16} /> Interactive Map
              </Link>
              <Link to="/live-data" className="text-gray-700 hover:text-[var(--color-navy)] font-semibold flex items-center gap-1">
                <Activity size={16} /> Live Trackers
              </Link>
              <Link to="/policies" className="text-gray-700 hover:text-[var(--color-navy)] font-semibold flex items-center gap-1">
                <Info size={16} /> Major Policies
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow relative h-screen w-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
