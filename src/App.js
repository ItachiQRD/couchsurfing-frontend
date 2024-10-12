import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import Footer from './components/Footer';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ListingList from './components/ListingList';
import ListingDetail from './components/ListingDetail';
import './styles/custom.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './components/Profile';
import Conversations from './pages/Conversations';
import Conversation from './pages/Conversation';
import SearchListings from './pages/SearchListings';
import CreateListing from './pages/CreateListing';
import Messages from './pages/Messages';
import axios from 'axios';

function AppContent() {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: { 'x-auth-token': token }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error("Erreur de vérification du token", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [setUser]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container fluid className="p-0 min-vh-100 d-flex flex-column">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route path="/create-listing" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
          <Route path="/conversations" element={<PrivateRoute><Conversations /></PrivateRoute>} />
          <Route path="/conversation/:userId" element={<PrivateRoute><Conversation /></PrivateRoute>} />
          <Route path="/search" element={<SearchListings />} />
          <Route path="/listings" element={<ListingList />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;