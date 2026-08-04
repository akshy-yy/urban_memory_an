import { Outlet, Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Sun, Moon, PlusCircle, FileText, X, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredComplaints, type ComplaintItem } from '../../data/complaintsData';

export default function GovLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [liveComplaints, setLiveComplaints] = useState<ComplaintItem[]>([]);
  const [showComplaintsModal, setShowComplaintsModal] = useState(false);

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

  useEffect(() => {
    const fetchComplaints = () => {
      const complaints = getStoredComplaints();
      setLiveComplaints(complaints);
    };

    fetchComplaints();

    const handleStorage = () => fetchComplaints();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'COMPLAINT_SYNC_ACK' || e.data?.type === 'SAVE_COMPLAINT') {
        fetchComplaints();
      }
    });

    let bc: BroadcastChannel | null = null;
    try {
      if (window.BroadcastChannel) {
        bc = new BroadcastChannel('uims_complaints_channel');
        bc.onmessage = () => fetchComplaints();
      }
    } catch (e) {
      console.warn('BroadcastChannel error in GovLayout', e);
    }

    const interval = setInterval(fetchComplaints, 3000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Header - Saffron Strip */}
      <div className="bg-[var(--color-saffron)] h-2 w-full"></div>
      
      {/* Main Header */}
      <header className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-gray-200/60 dark:border-slate-800/80 shadow-sm sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* Logo and Title */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-[var(--color-navy)] group-hover:bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md transition-colors">
                  U
                </div>
                <div>
                  <h1 className="text-xl font-black text-[var(--color-navy)] dark:text-blue-400 leading-tight">UIMS</h1>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Urban Infrastructure Memory System</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation & Actions */}
            <nav className="hidden lg:flex items-center space-x-5">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-navy)] dark:hover:text-blue-400 font-bold text-xs uppercase tracking-wide transition-colors">
                System Overview
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'ROLE_ADMIN' && (
                    <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-navy)] dark:hover:text-blue-400 font-bold text-xs uppercase tracking-wide transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  {user?.role === 'ROLE_DEPARTMENT' && (
                    <Link to="/department" className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-navy)] dark:hover:text-blue-400 font-bold text-xs uppercase tracking-wide transition-colors">
                      Department Console
                    </Link>
                  )}

                  {/* NAVBAR ACTION BUTTONS: Moved from homepage/dashboard into navbar */}
                  <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-slate-800">
                    
                    {/* Propose New Work in Navbar */}
                    <Link 
                      to="/department/project/new" 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all shadow-sm group"
                    >
                      <PlusCircle size={14} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Propose Work</span>
                    </Link>

                    {/* Review Complaints Button with Live Badge */}
                    <button 
                      type="button"
                      onClick={() => setShowComplaintsModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 font-bold text-xs hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all shadow-sm relative group"
                    >
                      <FileText size={14} className="text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                      <span>Review Complaints</span>
                      {liveComplaints.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-sm animate-pulse">
                          {liveComplaints.length}
                        </span>
                      )}
                    </button>

                    {/* Status Pill */}
                    <div className="hidden xl:flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 pl-2">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30">
                        <CheckCircle2 size={11} /> 3 Active
                      </span>
                    </div>

                  </div>
                </>
              ) : (
                <>
                  <a 
                    href="http://localhost:5174" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-navy)] dark:hover:text-blue-400 font-bold text-xs uppercase tracking-wide transition-colors"
                  >
                    Citizen Map Portal
                  </a>
                  <button 
                    type="button"
                    onClick={() => setShowComplaintsModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 font-bold text-xs hover:bg-orange-100 transition-all"
                  >
                    <FileText size={14} className="text-orange-600" />
                    <span>Review Complaints ({liveComplaints.length})</span>
                  </button>
                </>
              )}
            </nav>

            {/* User Actions & Dark Mode */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="text-gray-500 dark:text-gray-400 hover:text-[var(--color-navy)] dark:hover:text-blue-400 p-2 rounded-xl border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-[var(--color-navy)] dark:text-blue-400">{user?.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{user?.role.replace('ROLE_', '')}</p>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }} 
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 border border-gray-200 dark:border-slate-700 transition-colors"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl bg-[var(--color-navy)] hover:bg-blue-700 text-white shadow-md transition-all">
                  <User size={14} />
                  <span>Official Sign In</span>
                </Link>
              )}
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>

      {/* GLOBAL COMPLAINTS REVIEW MODAL (Triggered directly from navbar on any page) */}
      {showComplaintsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900 dark:text-white">Live Citizen Complaints Feed</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ranked by urgency level (Level 10 on top)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowComplaintsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow py-4 space-y-3">
              {liveComplaints.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No active complaints found. File a test complaint on the Citizen Portal!
                </div>
              ) : (
                liveComplaints.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/50 flex flex-col gap-2 hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-black tracking-wider ${
                          c.urgency >= 8 ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300' :
                          c.urgency >= 5 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                        }`}>
                          URGENCY {c.urgency}/10
                        </span>
                        <strong className="text-gray-900 dark:text-white text-sm font-bold">{c.name}</strong>
                      </div>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                        <Clock size={11} />
                        {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-gray-800 dark:text-gray-200">
                      <MapPin size={13} className="text-red-500 flex-shrink-0" />
                      <span>{c.roadNumber} ({c.city}, {c.state})</span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800">
                      {c.details}
                    </p>

                    <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
                      <span>Aadhar: {c.aadhar}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">Status: {c.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Total Complaints: <strong>{liveComplaints.length}</strong>
              </span>
              <button 
                onClick={() => setShowComplaintsModal(false)}
                className="gov-button-primary text-xs py-2 px-5"
              >
                Close Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Green Strip */}
      <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Urban Infrastructure Memory System. All rights reserved.</p>
        </div>
        <div className="bg-[var(--color-green)] h-2 w-full"></div>
      </footer>
    </div>
  );
}
