import { useState } from 'react';
import { AlertTriangle, Send, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveComplaintAndSync, type ComplaintItem } from '../../data/complaintsData';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComplaint: ComplaintItem = {
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
      status: 'Pending'
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
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Karnataka"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">City</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bangalore"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
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

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Upload Relevant Images (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl p-2 focus:ring-2 focus:ring-red-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                onChange={(e) => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})}
              />
              {formData.image && <p className="text-xs text-green-600 mt-2">Selected: {formData.image.name}</p>}
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 p-6 rounded-2xl">
              <label className="block flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Urgency Level</span>
                <span className={`text-lg font-black ${formData.urgency >= 8 ? 'text-red-600' : formData.urgency >= 5 ? 'text-orange-500' : 'text-blue-500'}`}>
                  {formData.urgency} / 10
                </span>
              </label>
              
              <input 
                type="range" 
                min="1" max="10" 
                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: parseInt(e.target.value)})}
              />
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                <span>1 - Minor Issue</span>
                <span>5 - Moderate Hazard</span>
                <span>10 - Critical Emergency</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
