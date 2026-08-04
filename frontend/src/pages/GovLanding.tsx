import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  Clock, 
  Users, 
  Building2, 
  ChevronDown,
  ExternalLink
} from 'lucide-react';
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
    <div className="relative min-h-screen font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
      
      {/* Dynamic Satellite Map Background with Animated Grid Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Satellite Map Background Imagery */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80')`,
            filter: 'brightness(0.35) contrast(1.15) saturate(1.2)'
          }}
        />
        
        {/* Animated Coordinate Grid & Radar Pulse */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-20 dark:opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
      </div>

      {/* FIXED / FLOATING STICKY HEADER BADGE (Appears when scrolled) */}
      <div 
        className="fixed top-3 left-4 sm:left-8 z-40 transition-all duration-500 pointer-events-none"
        style={{
          opacity: progress > 0.8 ? 1 : 0,
          transform: `translateY(${progress > 0.8 ? 0 : -20}px)`,
        }}
      >
        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white font-black text-lg flex items-center justify-center shadow-md">
            U
          </div>
          <div>
            <div className="font-extrabold text-sm text-[var(--color-navy)] dark:text-blue-400 leading-none">UIMS</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Urban Infrastructure Memory System</div>
          </div>
        </div>
      </div>

      {/* HERO SECTION WITH CENTER LOGO ANIMATION */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pt-16">
        
        {/* Centered Logo & Title that smoothly transitions to top-left on scroll */}
        <div 
          className="transition-all duration-700 ease-out flex flex-col items-center"
          style={{
            transform: `translateY(${progress * -80}px) scale(${1 - progress * 0.2})`,
            opacity: 1 - progress * 1.2 > 0 ? 1 - progress * 1.2 : 0,
            pointerEvents: progress > 0.7 ? 'none' : 'auto'
          }}
        >
          {/* Glowing Animated Emblem */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900/90 border border-white/20 backdrop-blur-2xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-indigo-200">
                UIMS
              </span>
            </div>
          </div>

          {/* Full Form */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
            National Infrastructure Coordination Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl drop-shadow-lg">
            Urban Infrastructure <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Memory System</span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed drop-shadow">
            Eliminating repetitive road excavation through unified spatial memory, real-time cross-department synchronization, and AI conflict mitigation.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              to={getDashboardLink()}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Official Sign In'}
              <ArrowRight size={18} />
            </Link>

            <a 
              href="http://localhost:5174" 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold backdrop-blur-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Users size={18} className="text-sky-400" />
              Citizen Public Portal
              <ExternalLink size={14} className="opacity-70" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 flex flex-col items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-widest transition-opacity duration-300 animate-bounce"
          style={{ opacity: Math.max(0, 1 - progress * 2) }}
        >
          <span>Scroll To Explore</span>
          <ChevronDown size={18} />
        </div>
      </section>

      {/* MAIN INFORMATIVE CONTENT (Reveals as you scroll down) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        
        {/* SECTION 1: WHAT IS UIMS? */}
        <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/20 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wider uppercase mb-2">
              <Shield size={18} />
              Unified Civil Engineering Memory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-snug">
              What is the Urban Infrastructure Memory System?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              In modern cities, public works suffer from a lack of temporal and spatial coordination. PWD paves a new asphalt road, and weeks later, the Water Board or Telecom excavation teams dig trenches, destroying tax-payer funded infrastructure.
            </p>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              <strong className="text-blue-300">UIMS</strong> is a state-grade digital ledger and GIS intelligence backbone that records every excavation, underground asset coordinate, pavement warranty, and department proposal. It automatically detects cross-agency conflicts before a single shovel touches the ground.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-black text-blue-400 mb-1">94%</div>
              <div className="text-sm font-semibold text-gray-200">Excavation Conflict Reduction</div>
              <p className="text-xs text-gray-400 mt-1">Pre-emptive clash prevention across municipal utilities.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-black text-emerald-400 mb-1">5-Year</div>
              <div className="text-sm font-semibold text-gray-200">Road Quality Retention</div>
              <p className="text-xs text-gray-400 mt-1">Automated defect liability & contractor warranty enforcement.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400 mb-1">Live</div>
              <div className="text-sm font-semibold text-gray-200">Citizen Priority Routing</div>
              <p className="text-xs text-gray-400 mt-1">Direct grievance dispatch ranked 1-10 on urgency.</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: HOW UIMS SOLVES MUNICIPAL CONFLICTS */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Core Capabilities & Architecture
            </h2>
            <p className="text-gray-300 text-base">
              Engineered with advanced geospatial analytics and real-time synchronization pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/15 dark:border-slate-800 rounded-3xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Spatial De-confliction</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                When an agency proposes a road excavation, UIMS cross-checks GIS coordinates against active warranties and other upcoming projects.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/15 dark:border-slate-800 rounded-3xl p-6 hover:border-emerald-400/50 transition-all duration-300 hover:-translate-y-1 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Temporal Synchronization</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Unifies timelines for Water, Electricity, and PWD so all underground works complete before surface asphalt is laid.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/15 dark:border-slate-800 rounded-3xl p-6 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Automated Memory Log</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Retains full digital history of asphalt depth, subsoil moisture, utility pipeline placements, and contractor responsibility.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/15 dark:border-slate-800 rounded-3xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Grievance Prioritization</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Citizen complaints are ranked with priority levels (1-10) and dispatched directly to the responsible division's dashboard.
              </p>
            </div>

          </div>
        </div>

        {/* SECTION 3: INTERACTIVE STAKEHOLDERS MATRIX */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Cross-Department Interoperability
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Synchronizing state, municipal, and private utility divisions under a single truth system.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <Building2 className="mx-auto text-blue-400 mb-2" size={28} />
              <div className="font-bold text-white text-sm">Public Works (PWD)</div>
              <div className="text-xs text-gray-400 mt-1">Surface & Arterial Roads</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <Layers className="mx-auto text-cyan-400 mb-2" size={28} />
              <div className="font-bold text-white text-sm">Water Supply (BWSSB)</div>
              <div className="text-xs text-gray-400 mt-1">Underground Pipelines</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <Cpu className="mx-auto text-amber-400 mb-2" size={28} />
              <div className="font-bold text-white text-sm">Electricity Board</div>
              <div className="text-xs text-gray-400 mt-1">High Tension Conduits</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <MapPin className="mx-auto text-emerald-400 mb-2" size={28} />
              <div className="font-bold text-white text-sm">Municipal Corp (BBMP)</div>
              <div className="text-xs text-gray-400 mt-1">Ward & Lane Governance</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md col-span-2 sm:col-span-1">
              <Shield className="mx-auto text-red-400 mb-2" size={28} />
              <div className="font-bold text-white text-sm">Traffic Police</div>
              <div className="text-xs text-gray-400 mt-1">Diversions & Lane Closures</div>
            </div>
          </div>
        </div>

        {/* SECTION 4: GATEWAY ACTION SECTION */}
        <div className="text-center bg-white/10 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-10 sm:p-16 border border-white/20 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
            Ready to Access the System?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Access your authorized department console, review automated conflict alerts, or report infrastructure issues on the public gateway.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link 
              to="/login" 
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-xl shadow-blue-500/30 hover:scale-105 transition-all text-base"
            >
              Sign In to Official Console
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold backdrop-blur-xl hover:scale-105 transition-all text-base"
            >
              Register Department Account
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
