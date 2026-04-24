import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['x-auth-token'] = token;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        const { token, user: userData } = res.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['x-auth-token'] = token;
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        const res = await axios.post('http://localhost:5000/api/auth/register', userData);
        const { token, user: newUser } = res.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        axios.defaults.headers.common['x-auth-token'] = token;
        setUser(newUser);
        return newUser;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
