import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, AlertTriangle, TrendingUp, Building2 } from 'lucide-react';

interface DepartmentScore {
  departmentName: string;
  avgRestorationDelayDays: number;
  totalConflicts: number;
}

const MOCK_SCORECARD: DepartmentScore[] = [
  { departmentName: 'BWSSB – Water Board',       avgRestorationDelayDays: 6.2,  totalConflicts: 2 },
  { departmentName: 'BESCOM – Electricity',       avgRestorationDelayDays: 9.8,  totalConflicts: 4 },
  { departmentName: 'BBMP – Roads & Infra',        avgRestorationDelayDays: 18.5, totalConflicts: 7 },
  { departmentName: 'BMRCL – Metro Rail',          avgRestorationDelayDays: 4.1,  totalConflicts: 1 },
  { departmentName: 'GAIL – Gas Authority',        avgRestorationDelayDays: 22.0, totalConflicts: 5 },
];

const SLA_BREACH_THRESHOLD_DAYS = 14;

function getRank(idx: number) {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[idx] ?? `#${idx + 1}`;
}

function DelayBadge({ days }: { days: number }) {
  const isSevere = days > SLA_BREACH_THRESHOLD_DAYS;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-wide whitespace-nowrap ${
        isSevere
          ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
          : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      }`}
    >
      {isSevere && <AlertTriangle size={11} />}
      {days.toFixed(1)} days {isSevere ? '— Severe Breach' : '— Within SLA'}
    </span>
  );
}

interface SlaLeagueTableProps {
  token: string | null;
}

export default function SlaLeagueTable({ token }: SlaLeagueTableProps) {
  const [scorecard, setScorecard] = useState<DepartmentScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/scorecard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: DepartmentScore[] = Array.isArray(res.data) && res.data.length > 0
          ? res.data
          : MOCK_SCORECARD;
        setScorecard(data.slice().sort((a, b) => a.avgRestorationDelayDays - b.avgRestorationDelayDays));
      } catch {
        // Endpoint not yet implemented — use demo data
        setScorecard(MOCK_SCORECARD.slice().sort((a, b) => a.avgRestorationDelayDays - b.avgRestorationDelayDays));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const severeCount = scorecard.filter(d => d.avgRestorationDelayDays > SLA_BREACH_THRESHOLD_DAYS).length;

  return (
    <div className="gov-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-t-lg">
        <div>
          <h2 className="font-bold text-lg text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            Department SLA League Table
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Ranked by average road-restoration delay · SLA threshold: {SLA_BREACH_THRESHOLD_DAYS} days
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {severeCount > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-xs font-black">
              <AlertTriangle size={13} />
              {severeCount} Severe Breach{severeCount > 1 ? 'es' : ''}
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            {scorecard.length} Departments
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading scorecard...</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 w-10 text-center">Rank</th>
                <th className="px-6 py-3">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={13} /> Department
                  </span>
                </th>
                <th className="px-6 py-3">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp size={13} /> Avg Restoration Delay
                  </span>
                </th>
                <th className="px-6 py-3 text-center">Conflicts Caused</th>
                <th className="px-6 py-3 text-center">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {scorecard.map((dept, idx) => {
                const isSevere = dept.avgRestorationDelayDays > SLA_BREACH_THRESHOLD_DAYS;
                return (
                  <tr
                    key={dept.departmentName}
                    className={`transition-colors ${
                      isSevere
                        ? 'bg-red-50/60 dark:bg-red-950/20 hover:bg-red-100/80 dark:hover:bg-red-950/40'
                        : 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Rank */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-base font-black">{getRank(idx)}</span>
                    </td>

                    {/* Department Name */}
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {isSevere && (
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                        )}
                        {dept.departmentName}
                      </div>
                    </td>

                    {/* Avg Delay */}
                    <td className="px-6 py-4">
                      <DelayBadge days={dept.avgRestorationDelayDays} />
                    </td>

                    {/* Conflicts */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-black ${
                          dept.totalConflicts >= 5
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300'
                        }`}
                      >
                        {dept.totalConflicts}
                      </span>
                    </td>

                    {/* SLA Status */}
                    <td className="px-6 py-4 text-center">
                      {isSevere ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-sm">
                          <AlertTriangle size={11} /> BREACH
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                          ✓ Compliant
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 text-[11px] text-gray-400 rounded-b-lg">
        Departments ranked best-to-worst. Red rows indicate SLA breach (&gt;{SLA_BREACH_THRESHOLD_DAYS} day average delay). Data refreshes on dashboard load.
      </div>
    </div>
  );
}
