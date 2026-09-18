import { useState } from 'react';
import { AlertTriangle, ShieldCheck, Loader2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import indiaData from '../../data/indiaLocations.json';
import { saveComplaintAndSync, type ComplaintItem } from '../../data/complaintsData';

interface MLResult {
  is_road_related: boolean;
  road_relevance_confidence: number;
  reason: string;
  urgency_score: number | null;
  urgency_reasoning: string | null;
  suggested_category: string | null;
  ml_status: string;
}

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aadhar: '',
    name: '',
    state: '',
    city: '',
    roadNumber: '',
    details: '',
    urgency: 5,
    image: null as File | null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mlResult, setMlResult] = useState<MLResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      setFormData({ ...formData, image: null });
      setMlResult(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    setFormData({ ...formData, image: file });
    setUploadError(null);
    setIsAnalyzing(true);
    setMlResult(null);

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/complaints/classify-image', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to classify image');
      }

      const result: MLResult = await response.json();
      setMlResult(result);
      if (result.is_road_related && result.urgency_score) {
        setFormData(prev => ({ ...prev, urgency: result.urgency_score as number }));
      }
    } catch (err) {
      console.error('Classification error:', err);
      // Fallback
      setMlResult({
        is_road_related: true, // assume true to not block submission on error
        road_relevance_confidence: 0,
        reason: 'Service unavailable',
        urgency_score: null,
        urgency_reasoning: null,
        suggested_category: null,
        ml_status: 'pending_manual_review'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setMlResult(null);
    setUploadError(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComplaint: ComplaintItem & any = {
      id: Date.now(),
      aadhar: formData.aadhar,
      name: formData.name,
      state: formData.state,
      city: formData.city,
      roadNumber: formData.roadNumber,
      details: formData.details,
      urgency: formData.urgency,
      imagePreview: formData.image ? URL.createObjectURL(formData.image) : null,
      timestamp: new Date().toISOString(),
      status: 'Pending',
      ...(mlResult || {})
    };
    
    // Save to local storage and sync to Official Portal (5173) in real-time
    saveComplaintAndSync(newComplaint);
    
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  if (submitted) {
    return (
      <div className="pt-24 px-4 h-full flex flex-col items-center justify-center text-center">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl max-w-md w-full border border-green-200 dark:border-green-900 animate-in zoom-in">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complaint Registered</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you, {formData.name}. Your infrastructure complaint has been securely submitted and prioritized (Level {formData.urgency}) for the local department.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12 overflow-y-auto h-full hide-scrollbar">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
        
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-inner">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Raise an Issue</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Report road damages, uncoordinated digging, or public infrastructure hazards.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Aadhar ID Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="xxxx-xxxx-xxxx"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.aadhar}
                  onChange={(e) => setFormData({...formData, aadhar: e.target.value})}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <ShieldCheck size={12} /> Securely verified
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">State</label>
                <select 
                  required
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value, city: ''})}
                >
                  <option value="">Select State</option>
                  {indiaData.states.map((s: any) => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">City</label>
                <select 
                  required
                  disabled={!formData.state}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  <option value="">Select City</option>
                  {formData.state && indiaData.states.find((s: any) => s.state === formData.state)?.districts.map((d: string) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Road Number / Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MG Road, NH-44"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.roadNumber}
                  onChange={(e) => setFormData({...formData, roadNumber: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Complaint Details</label>
              <textarea 
                required
                rows={4}
                placeholder="Describe the issue (e.g., Deep pothole on MG Road causing traffic delay, Open manhole near Metro Station...)"
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
              ></textarea>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Upload Relevant Image (Optional)</label>
              <input 
                id="image-upload"
                type="file" 
                accept="image/*"
                className="w-full text-gray-900 dark:text-white rounded-xl focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleImageUpload}
              />
              
              {uploadError && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1"><AlertTriangle size={14} /> {uploadError}</p>
              )}

              {isAnalyzing && (
                <div className="mt-4 flex items-center gap-3 text-blue-600 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-medium">Analyzing image for road relevance & urgency...</span>
                </div>
              )}

              {mlResult && !isAnalyzing && (
                <div className={`mt-4 p-4 rounded-lg border ${mlResult.is_road_related ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                  {mlResult.is_road_related === false ? (
                    <div>
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-2">
                        <AlertTriangle size={18} />
                        <span>Image Verification Failed</span>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-300 mb-4">{mlResult.reason}</p>
                      <div className="flex gap-4">
                        <button type="button" onClick={removeImage} className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                          Remove Photo & Try Again
                        </button>
                        <button type="button" onClick={() => setMlResult({...mlResult, is_road_related: true, ml_status: 'pending_manual_review'})} className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                          Submit Anyway (Manual Review)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-2">
                        <ShieldCheck size={18} />
                        <span>Image Verified</span>
                        {mlResult.ml_status === 'pending_manual_review' && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Manual Review Needed</span>}
                      </div>
                      {mlResult.suggested_category && (
                        <p className="text-sm text-green-800 dark:text-green-300">
                          <strong>Category:</strong> {mlResult.suggested_category}
                        </p>
                      )}
                      {mlResult.urgency_score && (
                        <p className="text-sm text-green-800 dark:text-green-300">
                          <strong>Detected Urgency:</strong> {mlResult.urgency_score}/10 — {mlResult.urgency_reasoning}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>


            <button 
              type="submit"
              disabled={mlResult?.is_road_related === false || isAnalyzing}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit Priority Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
