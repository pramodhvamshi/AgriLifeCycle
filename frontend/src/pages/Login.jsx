import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'Farmer') navigate('/farmer');
            else navigate('/expert');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid Credentials');
        }
    };

    return (
        <div className="auth-wrapper">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card auth-card"
            >
                <div className="auth-header">
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Login to your AgriLife account</p>
                </div>

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="label ml-1">Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input auth-input"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label ml-1">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input auth-input"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="btn btn-primary w-full p-4"
                    >
                        <LogIn size={20} />
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? {' '}
                    <Link to="/register" className="auth-link">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
