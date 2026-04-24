import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-card">
      <Link 
        to={user ? (user.role === 'Farmer' ? '/farmer' : '/expert') : '/'} 
        className="navbar-brand"
        onClick={(e) => {
            const dest = user ? (user.role === 'Farmer' ? '/farmer' : '/expert') : '/';
            if (window.location.pathname === dest) {
                e.preventDefault();
            }
        }}
      >
        <div className="brand-icon">
          <Sprout className="text-white w-6 h-6" />
        </div>
        <span className="brand-name">
          Agri<span className="text-primary">LifeCycle</span>
        </span>
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link 
              to={user.role === 'Farmer' ? '/farmer' : '/expert'} 
              className="nav-link"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <div className="nav-divider"></div>
            <div className="user-profile">
              <div className="user-info">
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.fullName}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="btn-logout"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link 
              to="/login" 
              className="btn-login"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn-register"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
