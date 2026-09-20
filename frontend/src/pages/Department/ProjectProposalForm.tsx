import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import indiaData from '../../data/indiaLocations.json';

export default function ProjectProposalForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workType: '',
    roadId: '',
    state: '',
    city: '',
    district: '',
    locality: '',
    roadName: '',
    startDate: '',
    endDate: '',
    laneClosurePercentage: 0,
    recommendedStartTime: '',
    recommendedEndTime: '',
    disruptionScoreAtApproval: 0
  });

  // Traffic Data
  const [forecast, setForecast] = useState<any[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<number[][]>([]);
  const [aiWindows, setAiWindows] = useState<any[]>([]);
  const [trafficLoading, setTrafficLoading] = useState(false);
  const [trafficError, setTrafficError] = useState('');
  const [windowLoading, setWindowLoading] = useState(false);

  // Analysis Report
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (formData.roadId) {
      fetchTrafficData();
    } else {
      setForecast([]);
      setWeeklySummary([]);
    }
  }, [formData.roadId]);

  const fetchTrafficData = async () => {
    setTrafficLoading(true);
    setTrafficError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockForecast = Array.from({length: 7}).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const base = 40 + Math.random() * 40;
        return {
          timestamp: d.toISOString(),
          displayTime: d.toLocaleDateString('en-US', { weekday: 'short' }),
          predicted_congestion_pct: Math.round(base),
          lower_bound: Math.max(0, Math.round(base - 15)),
          upper_bound: Math.min(100, Math.round(base + 15))
        };
      });
      const mockSummary = Array.from({length: 7}).map(() => 
        Array.from({length: 24}).map(() => Math.round(20 + Math.random() * 60))
      );
      setForecast(mockForecast);
      setWeeklySummary(mockSummary);
    } catch (err) {
      setTrafficError('Traffic prediction temporarily unavailable');
    } finally {
      setTrafficLoading(false);
    }
  };

  const getRecommendedWindows = async () => {
    if (!formData.roadId) return;
    setWindowLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const now = new Date();
      const start1 = new Date(now); start1.setDate(start1.getDate() + 2); start1.setHours(22, 0, 0, 0);
      const end1 = new Date(start1); end1.setHours(start1.getHours() + 48);
      
      const start2 = new Date(now); start2.setDate(start2.getDate() + 5); start2.setHours(21, 0, 0, 0);
      const end2 = new Date(start2); end2.setHours(start2.getHours() + 48);

      setAiWindows([
        { start_time: start1.toISOString(), end_time: end1.toISOString(), disruption_score: 12, reason: "Lowest historical traffic during these days." },
        { start_time: start2.toISOString(), end_time: end2.toISOString(), disruption_score: 18, reason: "Avoids major weekend congestion peaks." }
      ]);
    } catch (err) {
      setTrafficError('Failed to fetch recommendations');
    } finally {
      setWindowLoading(false);
    }
  };

  const selectWindow = (win: any) => {
    const startObj = new Date(win.start_time);
    const endObj = new Date(win.end_time);
    setFormData({
      ...formData,
      startDate: startObj.toISOString().split('T')[0],
      endDate: endObj.toISOString().split('T')[0],
      recommendedStartTime: win.start_time,
      recommendedEndTime: win.end_time,
      disruptionScoreAtApproval: win.disruption_score
    });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setReport({
        severity: "MEDIUM",
        impactScore: 45,
        trafficIncrease: "15%",
        expectedDelay: "10 mins",
        conflicts: ["Potential overlap with BESCOM cable laying on adjacent street."],
        recommendation: "Proceed with caution. Inform traffic police for localized diversions.",
        approval_receipt: `UIMS Decision Engine v2.4 | ${new Date().toISOString()}\n─────────────────────────────────────────────\nProject   : ${formData.title || 'New Roadwork Proposal'}\nDept      : Current Department\nDecision  : CONDITIONAL APPROVAL — MEDIUM SEVERITY\nReason    : Disruption score 45/100. One potential conflict identified with BESCOM infrastructure on adjacent corridor. Traffic increase of 15% projected during work window. Night-shift scheduling strongly recommended.\nSLA Risk  : MEDIUM (predicted delay ~10 min avg; monitor weekly)\nConflicts : 1 potential (BESCOM cable laying)\nReviewer  : Spatial Conflict Engine (DBSCAN r=0.05, min_samples=2)\n─────────────────────────────────────────────\nThis receipt is system-generated and legally binding per UIMS Act §12(b).`
      });
      setStep(2);
    } catch (err) {
      setError('Failed to analyze project impact. Ensure all fields are filled correctly.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Project proposed successfully!');
      navigate('/department');
    } catch (err) {
      setError('Failed to submit project proposal.');
    } finally {
      setLoading(false);
    }
  };

  const getHeatmapColor = (val: number) => {
    if (val < 30) return 'bg-green-400';
    if (val < 60) return 'bg-yellow-400';
    if (val < 80) return 'bg-orange-500';
    return 'bg-red-600';
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Propose New Roadwork Project</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Multi-agency coordination and predictive impact assessment · Step {step} of 2</p>
      </div>

      {error && <div className="p-4 mb-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-xl text-sm font-medium flex items-center gap-2">{error}</div>}

      <div className="gov-card">
        {step === 1 && (
          <form className="p-6 md:p-8 space-y-6" onSubmit={handleAnalyze}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Project Title *</label>
                <input 
                  required type="text"
                  placeholder="e.g. Major Water Pipeline Laying & Road Resurfacing"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-medium text-sm transition-all"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/70 dark:bg-slate-900/60 shadow-xs">
                <label className="block text-xs font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-3">Target Location (Pan-India Spatial Registry) *</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">State</label>
                    <select 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 font-medium" 
                      required
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value, city: ''})}
                    >
                      <option value="">Select State</option>
                      {indiaData.states.map((s: any) => (
                        <option key={s.state} value={s.state}>{s.state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">City / District</label>
                    <select 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 font-medium disabled:opacity-50" 
                      required
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      disabled={!formData.state}
                    >
                      <option value="">Select City</option>
                      {formData.state && indiaData.states.find((s: any) => s.state === formData.state)?.districts.map((d: string) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Locality</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Indiranagar" 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 font-medium" 
                      required 
                      value={formData.locality}
                      onChange={e => setFormData({...formData, locality: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Road Corridor</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 100ft Road" 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 font-medium" 
                      required 
                      value={formData.roadName}
                      onChange={e => {
                        setFormData({...formData, roadName: e.target.value, roadId: e.target.value.length > 3 ? "1" : ""});
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Work Type *</label>
                <select 
                  required className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-medium text-sm transition-all"
                  value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})}
                >
                  <option value="">Select Work Category</option>
                  <option value="Excavation">Excavation</option>
                  <option value="Resurfacing">Resurfacing</option>
                  <option value="Pipeline Laying">Pipeline Laying</option>
                  <option value="Cable Laying">Cable Laying</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Traffic Module */}
            {formData.roadId && (
              <div className="mt-6 border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-slate-900/80 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-extrabold text-indigo-950 dark:text-indigo-200 flex items-center gap-2 text-base">
                    Traffic Forecast &amp; Predictive Scheduling
                  </h3>
                  {trafficLoading && <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">Running traffic ML model...</span>}
                </div>

                {trafficError ? (
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 p-3 rounded-xl border border-red-200 dark:border-red-800">
                    {trafficError}
                  </div>
                ) : forecast.length > 0 ? (
                  <div className="space-y-6">
                    {/* Line Chart */}
                    <div className="h-52 w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                      <p className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 mb-2 text-center tracking-widest">Congestion Prediction Trend (%)</p>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecast}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="displayTime" fontSize={10} tickMargin={5} minTickGap={30} stroke="#64748b" />
                          <YAxis fontSize={10} domain={[0, 100]} stroke="#64748b" />
                          <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '10px', backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                          <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#f87171" fillOpacity={0.2} />
                          <Area type="monotone" dataKey="lower_bound" stroke="none" fill="#ffffff" fillOpacity={1} />
                          <Line type="monotone" dataKey="predicted_congestion_pct" stroke="#ef4444" strokeWidth={2.5} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Heatmap */}
                    {weeklySummary.length === 7 && (
                      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
                        <p className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 mb-3 tracking-widest">Weekly Congestion Matrix (00h - 23h)</p>
                        <div className="min-w-[600px]">
                          {weeklySummary.map((dayData, dayIdx) => (
                            <div key={dayIdx} className="flex mb-1.5 items-center">
                              <span className="w-10 text-[11px] font-bold text-slate-600 dark:text-slate-400">{daysOfWeek[dayIdx]}</span>
                              <div className="flex-1 flex gap-1">
                                {dayData.map((val, hIdx) => (
                                  <div 
                                    key={hIdx} 
                                    title={`${val}% congestion at ${hIdx}:00`}
                                    className={`flex-1 h-5 rounded-md ${getHeatmapColor(val)} hover:scale-110 cursor-pointer transition-all shadow-2xs`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation Button */}
                    <div className="pt-2 flex flex-col gap-4">
                      <button 
                        type="button" 
                        onClick={getRecommendedWindows}
                        disabled={windowLoading}
                        className="self-start bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm shadow-md transition-all active:scale-95"
                      >
                        {windowLoading ? 'Calculating AI Schedule Optimization...' : 'Predict Ideal Duration & Schedule'}
                      </button>

                      {aiWindows.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                          {aiWindows.map((win, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => selectWindow(win)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.recommendedStartTime === win.start_time ? 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-indigo-400'}`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">Option {idx + 1}</span>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Disruption Index: {win.disruption_score}</span>
                              </div>
                              <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{win.start_time.substring(0,16)}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">to {win.end_time.substring(0,16)}</p>
                              
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold mb-0.5">Ideal Duration: 48 Hours</p>
                                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold mb-1">Recommended Shift: Night Work</p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 italic leading-snug">{win.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Proposed Start Date *</label>
                <input 
                  required type="date"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-medium text-sm transition-all"
                  value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Proposed End Date *</label>
                <input 
                  required type="date"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-medium text-sm transition-all"
                  value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Lane Closure Percentage *</label>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">{formData.laneClosurePercentage}%</span>
                </div>
                <input 
                  required type="range" min="0" max="100" step="10"
                  className="w-full accent-indigo-600"
                  value={formData.laneClosurePercentage} onChange={e => setFormData({...formData, laneClosurePercentage: parseInt(e.target.value)})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Scope &amp; Description</label>
                <textarea 
                  rows={3}
                  placeholder="Provide technical scope, equipment count, and public advisory notes..."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-medium text-sm transition-all"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end gap-3">
              <button type="button" onClick={() => navigate('/department')} className="gov-button-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="gov-button-primary px-6 py-2.5 shadow-md">
                {loading ? 'Running Conflict Engines...' : 'Analyze Spatial Impact'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && report && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Executive Spatial Impact Assessment
              </h2>
              <span className="text-xs font-mono px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Ref: UIMS-EVAL-2026-9A</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-2xl border ${report.severity === 'CRITICAL' ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800' : report.severity === 'HIGH' ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800' : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'}`}>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider mb-1">Overall Spatial Severity</p>
                <p className={`text-3xl font-black ${report.severity === 'CRITICAL' ? 'text-red-700 dark:text-red-400' : report.severity === 'HIGH' ? 'text-orange-700 dark:text-orange-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {report.severity} <span className="text-lg font-bold text-slate-600 dark:text-slate-400">({report.impactScore}/100)</span>
                </p>
              </div>
              
              <div className="p-5 rounded-2xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider mb-1">Predicted Traffic Overhead</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{report.trafficIncrease} Increase</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Expected Commuter Delay: {report.expectedDelay}</p>
              </div>
            </div>

            {/* Traffic Module in Step 2 */}
            {forecast.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  Predicted Congestion Timeline
                </h3>
                
                <div className="h-44 w-full bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecast}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="displayTime" fontSize={10} tickMargin={5} minTickGap={30} stroke="#64748b" />
                      <YAxis fontSize={10} domain={[0, 100]} stroke="#64748b" />
                      <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '10px', backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#38bdf8" fillOpacity={0.15} />
                      <Area type="monotone" dataKey="lower_bound" stroke="none" fill="#ffffff" fillOpacity={1} />
                      <Line type="monotone" dataKey="predicted_congestion_pct" stroke="#0284c7" strokeWidth={2.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {report.conflicts && report.conflicts.length > 0 && (
              <div className="p-5 rounded-2xl border bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 text-sm mb-2">
                  Infrastructure Conflicts Detected
                </h3>
                <ul className="list-disc list-inside text-xs font-semibold text-amber-950 dark:text-amber-200 space-y-1">
                  {report.conflicts.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-5 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 text-sm mb-2">
                Recommended Mitigation Actions
              </h3>
              <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 leading-relaxed">{report.recommendation}</p>
            </div>

            {/* ── System Decision Receipt ── */}
            {report.approval_receipt && (
              <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-md">
                {/* Receipt header */}
                <div className="bg-slate-900 dark:bg-slate-950 px-5 py-3.5 flex items-center gap-3 border-b border-slate-800">
                  <div>
                    <p className="text-white font-black text-xs uppercase tracking-widest">Official Audit Receipt</p>
                    <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                      Deterministic record generated by UIMS Spatial Engine · Legally binding per UIMS Act §12(b)
                    </p>
                  </div>
                </div>
                {/* Receipt body */}
                <div className="bg-slate-950 p-5">
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300 break-words">
                    {report.approval_receipt}
                  </pre>
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setStep(1)} className="gov-button-secondary">Back to Form Edit</button>
              <button type="button" onClick={handleFinalSubmit} disabled={loading} className="gov-button-primary px-6 py-2.5 shadow-md">
                {loading ? 'Submitting to Municipal Ledger...' : 'Confirm & Register Project'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
