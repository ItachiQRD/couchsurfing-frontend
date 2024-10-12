import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError('Erreur lors de la demande de réinitialisation du mot de passe');
      setMessage('');
    }
  };

  return (
    <Card className="mt-5">
      <Card.Body>
        <h2 className="text-center mb-4">Réinitialisation du mot de passe</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Réinitialiser le mot de passe
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ForgotPassword;