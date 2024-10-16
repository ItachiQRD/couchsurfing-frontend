import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { Link,  } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake, FaPhone,  FaLanguage, FaEye, FaEyeSlash, FaHome } from 'react-icons/fa';
import LocationInput from '../components/LocationInput';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const API_URL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    phoneNumber: '',
    address: '',
    languages: '',
    bio: '',
    isHost: false // Ajout du champ isHost
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false); // Ajout de l'état isRegistered

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (formData.username.length > 2) {
        try {
          const response = await axios.get(`${API_URL}/auth/check-username/${formData.username}`);
          setUsernameAvailable(response.data.available);
        } catch (error) {
          console.error('Erreur lors de la vérification du nom d\'utilisateur', error);
        }
      }
    };

    const timer = setTimeout(checkUsernameAvailability, 500);
    return () => clearTimeout(timer);
  }, [formData.username]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return 'danger';
    if (passwordStrength < 4) return 'warning';
    return 'success';
  };

  const handleLocationSelect = (fullLocation) => {
    setFormData(prev => ({
      ...prev,
      address: fullLocation,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }
  
    if (passwordStrength < 3) {
      return setError("Le mot de passe n'est pas assez fort.");
    }
  
    if (!usernameAvailable) {
      return setError("Ce nom d'utilisateur n'est pas disponible.");
    }
  
    try {
      setError('');
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      if (response.data.message) {
        setIsRegistered(true);
      } else {
        setError('Une erreur inattendue s\'est produite lors de l\'inscription.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError('Échec de l\'inscription: ' + err.response.data.message);
      } else {
        setError('Échec de l\'inscription: Une erreur inattendue s\'est produite.');
      }
      console.error('Erreur détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  function PasswordStrengthBar({ strength }) {
    const getVariant = () => {
      if (strength < 2) return 'danger';
      if (strength < 4) return 'warning';
      return 'success';
    };
  
    return (
      <div className="progress mt-2" style={{ height: '5px' }}>
        <div
          className={`progress-bar bg-${getVariant()}`}
          role="progressbar"
          style={{ width: `${strength * 25}%` }}
          aria-valuenow={strength * 25}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    );
  }


 return (
  <Container className="py-5">
    <Row className="justify-content-center">
      <Col md={8}>
        <Card className="shadow">
          <Card.Body>
            <h2 className="text-center mb-4">Inscription</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {isRegistered ? (
              <Alert variant="success">
                <p>Inscription réussie ! Un email de confirmation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.</p>
                <div className="text-center mt-3">
                  <Link to="/login" className="btn btn-primary">
                    Aller à la page de connexion
                  </Link>
                </div>
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaUser /> Nom d'utilisateur</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        isValid={usernameAvailable}
                        isInvalid={usernameAvailable === false}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Ce nom d'utilisateur n'est pas disponible.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaEnvelope /> Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaLock /> Mot de passe</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <InputGroup.Text>
                          <Button 
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputGroup.Text>
                      </InputGroup>
                      <PasswordStrengthBar strength={passwordStrength} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaLock /> Confirmer le mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isValid={formData.confirmPassword && formData.password === formData.confirmPassword}
                        isInvalid={formData.confirmPassword && formData.password !== formData.confirmPassword}
                        required
                      />
                      <Form.Text className={`text-${getPasswordStrengthColor()}`}>
                        {passwordStrength < 2 && "Mot de passe faible"}
                        {passwordStrength >= 2 && passwordStrength < 4 && "Mot de passe moyen"}
                        {passwordStrength >= 4 && "Mot de passe fort"}
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        Les mots de passe ne correspondent pas.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

               <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaUser /> Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaUser /> Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3 custom-datepicker">
                      <Form.Label><FaBirthdayCake /> Date de naissance</Form.Label>
                      <DatePicker
                        selected={formData.dateOfBirth}
                        onChange={(date) => handleChange({ target: { name: 'dateOfBirth', value: date } })}
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaPhone /> Numéro de téléphone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                <LocationInput 
                    onLocationSelect={handleLocationSelect} 
                    initialValue={formData.address}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaLanguage /> Langues parlées</Form.Label>
                  <Form.Control
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaUser /> Biographie</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      id="isHost"
                      name="isHost"
                      label={<><FaHome /> Je souhaite être hôte</>}
                      checked={formData.isHost}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                    {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
          <div className="text-center mt-3">
            Déjà inscrit? <Link to="/login">Connectez-vous</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;