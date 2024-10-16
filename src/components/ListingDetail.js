import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/listdetails.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Card, Carousel, ListGroup, Button,Alert } from 'react-bootstrap';
import { FaUser, FaMapMarkerAlt, FaBed, FaUsers, FaBook } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';


function ListingDetail() {
  const [listing, setListing] = useState(null);
  const { id } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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


  if (!listing) return <Alert variant="info">Aucun hébergement trouvé.</Alert>;
 

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8}>
          {/* Images Carousel */}
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

          {/* Description */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{listing.title}</Card.Title>
              <Card.Text>{listing.description}</Card.Text>
            </Card.Body>
          </Card>

          {/* Équipements */}
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

          {/* Avis des utilisateurs */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Avis des utilisateurs</Card.Title>
              {listing.reviews && listing.reviews.length > 0 ? (
                listing.reviews.map((review, index) => (
                  <Card key={index} className="mb-2">
                    <Card.Body>
                      <Card.Title>{review.user.username}</Card.Title>
                      <Card.Text>{review.comment}</Card.Text>
                      <Card.Text>Note: {review.rating}/5</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Card.Text>Aucun avis pour le moment.</Card.Text>
              )}
            </Card.Body>
          </Card>

          {/* Carte interactive */}
          <Card className="mb-4">
            <Card.Body>
            <Card.Title>Emplacement</Card.Title>
              <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                {listing.latitude && listing.longitude ? (
                  <MapContainer 
                    center={[listing.latitude, listing.longitude]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[listing.latitude, listing.longitude]}>
                      <Popup>{listing.title}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <Alert variant="warning">Coordonnées de localisation non disponibles.</Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Informations sur l'hébergement */}
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

          {/* Calendrier de disponibilité */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Disponibilité</Card.Title>
              <div className="d-flex justify-content-between">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </div>
              <Button className="mt-3 w-100" variant="primary">Réserver</Button>
            </Card.Body>
          </Card>

          {/* Règles de la maison */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Règles de la maison</Card.Title>
              <ListGroup variant="flush">
                {listing.houseRules && listing.houseRules.map((rule, index) => (
                  <ListGroup.Item key={index}>
                    <FaBook className="me-2" /> {rule}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Politique d'annulation */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Politique d'annulation</Card.Title>
              <Card.Text>{listing.cancellationPolicy}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ListingDetail;