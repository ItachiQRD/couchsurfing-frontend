import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Carousel } from 'react-bootstrap';
import axios from 'axios';


function ListingDetail() {
  const [listing, setListing] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/listing/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'hébergement', error);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) return <div>Chargement...</div>;

  return (
    <Card>
      <Carousel>
        {listing.images && listing.images.length > 0 ? (
          listing.images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={`${process.env.REACT_APP_UPLOADS_URL}/${listing.images[0]}`}
                alt={`Vue ${index + 1} de l'hébergement`}
              />
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://via.placeholder.com/800x600"
              alt="Placeholder"
            />
          </Carousel.Item>
        )}
      </Carousel>
      <Card.Body>
        <Card.Title>{listing.title}</Card.Title>
        <Card.Text>{listing.description}</Card.Text>
        <ListGroup className="list-group-flush">
          <ListGroupItem>Localisation: {listing.location}</ListGroupItem>
          <ListGroupItem>Capacité: {listing.maxGuests} personnes</ListGroupItem>
          <ListGroupItem>Équipements: {listing.amenities.join(', ')}</ListGroupItem>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default ListingDetail;