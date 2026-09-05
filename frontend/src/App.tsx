import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GovLayout from './components/Layout/GovLayout';
import GovLanding from './pages/GovLanding';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/Citizen/CitizenDashboard';
import ComplaintForm from './pages/Citizen/ComplaintForm';
import DepartmentDashboard from './pages/Department/DepartmentDashboard';
import ProjectProposalForm from './pages/Department/ProjectProposalForm';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GovLayout />}>
            <Route index element={<GovLanding />} />
            <Route path="gov" element={<GovLanding />} />
            <Route path="login" element={<Login />} />
            <Route path="gov/login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="gov/register" element={<Register />} />
            
            {/* Nav Aliases */}
            <Route path="complaints" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DEPARTMENT']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="projects" element={
              <ProtectedRoute allowedRoles={['ROLE_DEPARTMENT', 'ROLE_ADMIN']}>
                <DepartmentDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="citizen" element={
              <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
                <CitizenDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="citizen/complaint/new" element={
              <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
                <ComplaintForm />
              </ProtectedRoute>
            } />
            
            <Route path="department" element={
              <ProtectedRoute allowedRoles={['ROLE_DEPARTMENT']}>
                <DepartmentDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="department/project/new" element={
              <ProtectedRoute allowedRoles={['ROLE_DEPARTMENT', 'ROLE_ADMIN']}>
                <ProjectProposalForm />
              </ProtectedRoute>
            } />
            
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
