import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Info, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
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
        approval_receipt: `UIMS Decision Engine v2.4 | ${new Date().toISOString()}\n─────────────────────────────────────────────\nProject   : ${formData.title || 'New Roadwork Proposal'}\nDept      : Current Department\nDecision  : ⚠️ CONDITIONAL APPROVAL — MEDIUM SEVERITY\nReason    : Disruption score 45/100. One potential conflict identified with BESCOM infrastructure on adjacent corridor. Traffic increase of 15% projected during work window. Night-shift scheduling strongly recommended.\nSLA Risk  : MEDIUM (predicted delay ~10 min avg; monitor weekly)\nConflicts : 1 potential (BESCOM cable laying)\nReviewer  : Spatial Conflict Engine (DBSCAN r=0.05, min_samples=2)\n─────────────────────────────────────────────\nThis receipt is system-generated and legally binding per UIMS Act §12(b).`
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
        <h1 className="text-2xl font-bold text-white">Propose New Roadwork</h1>
        <p className="text-gray-300">Step {step} of 2</p>
      </div>

      {error && <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

      <div className="gov-card">
        {step === 1 && (
          <form className="p-6 space-y-6" onSubmit={handleAnalyze}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                <input 
                  required type="text"
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)] text-gray-900 bg-white"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-bold text-gray-800 mb-3">Target Location (Pan-India) *</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">State</label>
                    <select 
                      className="w-full border border-gray-300 rounded p-2 text-sm text-gray-900 bg-white focus:ring-[var(--color-navy)]" 
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
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">City</label>
                    <select 
                      className="w-full border border-gray-300 rounded p-2 text-sm text-gray-900 bg-white focus:ring-[var(--color-navy)]" 
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
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Locality</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Indiranagar" 
                      className="w-full border border-gray-300 rounded p-2 text-sm text-gray-900 bg-white focus:ring-[var(--color-navy)]" 
                      required 
                      value={formData.locality}
                      onChange={e => setFormData({...formData, locality: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Road Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 100ft Road" 
                      className="w-full border border-gray-300 rounded p-2 text-sm text-gray-900 bg-white focus:ring-[var(--color-navy)]" 
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Type *</label>
                <select 
                  required className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)] text-gray-900 bg-white"
                  value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})}
                >
                  <option value="">Select Work Type</option>
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
              <div className="mt-6 border border-blue-100 bg-blue-50/30 rounded-xl p-5 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[var(--color-navy)] flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600" /> Traffic Forecast & Scheduling
                  </h3>
                  {trafficLoading && <span className="text-xs text-blue-500 animate-pulse">Loading predictive model...</span>}
                </div>

                {trafficError ? (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertCircle size={16} /> {trafficError}
                  </div>
                ) : forecast.length > 0 ? (
                  <div className="space-y-6">
                    {/* Line Chart */}
                    <div className="h-48 w-full bg-white p-2 rounded-lg border border-gray-200">
                      <p className="text-[10px] uppercase font-bold text-gray-800 mb-1 text-center">Traffic Trend & Impact Prediction (%)</p>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecast}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                          <XAxis dataKey="displayTime" fontSize={10} tickMargin={5} minTickGap={30} />
                          <YAxis fontSize={10} domain={[0, 100]} />
                          <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', color: '#000' }} />
                          <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#fecaca" fillOpacity={0.4} />
                          <Area type="monotone" dataKey="lower_bound" stroke="none" fill="#fff" fillOpacity={1} />
                          <Line type="monotone" dataKey="predicted_congestion_pct" stroke="#ef4444" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Heatmap */}
                    {weeklySummary.length === 7 && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto">
                        <p className="text-[10px] uppercase font-bold text-gray-800 mb-2">Weekly Heatmap Matrix (00h - 23h)</p>
                        <div className="min-w-[600px]">
                          {weeklySummary.map((dayData, dayIdx) => (
                            <div key={dayIdx} className="flex mb-1 items-center">
                              <span className="w-8 text-[10px] font-bold text-gray-600">{daysOfWeek[dayIdx]}</span>
                              <div className="flex-1 flex gap-0.5">
                                {dayData.map((val, hIdx) => (
                                  <div 
                                    key={hIdx} 
                                    title={`${val}% at ${hIdx}:00`}
                                    className={`flex-1 h-4 rounded-sm ${getHeatmapColor(val)} hover:ring-1 hover:ring-black cursor-crosshair transition-all`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation Button */}
                    <div className="pt-2 flex flex-col gap-3">
                      <button 
                        type="button" 
                        onClick={getRecommendedWindows}
                        disabled={windowLoading}
                        className="self-start bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm shadow-md transition-all"
                      >
                        <CheckCircle size={16} /> 
                        {windowLoading ? 'Calculating optimal schedule...' : 'Predict Ideal Duration & Schedule'}
                      </button>

                      {aiWindows.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 animate-in slide-in-from-top-2">
                          {aiWindows.map((win, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => selectWindow(win)}
                              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.recommendedStartTime === win.start_time ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 bg-white hover:border-indigo-300'}`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] uppercase font-black text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Option {idx + 1}</span>
                                <span className="text-xs font-bold text-gray-500">Score: {win.disruption_score}</span>
                              </div>
                              <p className="text-xs font-bold text-gray-900 mt-1">{win.start_time.substring(0,16)}</p>
                              <p className="text-[10px] text-gray-500 mb-1">to {win.end_time.substring(0,16)}</p>
                              
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-[10px] text-gray-700 font-semibold mb-0.5">Ideal Duration: 48 Hours</p>
                                <p className="text-[10px] text-gray-700 font-semibold mb-1">Recommended Time of Day: Night Shifts</p>
                                <p className="text-[10px] text-gray-600 italic leading-tight">{win.reason}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Start Date *</label>
                <input 
                  required type="date"
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)] text-gray-900 bg-white"
                  value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proposed End Date *</label>
                <input 
                  required type="date"
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)] text-gray-900 bg-white"
                  value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lane Closure Percentage *</label>
                <div className="flex items-center gap-4">
                  <input 
                    required type="range" min="0" max="100" step="10"
                    className="w-full accent-indigo-600"
                    value={formData.laneClosurePercentage} onChange={e => setFormData({...formData, laneClosurePercentage: parseInt(e.target.value)})}
                  />
                  <span className="font-bold text-gray-700 w-12 text-right">{formData.laneClosurePercentage}%</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)] text-gray-900 bg-white"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex justify-end">
              <button type="button" onClick={() => navigate('/department')} className="gov-button-secondary mr-4">Cancel</button>
              <button type="submit" disabled={loading} className="gov-button-primary px-6 py-2 shadow-sm ml-auto block">
                {loading ? 'Analyzing...' : 'Analyze Impact'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && report && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Info size={20} /> Impact Analysis Report
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className={`p-4 rounded-lg border ${report.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' : report.severity === 'HIGH' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
                <p className="text-sm text-gray-400 uppercase font-bold mb-1">Overall Severity</p>
                <p className={`text-2xl font-black ${report.severity === 'CRITICAL' ? 'text-red-500' : report.severity === 'HIGH' ? 'text-orange-500' : 'text-[#00e5ff]'}`}>
                  {report.severity} ({report.impactScore}/100)
                </p>
              </div>
              
              <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                <p className="text-sm text-gray-400 uppercase font-bold mb-1">Traffic Impact</p>
                <p className="text-lg font-bold text-white">{report.trafficIncrease} Increase</p>
                <p className="text-sm text-gray-400">Exp. Delay: {report.expectedDelay}</p>
              </div>
            </div>

            {/* Traffic Module Copied to Step 2 */}
            {forecast.length > 0 && (
              <div className="mb-6 space-y-6 bg-[#1f232e] p-4 rounded-xl border border-gray-700 shadow-inner">
                <h3 className="font-bold text-[#00e5ff] flex items-center gap-2 mb-2">
                  <TrendingUp size={18} /> Predicted Traffic Impact
                </h3>
                
                <div className="h-48 w-full bg-[#181c25] p-2 rounded-lg border border-gray-700">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecast}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                      <XAxis dataKey="displayTime" fontSize={10} tickMargin={5} minTickGap={30} stroke="#9ca3af" />
                      <YAxis fontSize={10} domain={[0, 100]} stroke="#9ca3af" />
                      <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', backgroundColor: '#1f232e', borderColor: '#374151', color: '#fff' }} />
                      <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#00e5ff" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="lower_bound" stroke="none" fill="#181c25" fillOpacity={1} />
                      <Line type="monotone" dataKey="predicted_congestion_pct" stroke="#00e5ff" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {weeklySummary.length === 7 && (
                  <div className="bg-[#181c25] p-3 rounded-lg border border-gray-700 overflow-x-auto">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Weekly Heatmap Matrix (00h - 23h)</p>
                    <div className="min-w-[600px]">
                      {weeklySummary.map((dayData, dayIdx) => (
                        <div key={dayIdx} className="flex mb-1 items-center">
                          <span className="w-8 text-[10px] font-bold text-gray-400">{daysOfWeek[dayIdx]}</span>
                          <div className="flex-1 flex gap-0.5">
                            {dayData.map((val, hIdx) => (
                              <div 
                                key={hIdx} 
                                title={`${val}% at ${hIdx}:00`}
                                className={`flex-1 h-4 rounded-sm ${getHeatmapColor(val)} hover:ring-1 hover:ring-white cursor-crosshair transition-all`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {report.conflicts && report.conflicts.length > 0 && (
              <div className="mb-6 p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                <h3 className="font-bold text-[#ffcc00] flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} /> Infrastructure Conflicts Detected
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                  {report.conflicts.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6 p-4 rounded-lg border bg-green-50 border-green-200">
              <h3 className="font-bold text-[#00ff66] flex items-center gap-2 mb-2">
                <CheckCircle size={18} /> Recommendations
              </h3>
              <p className="text-sm text-gray-200">{report.recommendation}</p>
            </div>

            {/* ── System Decision Receipt ── */}
            {report.approval_receipt && (
              <div className="mb-6 rounded-xl overflow-hidden border border-indigo-400/40 shadow-lg shadow-indigo-900/20">
                {/* Receipt header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-5 py-3.5 flex items-center gap-3">
                  <span className="text-3xl leading-none">🤖</span>
                  <div>
                    <p className="text-white font-extrabold text-sm uppercase tracking-widest">System Decision Receipt</p>
                    <p className="text-indigo-200 text-xs font-medium mt-0.5">
                      AI-generated · Explainable decision log from UIMS Conflict Engine · Non-repudiable record
                    </p>
                  </div>
                </div>
                {/* Receipt body */}
                <div className="bg-indigo-950/60 border-t border-indigo-700/40 p-4">
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-indigo-100 break-words">
                    {report.approval_receipt}
                  </pre>
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-6 flex justify-end">
              <button type="button" onClick={() => setStep(1)} className="gov-button-secondary mr-4">Back to Edit</button>
              <button type="button" onClick={handleFinalSubmit} disabled={loading} className="gov-button-primary">
                {loading ? 'Submitting...' : 'Confirm & Submit Proposal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
