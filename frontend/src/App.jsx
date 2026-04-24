import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import ExpertDashboard from './pages/ExpertDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Farmer Routes */}
              <Route 
                path="/farmer/*" 
                element={
                  <ProtectedRoute roles={['Farmer']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Expert Routes */}
              <Route 
                path="/expert/*" 
                element={
                  <ProtectedRoute roles={['Expert']}>
                    <ExpertDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
