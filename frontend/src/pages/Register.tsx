import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Building, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_DEPARTMENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Mock registration using localStorage
      const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      if (users.find((u: any) => u.email === email)) {
        throw new Error('Email is already registered');
      }
      
      const newUser = {
        name,
        email,
        password,
        role,
        departmentId: role === 'ROLE_DEPARTMENT' ? 1 : null
      };
      
      users.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(users));
      
      // Auto redirect to login
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' }});
      
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 transition-colors relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400"></div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/40 text-[var(--color-navy)] dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UserPlus size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Official Registration</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create an authorized municipal or agency account</p>
        </div>
        
        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 text-xs font-semibold">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={16} />
              </div>
              <input 
                type="text" 
                required 
                placeholder="Er. Rajesh Kumar"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Official Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input 
                type="email" 
                required 
                placeholder="rajesh.k@pwd.gov.in"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Role / Department Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Building size={16} />
              </div>
              <select 
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="ROLE_DEPARTMENT">Department Official (PWD, Water, BESCOM)</option>
                <option value="ROLE_ADMIN">Municipal System Administrator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={16} />
              </div>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-sm"
          >
            {loading ? 'Creating Profile...' : 'Register Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-6 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Already have an official account? </span>
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
