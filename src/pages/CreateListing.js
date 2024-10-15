import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LocationInput from '../components/LocationInput';
import '../styles/createlisting.css';

const amenitiesList = [
  'Wi-Fi', 'Cuisine', 'Parking', 'Climatisation', 'Chauffage', 'Lave-linge',
  'Sèche-linge', 'Télévision', 'Fer à repasser', 'Espace de travail'
];

function CreateListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
    maxGuests: 1,
    amenities: [],
    price: '',
    availabilityFrom: new Date(),
    availabilityTo: new Date(),
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prevState => ({
      ...prevState,
      amenities: prevState.amenities.includes(amenity)
        ? prevState.amenities.filter(a => a !== amenity)
        : [...prevState.amenities, amenity]
    }));
  };

  const handleLocationSelect = (fullLocation, lat, lon) => {
    setFormData(prev => ({
      ...prev,
      location: fullLocation,
      latitude: lat,
      longitude: lon
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    const listingData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'amenities') {
        formData[key].forEach(amenity => listingData.append('amenities[]', amenity));
      } else if (key === 'availabilityFrom' || key === 'availabilityTo') {
        listingData.append(key, formData[key].toISOString());
      } else {
        listingData.append(key, formData[key]);
      }
    });

    // Ajout des images au FormData
    images.forEach(image => {
      listingData.append('images', image);
    });

    // Ajout de la disponibilité
    const availability = JSON.stringify([{
      from: formData.availabilityFrom,
      to: formData.availabilityTo
    }]);
    listingData.append('availability', availability);
  
    try {
      const response = await api.post('/listing', listingData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Réponse du serveur:', response.data);
      setSuccess('Hébergement créé avec succès !');
      setTimeout(() => navigate('/search'), 2000);
    } catch (error) {
      console.error('Erreur lors de la création de l\'hébergement:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la création de l\'hébergement');
    }
  };

  return (
    <Container className="create-listing-container">
      <h2 className="text-center mb-4">Proposer un hébergement</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Titre de l'annonce</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
            <LocationInput onLocationSelect={handleLocationSelect} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre maximum de voyageurs</Form.Label>
              <Form.Control
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                min="1"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Prix par nuit (€)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Équipements</Form.Label>
          <div className="amenities-container">
            {amenitiesList.map(amenity => (
              <Form.Check
                key={amenity}
                type="checkbox"
                label={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="amenity-checkbox"
              />
            ))}
          </div>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Disponible à partir de</Form.Label>
              <DatePicker
                selected={formData.availabilityFrom}
                onChange={date => setFormData({...formData, availabilityFrom: date})}
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Disponible jusqu'à</Form.Label>
              <DatePicker
                selected={formData.availabilityTo}
                onChange={date => setFormData({...formData, availabilityTo: date})}
                className="form-control"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Créer l'annonce
        </Button>
      </Form>
    </Container>
  );
}

export default CreateListing;