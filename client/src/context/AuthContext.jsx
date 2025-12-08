import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5001/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/profile`);
            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            // If token is invalid, clear it
            if (error.response?.status === 401) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token, ...userData } = res.data;
        // Store token - will persist for 6 hours (handled by backend JWT expiration)
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return true;
    };

    const register = async (username, email, password, codeforces_handle) => {
        const res = await axios.post(`${API_URL}/auth/signup`, {
            username,
            email,
            password,
            codeforces_handle
        });
        const { token, ...userData } = res.data;
        // Store token - will persist for 6 hours (handled by backend JWT expiration)
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return true;
    };

    const loginWithGoogle = async (credential) => {
        const res = await axios.post(`${API_URL}/auth/google`, { token: credential });
        const { token, ...userData } = res.data;
        // Store token - will persist for 6 hours (handled by backend JWT expiration)
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        fetchProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
