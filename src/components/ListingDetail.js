import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Row, Col, Container, Carousel } from 'react-bootstrap';
import axios from 'axios';
import '../styles/listdetails.css';
import { FaUser, FaMapMarkerAlt, FaBed, FaUsers } from 'react-icons/fa';



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
      <Container className="mt-4">
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Carousel>
                {listing.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <div className="image-container">
                      <img
                        className="d-block w-100 listing-image"
                        src={`${process.env.REACT_APP_UPLOADS_URL}/${listing.images[0]}`}
                        alt={`Vue ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/path/to/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>
  
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{listing.title}</Card.Title>
                <Card.Text>{listing.description}</Card.Text>
              </Card.Body>
            </Card>
  
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Équipements</Card.Title>
                <ListGroup variant="flush">
                  {listing.amenities.map((amenity, index) => (
                    <ListGroup.Item key={index}>{amenity}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
  
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Informations sur l'hébergement</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <FaUser /> Hôte : {listing.host.username}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FaMapMarkerAlt /> Localisation : {listing.location}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FaBed /> Type : {listing.accommodationType}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FaUsers /> Capacité : {listing.maxGuests} personnes
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Prix : {listing.price}€ / nuit
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            </Col>
      </Row>
    </Container>
  );
}

export default ListingDetail;