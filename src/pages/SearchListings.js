import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { Search, GeoAlt, Calendar, People } from 'react-bootstrap-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function SearchListings() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/listings/search`, {
        params: { location, checkIn, checkOut, guests }
      });
      setListings(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'hébergements', error);
    }
    setLoading(false);
  };

  return (
    <Container>
      <h1 className="my-4">Rechercher un hébergement</h1>
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label><GeoAlt /> Destination</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Où allez-vous ?"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label><Calendar /> Arrivée</Form.Label>
                  <Form.Control
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label><Calendar /> Départ</Form.Label>
                  <Form.Control
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label><People /> Voyageurs</Form.Label>
                  <Form.Control
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="d-flex align-items-end">
                <Button variant="primary" type="submit" className="w-100">
                  <Search />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <p>Chargement des résultats...</p>
      ) : (
        <Row>
          {listings.map(listing => (
            <Col md={4} key={listing._id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={listing.image || 'https://via.placeholder.com/300x200'} />
                <Card.Body>
                  <Card.Title>{listing.title}</Card.Title>
                  <Card.Text>{listing.description.substring(0, 100)}...</Card.Text>
                  <Badge variant="info" className="mr-2">{listing.location}</Badge>
                  <Badge variant="secondary">{listing.maxGuests} voyageurs</Badge>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Proposé par {listing.host.username}</small>
                  <Link to={`/listing/${listing._id}`} className="btn btn-primary btn-sm float-right">
                    Voir les détails
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SearchListings;