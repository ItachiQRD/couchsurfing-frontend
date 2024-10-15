import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';



function ListingList() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/listing`);
        setListings(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des hébergements', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <Row>
      {listings.map(listing => (
        <Col md={4} key={listing._id} className="mb-4">
          <Card>
            <Card.Img 
              variant="top" 
              src={listing.thumbnails && listing.thumbnails.length > 0 
                ? `${process.env.REACT_APP_UPLOADS_URL}/${listing.thumbnails[0]}`
                : 'https://via.placeholder.com/300x200'
              } 
              alt={listing.title}
            />
            <Card.Body>
              <Card.Title>{listing.title}</Card.Title>
              <Card.Text>{listing.description.substring(0, 100)}...</Card.Text>
              <Card.Text>Localisation: {listing.location}</Card.Text>
              <Card.Text>Capacité: {listing.maxGuests} personnes</Card.Text>
              <Link to={`/listing/${listing._id}`}>
                <Button variant="primary">Voir les détails</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ListingList;