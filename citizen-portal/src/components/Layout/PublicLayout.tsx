import { Outlet, Link } from 'react-router-dom';
import { Info, Map as MapIcon, Activity, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PublicLayout() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <header className="absolute top-0 left-0 right-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-slate-800 transition-colors">
        <div className="h-2 w-full bg-[var(--color-saffron)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--color-navy)] flex items-center justify-center">
                <span className="font-bold text-[var(--color-navy)] text-xs">UIMS</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-[var(--color-navy)] dark:text-blue-400 leading-tight">UIMS Portal</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Citizen Information System</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-navy)] dark:hover:text-blue-400 font-semibold flex items-center gap-1 transition-colors">
                <MapIcon size={16} /> Interactive Map
              </Link>
              <Link to="/live-data" className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-navy)] dark:hover:text-blue-400 font-semibold flex items-center gap-1 transition-colors">
                <Activity size={16} /> Live Trackers
              </Link>
              <Link to="/policies" className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-navy)] dark:hover:text-blue-400 font-semibold flex items-center gap-1 transition-colors">
                <Info size={16} /> Major Policies
              </Link>
              <Link to="/raise-complaint" className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-md transition-colors text-sm">
                <AlertTriangle size={16} /> Raise Complaint
              </Link>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="text-gray-500 dark:text-gray-400 hover:text-[var(--color-navy)] dark:hover:text-blue-400 p-2 rounded-full transition-colors ml-2"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
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
