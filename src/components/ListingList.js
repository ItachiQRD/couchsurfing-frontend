import React, { useState, useEffect } from 'react';
import { Card, Button, Row,Container, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from "../services/api";

const cleanImageUrl = (url) => {
  return url.replace(/\s+/g, '%20');
};

function ListingList() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get(`${process.env.REACT_APP_API_URL}/listing`);
        setListings(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des hébergements', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <Container>
      <h2 className="my-4">Hébergements disponibles</h2>
      <Row>
        {listings.map(listing => (
          <Col key={listing._id} md={4} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={cleanImageUrl(`${process.env.REACT_APP_UPLOADS_URL}/${listing.thumbnails[0]}`)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                }}
              />
            <Card.Body>
              <Card.Title>{listing.title}</Card.Title>
              <Card.Text>{listing.description.substring(0, 100)}...</Card.Text>
              <Card.Text>Localisation: {listing.location}</Card.Text>
              <Card.Text> <strong>Prix:</strong> {listing.price}€ / nuit</Card.Text>
              <Card.Text>Capacité: {listing.maxGuests} personnes</Card.Text>
              <Link to={`/listing/${listing._id}`}>
                <Button variant="primary">Voir les détails</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
  );
}

export default ListingList;