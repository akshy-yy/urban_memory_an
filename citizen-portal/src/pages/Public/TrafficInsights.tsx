import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import indiaData from '../../data/indiaLocations.json';

export default function TrafficInsights() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  
  // Search state
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [searched, setSearched] = useState(false);

  const generateForecast = () => {
    return Array.from({length: 24}).map((_, i) => {
      const base = 30 + Math.random() * 40;
      return {
        time: i,
        displayTime: `${i.toString().padStart(2, '0')}:00`,
        predicted_congestion_pct: Math.round(base),
        lower_bound: Math.max(0, Math.round(base - 10)),
        upper_bound: Math.min(100, Math.round(base + 15))
      };
    });
  };

  const generateHeatmap = () => {
    return Array.from({length: 7}).map(() => 
      Array.from({length: 24}).map(() => Math.floor(Math.random() * 100))
    );
  };

  useEffect(() => {
    generateInsights("Bangalore");
  }, []);

  const generateInsights = (cityName: string) => {
    setLoading(true);
    setExpandedIdx(null);
    const cityTitle = cityName || "City";
    
    // Generate random trend
    const base = 50 + Math.random() * 30;
    const trend = Array.from({length: 7}).map(() => Math.max(20, Math.min(100, base + (Math.random() * 40 - 20))));
    const thisWeek = Math.round(trend.reduce((a, b) => a + b, 0) / 7);
    const lastWeek = Math.round(thisWeek + (Math.random() * 20 - 10));

    const mockInsights = [
      { corridor: "Main Arterial Road", city: cityTitle, thisWeekAvg: thisWeek, lastWeekAvg: lastWeek, weeklyTrend: trend, forecast: generateForecast(), heatmap: generateHeatmap() },
      { corridor: "Outer Ring Road", city: cityTitle, thisWeekAvg: 78.0, lastWeekAvg: 75.5, weeklyTrend: [70, 72, 75, 78, 80, 85, 80], forecast: generateForecast(), heatmap: generateHeatmap() },
      { corridor: "Downtown Junction", city: cityTitle, thisWeekAvg: 90.5, lastWeekAvg: 88.0, weeklyTrend: [80, 85, 90, 95, 95, 90, 85], forecast: generateForecast(), heatmap: generateHeatmap() }
    ];
    
    setTimeout(() => {
      setInsights(mockInsights);
      setSearched(true);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (state && city) {
      generateInsights(city);
    }
  };

  const getHeatmapColor = (value: number) => {
    if (value < 30) return 'bg-emerald-500';
    if (value < 70) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-y-auto">
      
      <div className="pt-24 px-4 max-w-4xl mx-auto mb-10 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Live Traffic Insights</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Real-time corridor analytics, congestion trends, and forecast models.</p>
        </div>

        {/* Search Panel */}
        <div className="gov-card p-6 mb-6">
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-slate-700 dark:text-slate-300">Search District</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="gov-label">State</label>
              <select 
                className="gov-input w-full" 
                required
                value={state}
                onChange={e => { setState(e.target.value); setCity(''); }}
              >
                <option value="">Select State</option>
                {indiaData.states.map((s: any) => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="gov-label">District / City</label>
              <select 
                className="gov-input w-full" 
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                disabled={!state}
              >
                <option value="">Select City</option>
                {state && indiaData.states.find((s: any) => s.state === state)?.districts.map((d: string) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 mt-1 flex justify-end">
              <button type="submit" className="gov-button-primary">
                Get Insights
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-semibold text-sm">Loading live data...</div>
        ) : (
          <div className="space-y-4">
            {searched && <h3 className="font-bold text-sm uppercase text-slate-500 dark:text-slate-400 mb-2">Search Results</h3>}
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all" onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500">
                    #{idx + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{insight.corridor}</h3>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded">{insight.city}</span>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">This Week Avg</p>
                        <p className="font-extrabold text-red-600 dark:text-red-400">{insight.thisWeekAvg}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Last Week Avg</p>
                        <p className="font-semibold text-slate-600 dark:text-slate-400">{insight.lastWeekAvg}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-16 w-full md:w-48 bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2 border border-slate-200 dark:border-slate-700/60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={insight.weeklyTrend.map((v: number, i: number) => ({ val: v, day: i }))}>
                        <Line type="monotone" dataKey="val" stroke={insight.thisWeekAvg > 80 ? "#dc2626" : "#d97706"} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {expandedIdx === idx && (
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase text-xs mb-3">Detailed Roadwork & Congestion Analysis</h4>
                    
                    <div className="h-48 w-full bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mb-5">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={insight.forecast}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                          <XAxis dataKey="displayTime" fontSize={10} tickMargin={5} minTickGap={30} stroke="#64748b" />
                          <YAxis fontSize={10} domain={[0, 100]} stroke="#64748b" />
                          <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                          <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#2563eb" fillOpacity={0.1} />
                          <Area type="monotone" dataKey="lower_bound" stroke="none" fill="#0f172a" fillOpacity={1} />
                          <Line type="monotone" dataKey="predicted_congestion_pct" stroke="#2563eb" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto">
                      <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-2">Weekly Heatmap Matrix (00h - 23h)</p>
                      <div className="min-w-[600px]">
                        {insight.heatmap.map((dayData: number[], dayIdx: number) => (
                          <div key={dayIdx} className="flex mb-1 items-center">
                            <span className="w-8 text-[10px] font-semibold text-slate-500 dark:text-slate-400">{daysOfWeek[dayIdx]}</span>
                            <div className="flex-1 flex gap-0.5">
                              {dayData.map((val: number, hIdx: number) => (
                                <div 
                                  key={hIdx} 
                                  title={`${val}% at ${hIdx}:00`}
                                  className={`flex-1 h-3.5 rounded-xs ${getHeatmapColor(val)} hover:opacity-80 cursor-pointer transition-all`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
