import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ComplaintForm() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [roadId, setRoadId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, we'd get lat/lng from a map picker or geolocation API
      // Here we hardcode for demo purposes
      const payload = {
        category,
        description,
        roadId: parseInt(roadId),
        lat: 28.6139,
        lng: 77.2090
      };

      await axios.post('http://localhost:8080/api/complaints', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Complaint submitted successfully!');
      navigate('/citizen');
    } catch (err) {
      setError('Failed to submit complaint. Please check the inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="gov-card">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-xl text-[var(--color-navy)]">Report a Civic Issue</h2>
        </div>
        
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Category *</label>
            <select 
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Potholes">Potholes</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Illegal Digging">Illegal Digging</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Streetlight">Streetlight Issue</option>
              <option value="Drainage">Drainage</option>
              <option value="Garbage">Garbage Dump</option>
              <option value="Traffic Signal">Traffic Signal Defect</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Road *</label>
            <select 
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
              value={roadId}
              onChange={(e) => setRoadId(e.target.value)}
            >
              <option value="">Select a road (mock data)</option>
              <option value="1">MG Road (Ward 42)</option>
              <option value="2">Brigade Road</option>
              <option value="3">Outer Ring Road</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">In a full implementation, you would select this directly from the interactive map.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              required
              rows={4}
              placeholder="Please provide details about the issue..."
              className="w-full border border-gray-300 rounded p-2 focus:ring-[var(--color-navy)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo Evidence</label>
            <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[var(--color-navy)] hover:file:bg-blue-100" />
          </div>

          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button type="button" onClick={() => navigate(-1)} className="gov-button-secondary mr-4">Cancel</button>
            <button type="submit" disabled={loading} className="gov-button-primary">
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
