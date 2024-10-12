import React, { useState, useEffect, useCallback, useMemo, useAuth } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCoffee,FaCheck, FaStar, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import '../styles/profile.css';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshToken } = useAuth();

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/profile');
      setProfile(response.data);
      setEditedProfile(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur détaillée:', error.response || error);
      if (error.response && error.response.status === 401) {
        try {
          await refreshToken();
          const retryResponse = await api.get('/profile');
          setProfile(retryResponse.data);
          setEditedProfile(retryResponse.data);
        } catch (refreshError) {
          setError('Session expirée. Veuillez vous reconnecter.');
        }
      } else {
        setError('Impossible de charger le profil. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await api.put('/users/profile', editedProfile, {
        headers: { 'x-auth-token': token }
      });
      setProfile(editedProfile);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
      setError('Impossible de mettre à jour le profil. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [editedProfile]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => {
      if (name === 'travelPreferences' || name === 'skills') {
        return { ...prev, [name]: value.split(',').map(item => item.trim()) };
      }
      if (name.startsWith('socialMedia.')) {
        const [, platform] = name.split('.');
        return { ...prev, socialMedia: { ...prev.socialMedia, [platform]: value } };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const profileContent = useMemo(() => {
    if (isLoading) {
      return <Spinner animation="border" />;
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!profile) {
      return <Alert variant="info">Aucun profil trouvé.</Alert>;
    }

    return (
      <Container className="profile-container">
        <Row>
          <Col md={4}>
            <Card className="profile-card">
              <Card.Img variant="top" src={profile.avatar || 'https://via.placeholder.com/150'} />
              <Card.Body>
                <Card.Title>{profile.username}</Card.Title>
                <Card.Text>
                  <FaMapMarkerAlt /> {profile.location}
                </Card.Text>
                <div className="profile-stats">
                  <span><FaStar /> {profile.rating}/5</span>
                  <span><FaCoffee /> {profile.hostings} hébergements</span>
                </div>
              </Card.Body>
              {profile.verifiedIdentity && (
                <Badge variant="success"><FaCheck /> Identité vérifiée</Badge>
              )}
            </Card>
          </Col>
          <Col md={8}>
            {isEditing ? (
              <Form>
                <Form.Group>
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Langues parlées</Form.Label>
                  <Form.Control
                    type="text"
                    name="languages"
                    value={editedProfile.languages}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Intérêts</Form.Label>
                  <Form.Control
                    type="text"
                    name="interests"
                    value={editedProfile.interests}
                    onChange={handleChange}
                  />
                </Form.Group><Form.Group>
                  <Form.Label>Préférences de voyage</Form.Label>
                  <Form.Control
                    type="text"
                    name="travelPreferences"
                    value={editedProfile.travelPreferences.join(', ')}
                    onChange={handleChange}
                    placeholder="Séparés par des virgules"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Compétences</Form.Label>
                  <Form.Control
                    type="text"
                    name="skills"
                    value={editedProfile.skills.join(', ')}
                    onChange={handleChange}
                    placeholder="Séparées par des virgules"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control
                    type="text"
                    name="socialMedia.facebook"
                    value={editedProfile.socialMedia?.facebook || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="socialMedia.instagram"
                    value={editedProfile.socialMedia?.instagram || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control
                    type="text"
                    name="socialMedia.twitter"
                    value={editedProfile.socialMedia?.twitter || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>Enregistrer</Button>
              </Form>
            ) : (
              <>
                <h3>À propos de moi</h3>
                <p>{profile.bio}</p>
                <h3>Langues parlées</h3>
                <p>{profile.languages}</p>
                <h3>Intérêts</h3>
                <p>{profile.interests}</p>
                <h3>Préférences de voyage</h3>
                <p>{profile.travelPreferences.join(', ')}</p>
                <h3>Compétences</h3>
                <p>{profile.skills.join(', ')}</p>
                <h3>Réseaux sociaux</h3>
                <p>
                  {profile.socialMedia?.facebook && <a href={profile.socialMedia.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>}
                  {profile.socialMedia?.instagram && <a href={profile.socialMedia.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
                  {profile.socialMedia?.twitter && <a href={profile.socialMedia.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>}
                </p>
                <Button variant="outline-primary" onClick={handleEdit}>Modifier le profil</Button>
              </>
            )}
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Informations d'hébergement</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>Type de logement: {profile.accommodationType}</ListGroup.Item>
                  <ListGroup.Item>Nombre de voyageurs max: {profile.maxGuests}</ListGroup.Item>
                  <ListGroup.Item>Équipements: {profile.amenities.join(', ')}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Références</Card.Title>
                <ListGroup variant="flush">
                  {profile.references.map((ref, index) => (
                    <ListGroup.Item key={index}>
                      <strong>{ref.author}</strong>: "{ref.content}"
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title>Avis</Card.Title>
                <ListGroup variant="flush">
                  {profile.reviews.map((review, index) => (
                    <ListGroup.Item key={index}>
                      <strong>{review.author.username}</strong> - {review.rating}/5
                      <p>{review.content}</p>
                      <small>{new Date(review.date).toLocaleDateString()}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }, [profile, isEditing, editedProfile, handleChange, handleSave, handleEdit, isLoading, error]);

  return profileContent;
}

export default Profile;