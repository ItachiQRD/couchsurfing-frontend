import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: { 'x-auth-token': token }
          });
          setIsAuthenticated(true);
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };

  const signup = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,signup, isAuthenticated, setIsAuthenticated, setUser, loading  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);