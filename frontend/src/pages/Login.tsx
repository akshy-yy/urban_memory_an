import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-navy)]">UIMS Portal Login</h2>
          <p className="text-sm text-gray-500 mt-2">Sign in to access your dashboard</p>
        </div>
        
        {error && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">{error}</div>}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-navy)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-navy)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full gov-button-primary mt-6 flex justify-center items-center"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-4 text-sm">
          <span className="text-gray-600">Don't have an official account? </span>
          <Link to="/register" className="text-[var(--color-navy)] font-bold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
