import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Mock login using localStorage
      const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      let user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
         // Also allow the hardcoded default mock accounts
         if (email === 'admin@uims.gov.in' && password === 'admin123') {
           user = { email, name: 'Super Admin', role: 'ROLE_ADMIN', id: 999 };
         } else if (email === 'pwd@uims.gov.in' && password === 'pwd123') {
           user = { email, name: 'PWD Official', role: 'ROLE_DEPARTMENT', id: 888, departmentId: 1 };
         } else {
           throw new Error('Invalid email or password');
         }
      }
      
      const mockToken = 'mock-jwt-token-12345';
      login(mockToken, { id: user.id || Math.floor(Math.random() * 1000), name: user.name, role: user.role, departmentId: user.departmentId });
      
      // Redirect based on role
      if (user.role === 'ROLE_DEPARTMENT') navigate('/department');
      else if (user.role === 'ROLE_ADMIN') navigate('/admin');
      else navigate('/citizen');
      
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 border-t-4 border-t-blue-900 transition-colors relative overflow-hidden">
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Official Sign In</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Authorized Municipal & Department Personnel</p>
        </div>
        
        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 text-xs font-medium">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="official@uims.gov.in"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">Admin Demo:</span> admin@uims.gov.in / admin123</div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">PWD Official Demo:</span> pwd@uims.gov.in / pwd123</div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold shadow-xs transition-colors flex justify-center items-center gap-2 text-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-6 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Need to register a department profile? </span>
          <Link to="/register" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
