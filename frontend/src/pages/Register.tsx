import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-50 px-4 pt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-navy)]">Official Registration</h2>
          <p className="text-sm text-gray-500 mt-2">Create an account for the UIMS Portal</p>
        </div>
        
        {error && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">{error}</div>}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              required 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-navy)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-navy)]"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ROLE_DEPARTMENT">Department Official</option>
              <option value="ROLE_ADMIN">System Administrator</option>
            </select>
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
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-[var(--color-navy)] font-bold hover:underline">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
