import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-light mt-auto py-4">
      <Container>
        <Row className="py-3">
          <Col md={4}>
            <h5 className="mb-3">À propos de CouchSurfing MVP</h5>
            <p>Une plateforme pour connecter les voyageurs et les hôtes du monde entier.</p>
          </Col>
          <Col md={4}>
            <h5 className="mb-3">Liens rapides</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Accueil</Link></li>
              <li><Link to="/search" className="text-light">Rechercher</Link></li>
              <li><Link to="/create-listing" className="text-light">Devenir hôte</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3">Contact</h5>
            <p>Email: contact@couchsurfingmvp.com</p>
            <p>Téléphone: +33 1 23 45 67 89</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3 border-top border-secondary">
            <p className="mb-0">&copy; {new Date().getFullYear()} CouchSurfing MVP. Tous droits réservés.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;