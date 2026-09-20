import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GovLanding() {
  const { isAuthenticated, user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate interpolation values based on scroll (0 to 300px)
  const progress = Math.min(1, Math.max(0, scrollY / 280));

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'ROLE_ADMIN') return '/admin';
    if (user?.role === 'ROLE_DEPARTMENT') return '/department';
    return '/citizen';
  };

  return (
    <div className="relative min-h-screen font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden bg-slate-950">
      
      {/* Satellite Map Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80')`,
            filter: 'brightness(0.4) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-slate-950/80" />
      </div>

      {/* FLOATING STICKY HEADER BADGE */}
      <div 
        className="fixed top-3 left-4 sm:left-8 z-40 transition-all duration-300 pointer-events-none"
        style={{
          opacity: progress > 0.8 ? 1 : 0,
          transform: `translateY(${progress > 0.8 ? 0 : -20}px)`,
        }}
      >
        <div className="flex items-center gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 pointer-events-auto">
          <div className="w-8 h-8 rounded-md bg-blue-900 text-white font-bold text-base flex items-center justify-center">
            U
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-none">UIMS</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Urban Infrastructure Memory System</div>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pt-16">
        
        <div 
          className="transition-all duration-700 ease-out flex flex-col items-center"
          style={{
            transform: `translateY(${progress * -80}px) scale(${1 - progress * 0.2})`,
            opacity: 1 - progress * 1.2 > 0 ? 1 - progress * 1.2 : 0,
            pointerEvents: progress > 0.7 ? 'none' : 'auto'
          }}
        >
          {/* Official Crest Badge */}
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
              <span className="text-3xl sm:text-4xl font-black text-blue-400">
                UIMS
              </span>
            </div>
          </div>

          <div className="inline-block px-3.5 py-1 rounded-md bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
            National Infrastructure Coordination Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            Urban Infrastructure <span className="text-blue-400">Memory System</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Eliminating repetitive road excavation through unified spatial memory, real-time cross-department synchronization, and automated conflict mitigation.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link 
              to={getDashboardLink()}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center gap-2"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Official Sign In'}</span>
            </Link>

            <a 
              href="http://localhost:5174" 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-sm transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Citizen Public Portal</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 flex flex-col items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider transition-opacity duration-300 animate-bounce"
          style={{ opacity: Math.max(0, 1 - progress * 2) }}
        >
          <span>Scroll To Explore</span>
        </div>
      </section>

      {/* MAIN INFORMATIVE CONTENT */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* SECTION 1: WHAT IS UIMS? */}
        <div className="bg-slate-900/90 rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs tracking-wider uppercase mb-2">
              Unified Civil Engineering Memory
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
              What is the Urban Infrastructure Memory System?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              In modern cities, public works suffer from a lack of temporal and spatial coordination. PWD paves a new asphalt road, and weeks later, the Water Board or Telecom excavation teams dig trenches, destroying tax-payer funded infrastructure.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              <strong className="text-blue-400">UIMS</strong> is a state-grade digital ledger and GIS intelligence backbone that records every excavation, underground asset coordinate, pavement warranty, and department proposal. It automatically detects cross-agency conflicts before a single shovel touches the ground.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
              <div className="text-2xl font-bold text-blue-400 mb-1">94%</div>
              <div className="text-xs font-semibold text-slate-200">Excavation Conflict Reduction</div>
              <p className="text-[11px] text-slate-400 mt-1">Pre-emptive clash prevention across municipal utilities.</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
              <div className="text-2xl font-bold text-emerald-400 mb-1">5-Year</div>
              <div className="text-xs font-semibold text-slate-200">Road Quality Retention</div>
              <p className="text-[11px] text-slate-400 mt-1">Automated defect liability & contractor warranty enforcement.</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5">
              <div className="text-2xl font-bold text-amber-400 mb-1">Live</div>
              <div className="text-xs font-semibold text-slate-200">Citizen Priority Routing</div>
              <p className="text-[11px] text-slate-400 mt-1">Direct grievance dispatch ranked 1-10 on urgency.</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: HOW UIMS SOLVES MUNICIPAL CONFLICTS */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Core Capabilities & Architecture
            </h2>
            <p className="text-slate-400 text-sm">
              Engineered with advanced geospatial analytics and real-time synchronization pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-sm">
              <h3 className="text-base font-bold text-white mb-2">Spatial De-confliction</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When an agency proposes a road excavation, UIMS cross-checks GIS coordinates against active warranties and other upcoming projects.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-sm">
              <h3 className="text-base font-bold text-white mb-2">Temporal Synchronization</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unifies timelines for Water, Electricity, and PWD so all underground works complete before surface asphalt is laid.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-sm">
              <h3 className="text-base font-bold text-white mb-2">Automated Memory Log</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Retains full digital history of asphalt depth, subsoil moisture, utility pipeline placements, and contractor responsibility.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-sm">
              <h3 className="text-base font-bold text-white mb-2">Grievance Prioritization</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Citizen complaints are ranked with priority levels (1-10) and dispatched directly to the responsible division's dashboard.
              </p>
            </div>

          </div>
        </div>

        {/* SECTION 3: INTERACTIVE STAKEHOLDERS MATRIX */}
        <div className="bg-slate-900/90 rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Cross-Department Interoperability
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Synchronizing state, municipal, and private utility divisions under a single truth system.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 text-center">
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
              <div className="font-bold text-white text-xs">Public Works (PWD)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Surface & Arterial Roads</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
              <div className="font-bold text-white text-xs">Water Supply (BWSSB)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Underground Pipelines</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
              <div className="font-bold text-white text-xs">Electricity Board</div>
              <div className="text-[11px] text-slate-400 mt-0.5">High Tension Conduits</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
              <div className="font-bold text-white text-xs">Municipal Corp (BBMP)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Ward & Lane Governance</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl col-span-2 sm:col-span-1">
              <div className="font-bold text-white text-xs">Traffic Police</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Diversions & Lane Closures</div>
            </div>
          </div>
        </div>

        {/* SECTION 4: GATEWAY ACTION SECTION */}
        <div className="text-center bg-slate-900/90 rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Ready to Access the System?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Access your authorized department console, review automated conflict alerts, or report infrastructure issues on the public gateway.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/login" 
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              Sign In to Official Console
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-sm transition-colors"
            >
              Register Department Account
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
