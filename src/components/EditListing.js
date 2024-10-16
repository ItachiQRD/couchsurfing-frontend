import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import api from '../services/api';

function EditListing() {
  const [listing, setListing] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'hébergement', error);
      }
    };
    fetchListing();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/listings/${id}`, listing);
      navigate('/profile');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'hébergement', error);
    }
  };

  if (!listing) return <div>Chargement...</div>;

  return (
    <Container>
      <h2>Modifier l'hébergement</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Titre</Form.Label>
          <Form.Control
            type="text"
            value={listing.title}
            onChange={(e) => setListing({...listing, title: e.target.value})}
          />
        </Form.Group>
        {/* Ajoutez d'autres champs de formulaire ici */}
        <Button type="submit">Mettre à jour</Button>
      </Form>
    </Container>
  );
}

export default EditListing;