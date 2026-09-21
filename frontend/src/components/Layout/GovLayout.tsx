import { Outlet, Link, useNavigate } from 'react-router-dom';
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
    } catch {
      // BroadcastChannel not supported — silently continue
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
      <div className="bg-amber-600 h-1.5 w-full"></div>
      
      {/* Main Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* Logo and Title */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-blue-900 group-hover:bg-blue-800 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-xs transition-colors">
                  U
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">UIMS</h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Urban Infrastructure Memory System</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation & Actions */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-xs tracking-wide transition-colors">
                System Overview
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'ROLE_ADMIN' && (
                    <Link to="/admin" className="text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-xs tracking-wide transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  {user?.role === 'ROLE_DEPARTMENT' && (
                    <Link to="/department" className="text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-xs tracking-wide transition-colors">
                      Department Console
                    </Link>
                  )}

                  {/* NAVBAR ACTION BUTTONS */}
                  <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
                    
                    {/* Propose New Work */}
                    <Link 
                      to="/department/project/new" 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 font-semibold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shadow-xs group"
                    >
                      <span>Propose Work</span>
                    </Link>

                    {/* Review Complaints Button with Live Badge */}
                    <button 
                      type="button"
                      onClick={() => setShowComplaintsModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 font-semibold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all shadow-xs relative group"
                    >
                      <span>Review Complaints</span>
                      {liveComplaints.length > 0 && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                          {liveComplaints.length}
                        </span>
                      )}
                    </button>

                    {/* Status Pill */}
                    <div className="hidden xl:flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pl-2">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                        3 Active
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
                    className="text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-xs tracking-wide transition-colors"
                  >
                    Citizen Map Portal
                  </a>
                  <button 
                    type="button"
                    onClick={() => setShowComplaintsModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-semibold text-xs hover:bg-amber-100 transition-all"
                  >
                    <span>Review Complaints ({liveComplaints.length})</span>
                  </button>
                </>
              )}
            </nav>

            {/* User Actions & Dark Mode */}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Toggle Theme"
              >
                {isDark ? 'Light' : 'Dark'}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{user?.role.replace('ROLE_', '')}</p>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }} 
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white shadow-xs transition-all">
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

      {/* GLOBAL COMPLAINTS REVIEW MODAL */}
      {showComplaintsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Live Citizen Complaints Feed</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ranked by urgency level (Level 10 on top)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowComplaintsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-xs"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto flex-grow py-4 space-y-3">
              {liveComplaints.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No active complaints found. File a test complaint on the Citizen Portal!
                </div>
              ) : (
                liveComplaints.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex flex-col gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider ${
                          c.urgency >= 8 ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300' :
                          c.urgency >= 5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                        }`}>
                          URGENCY {c.urgency}/10
                        </span>
                        <strong className="text-slate-900 dark:text-slate-100 text-xs font-bold">{c.name}</strong>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span>{c.roadNumber} ({c.city}, {c.state})</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      {c.details}
                    </p>

                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                      <span>Aadhar: {c.aadhar}</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-400">Status: {c.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Total Complaints: <strong>{liveComplaints.length}</strong>
              </span>
              <button 
                onClick={() => setShowComplaintsModal(false)}
                className="gov-button-primary text-xs py-1.5 px-4"
              >
                Close Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Green Strip */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Urban Infrastructure Memory System. All rights reserved.</p>
        </div>
        <div className="bg-emerald-700 h-1.5 w-full"></div>
      </footer>
    </div>
  );
}
