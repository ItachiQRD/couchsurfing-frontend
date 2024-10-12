import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const PrivateRoute = ({ children }) => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/verify');
          setUser(response.data.user);
        } catch (error) {
          console.error("Erreur de vérification du token", error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [setUser]);

  if (isLoading) {
    return <div>Chargement...</div>; // Ou un composant de chargement plus élaboré
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;