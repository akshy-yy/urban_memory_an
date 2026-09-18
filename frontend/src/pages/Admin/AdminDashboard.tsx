import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Activity, ShieldCheck, AlertCircle, Building2, MapPin, Clock } from 'lucide-react';
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
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">System Administration</h1>
        <p className="text-gray-600">Overview of all system metrics, cross-department operations, and impact tracking.</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="gov-card p-6 border-l-4 border-[var(--color-saffron)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Projects</p>
              <h2 className="text-3xl font-black text-gray-800 mt-1">{metrics?.activeProjects}</h2>
            </div>
            <div className="p-2 bg-orange-50 rounded text-[var(--color-saffron)]">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Out of {metrics?.totalProjects} total proposed</p>
        </div>

        <div className="gov-card p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Conflicts Prevented</p>
              <h2 className="text-3xl font-black text-gray-800 mt-1">{metrics?.conflictsPrevented}</h2>
            </div>
            <div className="p-2 bg-green-50 rounded text-green-600">
              <ShieldCheck size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Saved estimated 42+ days of delays</p>
        </div>

        <div className="gov-card p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending Complaints</p>
              <h2 className="text-3xl font-black text-gray-800 mt-1">{metrics?.pendingComplaints}</h2>
            </div>
            <div className="p-2 bg-red-50 rounded text-red-600">
              <AlertCircle size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Out of {metrics?.totalComplaints} total received</p>
        </div>

        <div className="gov-card p-6 border-l-4 border-[var(--color-navy)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Departments</p>
              <h2 className="text-3xl font-black text-gray-800 mt-1">{metrics?.registeredDepartments}</h2>
            </div>
            <div className="p-2 bg-blue-50 rounded text-[var(--color-navy)]">
              <Building2 size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Fully onboarded to UIMS</p>
        </div>

      </div>

      {/* Recent Activity & Complaints Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Priority Complaints Ranking */}
        <div className="gov-card flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-red-50 dark:bg-red-900/20 flex justify-between items-center rounded-t-lg">
            <h2 className="font-bold text-lg text-red-800 dark:text-red-400 flex items-center gap-2">
              <AlertCircle size={20} /> Priority Citizen Complaints
            </h2>
            <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded font-bold">{liveComplaints.length} Live</span>
          </div>
          <div className="p-0 flex-grow overflow-y-auto max-h-[400px]">
            {liveComplaints.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No active complaints found.</div>
            ) : (
              <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Urgency</th>
                    <th className="px-6 py-3">Citizen</th>
                    <th className="px-6 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {liveComplaints.map((c: any) => (
                    <tr key={c.id} className={`border-b border-gray-200 transition-colors cursor-pointer ${
                      c.urgency >= 8 ? 'hover:bg-red-50' :
                      c.urgency >= 5 ? 'hover:bg-orange-50' :
                      'hover:bg-blue-50'
                    }`}>
                      <td className="px-6 py-4 font-black">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wider whitespace-nowrap inline-block ${
                          c.urgency >= 8 ? 'bg-red-100 text-red-900' :
                          c.urgency >= 5 ? 'bg-orange-100 text-orange-900' :
                          'bg-blue-100 text-blue-900'
                        }`}>
                          LEVEL {c.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-black">
                        {c.name}
                        <div className="text-[11px] text-gray-800 font-normal flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-red-600" />
                          <span>{c.city || 'Bengaluru'}, {c.state || 'Karnataka'}</span>
                        </div>
                        <div className="text-[10px] text-gray-700 font-normal flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          <span>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-black text-xs mb-0.5">{c.roadNumber}</p>
                        <p className="text-xs text-gray-800 line-clamp-2" title={c.details}>{c.details}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Logs Mock */}
        <div className="gov-card flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 flex justify-between items-center rounded-t-lg">
            <h2 className="font-bold text-lg text-[var(--color-navy)] dark:text-blue-400">Recent Cross-Department Activity</h2>
            <button className="text-sm text-[var(--color-navy)] dark:text-blue-400 hover:underline font-medium">View All</button>
          </div>
          <div className="p-0 flex-grow overflow-y-auto max-h-[400px]">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Dept</th>
                  <th scope="col" className="px-6 py-3">Event</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Metro Water Board</td>
                  <td className="px-6 py-4">Proposed new pipeline excavation on MG Road</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 rounded font-semibold text-xs">CONFLICT</span></td>
                </tr>
                <tr className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">BESCOM</td>
                  <td className="px-6 py-4">Updated project status to COMPLETED</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 rounded font-semibold text-xs">SUCCESS</span></td>
                </tr>
                <tr className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">BBMP</td>
                  <td className="px-6 py-4">Merged project timeline with Traffic Police</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400 rounded font-semibold text-xs">OPTIMIZED</span></td>
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
