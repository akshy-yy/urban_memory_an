import { useAuth } from '../../context/AuthContext';
import { PlusCircle, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DepartmentDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Department Portal</h1>
        <p className="text-gray-600">Welcome, {user?.name}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link to="/department/project/new" className="gov-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <PlusCircle className="text-[var(--color-navy)]" size={32} />
          <span className="font-semibold text-gray-800">Propose New Work</span>
        </Link>
        <button className="gov-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <FileText className="text-[var(--color-saffron)]" size={32} />
          <span className="font-semibold text-gray-800">Review Complaints</span>
        </button>
        <div className="gov-card p-4 flex flex-col items-center justify-center gap-2 bg-green-50 border-green-200">
          <CheckCircle className="text-green-600" size={32} />
          <span className="font-semibold text-green-800">12 Active Projects</span>
        </div>
        <div className="gov-card p-4 flex flex-col items-center justify-center gap-2 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="text-yellow-600" size={32} />
          <span className="font-semibold text-yellow-800">3 Conflicts Detected</span>
        </div>
      </div>

      {/* Active Projects Table */}
      <div className="gov-card">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-lg text-[var(--color-navy)]">Ongoing Projects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Project Title</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Completion Date</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Pipeline Relaying Phase 2</td>
                <td className="px-6 py-4">MG Road, Ward 42</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold text-xs">IN PROGRESS</span></td>
                <td className="px-6 py-4">2023-11-15</td>
                <td className="px-6 py-4"><button className="text-blue-600 hover:underline">Update</button></td>
              </tr>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Pothole Repair</td>
                <td className="px-6 py-4">Brigade Road</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-xs">COMPLETED</span></td>
                <td className="px-6 py-4">2023-10-01</td>
                <td className="px-6 py-4"><button className="text-blue-600 hover:underline">View Report</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
