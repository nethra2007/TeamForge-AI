import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUserApi, registerUserApi, getMeApi } from '../services/authApi';
import { useUser } from './UserContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('teamforge_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));
  const [loading, setLoading] = useState(true);
  const { setUserProfile } = useUser();

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          if (res?.data) {
            setUserProfile(res.data);
          }
          setIsAuthenticated(true);
        } catch (err) {
          console.warn('[AuthContext] Verification failed, clearing token');
          localStorage.removeItem('teamforge_token');
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await loginUserApi(credentials);
    const userToken = res.data?.token;
    if (userToken) {
      localStorage.setItem('teamforge_token', userToken);
      setToken(userToken);
    }
    if (res.data) {
      setUserProfile(res.data);
    }
    setIsAuthenticated(true);
    return res;
  };

  const register = async (userData) => {
    const res = await registerUserApi(userData);
    const userToken = res.data?.token;
    if (userToken) {
      localStorage.setItem('teamforge_token', userToken);
      setToken(userToken);
    }
    if (res.data) {
      setUserProfile(res.data);
    }
    setIsAuthenticated(true);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('teamforge_token');
    localStorage.removeItem('teamforge_user_profile');
    setToken(null);
    setIsAuthenticated(false);
    // Reset profile to empty state on logout
    setUserProfile({
      name: '', email: '', college: '', branch: '', year: '',
      skills: [], interests: [], preferredRole: '', targetCareer: '',
      targetCompany: '', readinessScore: 0, resumeText: ''
    });
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
