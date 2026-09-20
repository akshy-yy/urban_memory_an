import { Outlet, Link } from 'react-router-dom';
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
      <header className="absolute top-0 left-0 right-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="h-1.5 w-full bg-amber-600"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center shadow-xs">
                <span className="font-extrabold text-white text-xs">UIMS</span>
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-tight">UIMS Portal</h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Citizen Information System</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-5">
              <Link to="/" className="text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-xs transition-colors">
                Interactive Map
              </Link>
              <Link to="/live-data" className="text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-xs transition-colors">
                Live Trackers
              </Link>
              <Link to="/policies" className="text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-xs transition-colors">
                Major Policies
              </Link>
              <Link to="/traffic-insights" className="text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-xs transition-colors">
                Traffic Insights
              </Link>
              <Link to="/raise-complaint" className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg font-semibold shadow-xs transition-colors text-xs">
                Raise Complaint
              </Link>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors ml-1"
                title="Toggle Theme"
              >
                {isDark ? 'Light' : 'Dark'}
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
