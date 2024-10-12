import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

function VerifyEmail() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const query = new URLSearchParams(location.search);
      const token = query.get('token');

      try {
        const response = await axios.get(`${API_URL}/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (error) {
        setStatus('error');
        setMessage('Lien de vérification invalide ou expiré.');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Vérification de votre email en cours...</p>
          </motion.div>
        );
      case 'success':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaCheckCircle size={50} className="text-success mb-3" />
            <h3>Email vérifié avec succès !</h3>
            <p>{message}</p>
            <p>Redirection vers la page de connexion dans 5 secondes...</p>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaTimesCircle size={50} className="text-danger mb-3" />
            <h3>Erreur de vérification</h3>
            <p>{message}</p>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Aller à la page de connexion
            </Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center p-5 shadow-lg">
          <Card.Body>
            <h2 className="mb-4">Vérification de l'email</h2>
            {renderContent()}
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
}

export default VerifyEmail;