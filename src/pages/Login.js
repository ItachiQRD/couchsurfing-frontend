import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

axios.defaults.withCredentials = true;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data && response.data.token) {
        authLogin(response.data.token);
        navigate('/');
      } else if (response.response && response.response.data.msg === 'Veuillez vérifier votre email avant de vous connecter') {
        setError('Utilisateur non vérifié. Veuillez vérifier votre email.');
      } else {
        throw new Error('Token non reçu du serveur');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Échec de la connexion. Vérifiez vos identifiants.');
      }
    }
    setLoading(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Connexion</h2>
              <ErrorMessage message={error} />
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label><FaEnvelope /> Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaLock /> Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="text-center mt-3">
            <Link to="/forgot-password">Mot de passe oublié?</Link>
          </div>
          <div className="text-center mt-3">
            Pas encore de compte? <Link to="/register">Inscrivez-vous</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;