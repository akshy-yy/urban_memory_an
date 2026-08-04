import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

export default function ProjectProposalForm() {
  const { token } = useAuth();
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
    startDate: '',
    endDate: '',
    laneClosurePercentage: 0
  });

  // Analysis Report
  const [report, setReport] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        roadId: parseInt(formData.roadId),
        laneClosurePercentage: parseInt(formData.laneClosurePercentage.toString())
      };

      const response = await axios.post('http://localhost:8080/api/projects/analyze', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReport(response.data);
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
      const payload = {
        ...formData,
        roadId: parseInt(formData.roadId),
        laneClosurePercentage: parseInt(formData.laneClosurePercentage.toString())
      };

      await axios.post('http://localhost:8080/api/projects', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Project proposed successfully!');
      navigate('/department');
    } catch (err) {
      setError('Failed to submit project proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Propose New Roadwork</h1>
        <p className="text-gray-600">Step {step} of 2</p>
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
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Type *</label>
                <select 
                  required className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Road *</label>
                <select 
                  required className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
                  value={formData.roadId} onChange={e => setFormData({...formData, roadId: e.target.value})}
                >
                  <option value="">Select Road</option>
                  <option value="1">MG Road (Arterial)</option>
                  <option value="2">Brigade Road (Sub-arterial)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Select from interactive map in future updates.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input 
                  required type="date"
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
                  value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input 
                  required type="date"
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
                  value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lane Closure Percentage *</label>
                <div className="flex items-center gap-4">
                  <input 
                    required type="range" min="0" max="100" step="10"
                    className="w-full"
                    value={formData.laneClosurePercentage} onChange={e => setFormData({...formData, laneClosurePercentage: parseInt(e.target.value)})}
                  />
                  <span className="font-bold text-gray-700 w-12 text-right">{formData.laneClosurePercentage}%</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex justify-end">
              <button type="button" onClick={() => navigate('/department')} className="gov-button-secondary mr-4">Cancel</button>
              <button type="submit" disabled={loading} className="bg-[var(--color-saffron)] text-white px-4 py-2 rounded font-medium hover:bg-orange-600 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-saffron)]">
                {loading ? 'Analyzing...' : 'Analyze Impact'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && report && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4 flex items-center gap-2">
              <Info size={20} /> Impact Analysis Report
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className={`p-4 rounded-lg border ${report.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' : report.severity === 'HIGH' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
                <p className="text-sm text-gray-600 uppercase font-bold mb-1">Overall Severity</p>
                <p className={`text-2xl font-black ${report.severity === 'CRITICAL' ? 'text-red-700' : report.severity === 'HIGH' ? 'text-orange-700' : 'text-blue-700'}`}>
                  {report.severity} ({report.impactScore}/100)
                </p>
              </div>
              
              <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                <p className="text-sm text-gray-600 uppercase font-bold mb-1">Traffic Impact</p>
                <p className="text-lg font-bold text-gray-800">{report.trafficIncrease} Increase</p>
                <p className="text-sm text-gray-500">Exp. Delay: {report.expectedDelay}</p>
              </div>
            </div>

            {report.conflicts && report.conflicts.length > 0 && (
              <div className="mb-6 p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} /> Infrastructure Conflicts Detected
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-900 space-y-1">
                  {report.conflicts.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6 p-4 rounded-lg border bg-green-50 border-green-200">
              <h3 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                <CheckCircle size={18} /> Recommendations
              </h3>
              <p className="text-sm text-green-900">{report.recommendation}</p>
            </div>

            <div className="border-t border-gray-200 pt-6 flex justify-end">
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
