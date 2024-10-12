import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaComments, FaHome, FaGlobeAmericas } from 'react-icons/fa';

function Home() {
  const [index, setIndex] = useState(0);
  const [destination, setDestination] = useState('');
  const [travelerCount, setTravelerCount] = useState(1);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour rediriger vers la page de recherche avec les paramètres
    console.log(`Recherche pour ${destination} avec ${travelerCount} voyageur(s)`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      <div className="dynamic-bg"></div>
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Carousel activeIndex={index} onSelect={handleSelect} fade>
        <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/travel1.jpg"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>Découvrez le monde</h3>
              <p>Voyagez comme un local avec CouchSurfing MVP.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/travel2.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Rencontrez de nouvelles personnes</h3>
              <p>Créez des connexions durables à travers le monde.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/travel3.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Partagez votre culture</h3>
              <p>Devenez hôte et accueillez des voyageurs du monde entier.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Container className="search-container">
          <Form onSubmit={handleSearch} className="search-form">
            <Row>
              <Col md={6}>
                <Form.Control 
                  type="text" 
                  placeholder="Où voulez-vous aller ?" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control 
                  type="number" 
                  min="1" 
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Button type="submit" variant="primary" className="w-100">Rechercher</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </motion.section>

      <Container className="py-5">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-center mb-4 display-4">Bienvenue sur CouchSurfing MVP</h1>
          <p className="lead text-center">
            Découvrez de nouvelles cultures en séjournant chez l'habitant ou en accueillant des voyageurs du monde entier.
          </p>
        </motion.div>

        <Row className="mb-5">
          <Col md={6} className="mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">Voyagez</Card.Title>
                <Card.Text className="mb-4">
                  Trouvez des hébergements gratuits dans le monde entier et vivez une expérience unique et inédite.
                </Card.Text>
                <Button as={Link} to="/search" variant="primary" className="mt-auto">Rechercher un hébergement</Button>
              </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col md={6} className="mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-3">Accueillez</Card.Title>
                  <Card.Text className="mb-4">
                  Partagez votre culture en accueillant des voyageurs chez vous. Offrez une expérience authentique et découvrez de nouvelles perspectives.
                  </Card.Text>
                  <Button as={Link} to="/create-listing" variant="success" className="mt-auto">Proposer un hébergement</Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <section className="how-it-works mb-5">
          <h2 className="text-center mb-4">Comment ça marche</h2>
          <Row>
            {[
              { icon: FaSearch, title: "Recherchez", text: "Trouvez des hôtes dans la ville de votre choix." },
              { icon: FaComments, title: "Connectez", text: "Échangez avec vos hôtes potentiels." },
              { icon: FaHome, title: "Séjournez", text: "Profitez de votre séjour et créez des souvenirs inoubliables." }
            ].map((item, index) => (
              <Col md={4} key={index}>
                <motion.div 
                  className="text-center"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <item.icon className="fa-3x mb-3" />
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>

        <section className="testimonials">
          <h2 className="text-center mb-4">Ce que disent nos utilisateurs</h2>
          <Row>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <p className="font-italic">"Une expérience incroyable ! J'ai rencontré des gens formidables et découvert des endroits uniques."</p>
                  <footer className="blockquote-footer">Marie, 28 ans</footer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <p className="font-italic">"Être hôte m'a permis de partager ma culture et de faire des rencontres enrichissantes."</p>
                  <footer className="blockquote-footer">Thomas, 35 ans</footer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <p className="font-italic">"CouchSurfing MVP a changé ma façon de voyager. Je ne peux plus m'en passer !"</p>
                  <footer className="blockquote-footer">Sophie, 31 ans</footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        <motion.section 
          className="world-map mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-center mb-4">Explorez le monde</h2>
          <div className="text-center">
            <FaGlobeAmericas size={100} className="text-primary" />
            <p className="mt-3">Des millions d'utilisateurs dans plus de 200 pays</p>
          </div>
        </motion.section>
      </Container>
    </div>
  );
}

export default Home;