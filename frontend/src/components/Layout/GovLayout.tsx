import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function GovLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header - Saffron Strip */}
      <div className="bg-[var(--color-saffron)] h-2 w-full"></div>
      
      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and Title */}
            <div className="flex items-center">
              <Link to="/gov" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-navy)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  U
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[var(--color-navy)] leading-tight">UIMS</h1>
                  <p className="text-xs text-gray-500 font-medium">Urban Infrastructure Memory System</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[var(--color-navy)] font-medium">Map View</Link>
              <Link to="/complaints" className="text-gray-700 hover:text-[var(--color-navy)] font-medium">Complaints</Link>
              <Link to="/projects" className="text-gray-700 hover:text-[var(--color-navy)] font-medium">Projects</Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-[var(--color-navy)] p-2 rounded-full">
                <Bell size={20} />
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-[var(--color-navy)]">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role.replace('ROLE_', '')}</p>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/gov/login');
                    }} 
                    className="flex items-center gap-2 text-sm font-medium gov-button-secondary"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/gov/login" className="flex items-center gap-2 text-sm font-medium gov-button-primary">
                  <User size={16} />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
              
              <button className="md:hidden text-gray-500 hover:text-[var(--color-navy)] p-2">
                <Menu size={24} />
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>

      {/* Footer - Green Strip */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Urban Infrastructure Memory System. All rights reserved.</p>
        </div>
        <div className="bg-[var(--color-green)] h-2 w-full"></div>
      </footer>
    </div>
  );
}
