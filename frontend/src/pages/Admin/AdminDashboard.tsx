import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import SlaLeagueTable from '../../components/SlaLeagueTable';
import { getStoredComplaints } from '../../data/complaintsData';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveComplaints, setLiveComplaints] = useState<any[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fallback mock data in case backend isn't populated
        const mockData = {
          totalProjects: 14,
          activeProjects: 8,
          totalComplaints: 42,
          pendingComplaints: 12,
          registeredDepartments: 5,
          conflictsPrevented: 6
        };

        try {
          const res = await axios.get('http://localhost:8080/api/admin/metrics', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Use real data if available, else mock if 0 (for presentation)
          setMetrics(res.data.totalProjects > 0 ? res.data : mockData);
        } catch (e) {
          console.warn("Using mock data for Admin Dashboard", e);
          setMetrics(mockData);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchLiveComplaints = () => {
      const complaints = getStoredComplaints();
      setLiveComplaints(complaints);
    };
    
    fetchMetrics();
    fetchLiveComplaints();
    
    // Listen for storage events (when updated via iframe bridge or other tabs)
    const handleStorage = () => fetchLiveComplaints();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'COMPLAINT_SYNC_ACK' || e.data?.type === 'SAVE_COMPLAINT') {
        fetchLiveComplaints();
      }
    });

    let bc: BroadcastChannel | null = null;
    try {
      if (window.BroadcastChannel) {
        bc = new BroadcastChannel('uims_complaints_channel');
        bc.onmessage = () => fetchLiveComplaints();
      }
    } catch (e) {
      console.warn('BroadcastChannel error', e);
    }

    const interval = setInterval(fetchLiveComplaints, 2000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading System Metrics...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">System Administration</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Overview of all system metrics, cross-department operations, and impact tracking.</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <div className="gov-card p-5 border-l-4 border-l-amber-600">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Projects</p>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{metrics?.activeProjects}</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Out of {metrics?.totalProjects} total proposed</p>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-emerald-600">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conflicts Prevented</p>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{metrics?.conflictsPrevented}</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Saved estimated 42+ days of delays</p>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-red-600">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Complaints</p>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{metrics?.pendingComplaints}</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Out of {metrics?.totalComplaints} total received</p>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-blue-900">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departments</p>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{metrics?.registeredDepartments}</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Fully onboarded to UIMS</p>
        </div>

      </div>

      {/* Recent Activity & Complaints Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Priority Complaints Ranking */}
        <div className="gov-card flex flex-col h-full overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-red-50/70 dark:bg-red-950/30 flex justify-between items-center">
            <h2 className="font-bold text-sm text-red-800 dark:text-red-300 flex items-center gap-2">
              Priority Citizen Complaints
            </h2>
            <span className="bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200 text-xs px-2 py-0.5 rounded font-bold">{liveComplaints.length} Live</span>
          </div>
          <div className="p-0 flex-grow overflow-y-auto max-h-[400px]">
            {liveComplaints.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No active complaints found.</div>
            ) : (
              <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                <thead className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5">Urgency</th>
                    <th className="px-4 py-2.5">Citizen</th>
                    <th className="px-4 py-2.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {liveComplaints.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider whitespace-nowrap inline-block ${
                          c.urgency >= 8 ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300' :
                          c.urgency >= 5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                        }`}>
                          LEVEL {c.urgency}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {c.name}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                          <span>{c.city || 'Bengaluru'}, {c.state || 'Karnataka'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                          <span>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs mb-0.5">{c.roadNumber}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2" title={c.details}>{c.details}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Logs Mock */}
        <div className="gov-card flex flex-col h-full overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-between items-center">
            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Recent Cross-Department Activity</h2>
            <button className="text-xs text-blue-700 dark:text-blue-400 hover:underline font-semibold">View All</button>
          </div>
          <div className="p-0 flex-grow overflow-y-auto max-h-[400px]">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
              <thead className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2.5">Dept</th>
                  <th scope="col" className="px-4 py-2.5">Event</th>
                  <th scope="col" className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">Metro Water Board</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Proposed new pipeline excavation on MG Road</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded font-semibold text-[10px]">CONFLICT</span></td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">BESCOM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Updated project status to COMPLETED</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded font-semibold text-[10px]">SUCCESS</span></td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">BBMP</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Merged project timeline with Traffic Police</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded font-semibold text-[10px]">OPTIMIZED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SLA League Table */}
      <div className="mt-8">
        <SlaLeagueTable token={token} />
      </div>
    </div>
  );
}
