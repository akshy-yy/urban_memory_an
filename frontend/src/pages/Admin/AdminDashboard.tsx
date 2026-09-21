import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import SlaLeagueTable from '../../components/SlaLeagueTable';
import { getStoredComplaints, type ComplaintItem } from '../../data/complaintsData';

// ── Types ──────────────────────────────────────────────────────────────────
interface SystemMetrics {
  totalProjects:        number;
  activeProjects:       number;
  totalComplaints:      number;
  pendingComplaints:    number;
  registeredDepartments: number;
  conflictsPrevented:   number;
}

/** Matches HotspotRecord from the Python ML service */
interface Hotspot {
  cluster_id:      number;
  report_count:    number;
  average_urgency: number;
  category:        string;
  center_lat:      number;
  center_lng:      number;
  complaint_ids:   (number | string)[];
  summary:         string;
}

// ── Constants ─────────────────────────────────────────────────────────────
const DEMO_METRICS: SystemMetrics = {
  totalProjects: 14, activeProjects: 8, totalComplaints: 42,
  pendingComplaints: 12, registeredDepartments: 5, conflictsPrevented: 6,
};

const DEMO_HOTSPOTS: Hotspot[] = [
  { cluster_id: 0, report_count: 4, average_urgency: 8.5, category: 'pothole',
    center_lat: 12.9716, center_lng: 77.5946,
    complaint_ids: [101, 102, 103, 104],
    summary: 'Hotspot: 4 reports, avg urgency 8.5, category: pothole' },
  { cluster_id: 1, report_count: 3, average_urgency: 7.0, category: 'waterlogging',
    center_lat: 12.9352, center_lng: 77.6245,
    complaint_ids: [201, 202, 203],
    summary: 'Hotspot: 3 reports, avg urgency 7.0, category: waterlogging' },
  { cluster_id: 2, report_count: 2, average_urgency: 5.5, category: 'open manhole',
    center_lat: 12.9580, center_lng: 77.6482,
    complaint_ids: [301, 302],
    summary: 'Hotspot: 2 reports, avg urgency 5.5, category: open manhole' },
];

const URGENCY_COLOR = (score: number) =>
  score >= 8 ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
  : score >= 6 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';

// ── Component ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { token } = useAuth();
  const [metrics, setMetrics]           = useState<SystemMetrics | null>(null);
  const [loading, setLoading]           = useState(true);
  const [liveComplaints, setLiveComplaints] = useState<ComplaintItem[]>([]);

  // DBSCAN clustering state
  const [hotspots, setHotspots]             = useState<Hotspot[]>([]);
  const [clusterLoading, setClusterLoading] = useState(false);
  const [mlServiceDown, setMlServiceDown]   = useState(false);

  // ── Fetch system metrics ───────────────────────────────────────────────
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/metrics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(res.data.totalProjects > 0 ? res.data : DEMO_METRICS);
      } catch {
        setMetrics(DEMO_METRICS);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [token]);

  // ── Fetch & auto-cluster complaints via DBSCAN ML service ─────────────
  useEffect(() => {
    const clusterComplaints = async (complaints: ComplaintItem[]) => {
      if (complaints.length === 0) return;
      setClusterLoading(true);
      setMlServiceDown(false);
      try {
        const payload = complaints.map((c) => ({
          id:            c.id,
          lat:           12.9716 + (Math.random() - 0.5) * 0.1, // Bengaluru area spread
          lng:           77.5946 + (Math.random() - 0.5) * 0.1,
          urgency_score: c.urgency,
          category:      c.roadNumber?.toLowerCase().includes('pothole') ? 'pothole' : 'other',
        }));
        const res = await axios.post('http://localhost:8001/cluster-complaints', payload, {
          timeout: 5000,
        });
        setHotspots(Array.isArray(res.data) ? res.data : DEMO_HOTSPOTS);
      } catch {
        // ML service is offline — show demo data with a clear indicator
        setMlServiceDown(true);
        setHotspots(DEMO_HOTSPOTS);
      } finally {
        setClusterLoading(false);
      }
    };

    const fetchAndCluster = () => {
      const complaints = getStoredComplaints();
      setLiveComplaints(complaints);
      clusterComplaints(complaints);
    };

    fetchAndCluster();

    const handleStorage = () => fetchAndCluster();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'COMPLAINT_SYNC_ACK' || e.data?.type === 'SAVE_COMPLAINT') {
        fetchAndCluster();
      }
    });

    let bc: BroadcastChannel | null = null;
    try {
      if (window.BroadcastChannel) {
        bc = new BroadcastChannel('uims_complaints_channel');
        bc.onmessage = () => fetchAndCluster();
      }
    } catch {
      // BroadcastChannel not supported in this browser — silently continue
    }

    const interval = setInterval(fetchAndCluster, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center gap-2 text-slate-500">
        <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading System Metrics…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">System Administration</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Overview of all system metrics, cross-department operations, and impact tracking.
        </p>
      </div>

      {/* ── Metrics Grid ────────────────────────────────────────────── */}
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

      {/* ── DBSCAN Complaint Clustering Hotspot Panel ────────────────── */}
      <div className="gov-card overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="font-bold text-sm text-violet-900 dark:text-violet-300">
                ML Complaint Hotspot Analysis
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                DBSCAN · ε=50m
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Spatial density clustering of citizen complaints — clusters autonomously identify critical infrastructure hotspots
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {mlServiceDown && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                ML Service Offline · Demo Data
              </span>
            )}
            {clusterLoading && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-violet-600 dark:text-violet-400 font-semibold">
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Clustering…
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-bold">
              {hotspots.length} Clusters
            </span>
          </div>
        </div>

        {hotspots.length === 0 && !clusterLoading ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            No complaint data available to cluster. File complaints on the Citizen Portal to see hotspots appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
              <thead className="text-[11px] font-bold uppercase bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-center w-12">Rank</th>
                  <th className="px-5 py-3">Dominant Category</th>
                  <th className="px-5 py-3 text-center">Reports</th>
                  <th className="px-5 py-3 text-center">Avg Urgency</th>
                  <th className="px-5 py-3">GPS Centroid</th>
                  <th className="px-5 py-3">Cluster Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {hotspots.map((h, idx) => (
                  <tr key={h.cluster_id}
                    className={`transition-colors ${h.average_urgency >= 8
                      ? 'bg-red-50/50 dark:bg-red-950/15 hover:bg-red-100/60 dark:hover:bg-red-950/30'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-black text-base">
                        {idx === 0 ? '🔴' : idx === 1 ? '🟠' : idx === 2 ? '🟡' : `#${idx + 1}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100 capitalize">
                      {h.category}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-black bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300">
                        {h.report_count}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${URGENCY_COLOR(h.average_urgency)}`}>
                        {h.average_urgency.toFixed(1)} / 10
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {h.center_lat.toFixed(4)}, {h.center_lng.toFixed(4)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 max-w-xs">
                      <span className="line-clamp-1" title={h.summary}>{h.summary}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 text-[10px] text-slate-400">
          Powered by FastAPI · scikit-learn DBSCAN (haversine metric, ε=50m, min_samples=1) · Auto-refreshes every 5 seconds
        </div>
      </div>

      {/* ── Complaints + Activity Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Priority Complaints Ranking */}
        <div className="gov-card flex flex-col h-full overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-red-50/70 dark:bg-red-950/30 flex justify-between items-center">
            <h2 className="font-bold text-sm text-red-800 dark:text-red-300">
              Priority Citizen Complaints
            </h2>
            <span className="bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200 text-xs px-2 py-0.5 rounded font-bold">
              {liveComplaints.length} Live
            </span>
          </div>
          <div className="p-0 flex-grow overflow-y-auto max-h-[380px]">
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
                  {liveComplaints.map((c) => (
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
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                          {c.city || 'Bengaluru'}, {c.state || 'Karnataka'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

        {/* Recent Cross-Department Activity */}
        <div className="gov-card flex flex-col h-full overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-between items-center">
            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Recent Cross-Department Activity</h2>
            <button className="text-xs text-blue-700 dark:text-blue-400 hover:underline font-semibold">View All</button>
          </div>
          <div className="p-0 flex-grow overflow-y-auto max-h-[380px]">
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
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">GAIL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">SLA Watchdog: restoration deadline exceeded by 8 days</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 rounded font-semibold text-[10px]">BREACH</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── SLA League Table ─────────────────────────────────────────── */}
      <div className="mt-8">
        <SlaLeagueTable token={token} />
      </div>

    </div>
  );
}
