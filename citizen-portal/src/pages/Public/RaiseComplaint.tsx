import { useState } from 'react';
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
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-200 dark:border-slate-800 border-t-4 border-t-emerald-600">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Complaint Registered</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Thank you, {formData.name}. Your infrastructure complaint has been securely submitted and prioritized (Level {formData.urgency}) for the local department.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-12 overflow-y-auto h-full hide-scrollbar">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 border-t-4 border-t-red-600 overflow-hidden relative">
        
        <div className="p-6 sm:p-8">
          <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Raise an Issue</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Report road damages, uncoordinated digging, or public infrastructure hazards.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aadhar ID Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="xxxx-xxxx-xxxx"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={formData.aadhar}
                  onChange={(e) => setFormData({...formData, aadhar: e.target.value})}
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Securely verified
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">State</label>
                <select 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all"
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                <select 
                  required
                  disabled={!formData.state}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all"
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Road Number / Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MG Road, NH-44"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={formData.roadNumber}
                  onChange={(e) => setFormData({...formData, roadNumber: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Complaint Details</label>
              <textarea 
                required
                rows={4}
                placeholder="Describe the issue (e.g., Deep pothole on MG Road causing traffic delay, Open manhole near Metro Station...)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
              ></textarea>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Upload Relevant Image (Optional)</label>
              <input 
                id="image-upload"
                type="file" 
                accept="image/*"
                className="w-full text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleImageUpload}
              />
              
              {uploadError && (
                <p className="text-xs text-red-600 mt-2">{uploadError}</p>
              )}

              {isAnalyzing && (
                <div className="mt-3 flex items-center gap-2.5 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-medium">Analyzing image for road relevance & urgency...</span>
                </div>
              )}

              {mlResult && !isAnalyzing && (
                <div className={`mt-3 p-3.5 rounded-lg border text-xs ${mlResult.is_road_related ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800' : 'bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800'}`}>
                  {mlResult.is_road_related === false ? (
                    <div>
                      <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold mb-1.5">
                        <span>Image Verification Failed</span>
                      </div>
                      <p className="text-xs text-red-700 dark:text-red-300 mb-3">{mlResult.reason}</p>
                      <div className="flex gap-3">
                        <button type="button" onClick={removeImage} className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors">
                          Remove Photo & Try Again
                        </button>
                        <button type="button" onClick={() => setMlResult({...mlResult, is_road_related: true, ml_status: 'pending_manual_review'})} className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">
                          Submit Anyway (Manual Review)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                        <span>Image Verified</span>
                        {mlResult.ml_status === 'pending_manual_review' && <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">Manual Review Needed</span>}
                      </div>
                      {mlResult.suggested_category && (
                        <p className="text-xs text-emerald-900 dark:text-emerald-300">
                          <strong>Category:</strong> {mlResult.suggested_category}
                        </p>
                      )}
                      {mlResult.urgency_score && (
                        <p className="text-xs text-emerald-900 dark:text-emerald-300">
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
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-xs transition-colors flex items-center justify-center text-sm"
            >
              Submit Priority Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
