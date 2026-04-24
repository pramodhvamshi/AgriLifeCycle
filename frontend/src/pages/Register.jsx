import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, ShieldAlert } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'Farmer'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await register(formData);
            if (user.role === 'Farmer') navigate('/farmer');
            else navigate('/expert');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card auth-card"
                style={{ maxWidth: '600px' }}
            >
                <div className="auth-header">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join the AgriLife community today</p>
                </div>

                {error && (
                    <div className="error-banner">
                        <ShieldAlert size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="grid grid-cols-2 gap-6 md-grid-cols-2">
                        <div className="form-group">
                            <label className="label ml-1">Full Name</label>
                            <div className="input-wrapper">
                                <UserIcon className="input-icon" size={18} />
                                <input 
                                    type="text" required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="input auth-input"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label ml-1">Email</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input 
                                    type="email" required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="input auth-input"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label ml-1">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input 
                                type="password" required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="input auth-input"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label ml-1">I am a...</label>
                        <div className="role-selector">
                            {['Farmer', 'Expert'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({...formData, role})}
                                    className={`role-btn ${formData.role === role ? 'active' : ''}`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="btn btn-primary w-full p-4"
                    >
                        <UserPlus size={20} />
                        Create Account
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? {' '}
                    <Link to="/login" className="auth-link">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
