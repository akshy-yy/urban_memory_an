import { useAuth } from '../../context/AuthContext';
import { AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CitizenDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)]">Citizen Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <Link to="/citizen/complaint/new" className="gov-button-primary flex items-center gap-2">
          <AlertCircle size={18} />
          Report New Issue
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="gov-card">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <FileText className="text-[var(--color-navy)]" size={20} />
              <h2 className="font-bold text-lg text-[var(--color-navy)]">My Complaints</h2>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-md p-4 mb-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">Deep Pothole near Metro Station</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold text-xs">INSPECTION SCHEDULED</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Location: Outer Ring Road, Sector 3</p>
                <p className="text-xs text-gray-400">Reported on: 12 Oct 2023</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">Water Leakage</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-xs">RESOLVED</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Location: Main Market Road</p>
                <p className="text-xs text-gray-400">Reported on: 05 Sep 2023</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="gov-card">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-bold text-lg text-[var(--color-navy)]">Local Alerts</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-sm">
                <p className="font-bold text-red-800">Road Closure</p>
                <p className="text-red-700 mt-1">MG Road will be closed on Oct 20 for metro work.</p>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded text-sm">
                <p className="font-bold text-yellow-800">Traffic Delay</p>
                <p className="text-yellow-700 mt-1">Heavy traffic expected near IT Park due to pipeline repair.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
