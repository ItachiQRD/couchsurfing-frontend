import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="font-weight-bold">CouchSurfing MVP</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/search" active={location.pathname === '/search'}>Rechercher</Nav.Link>
            {user && <Nav.Link as={Link} to="/create-listing" active={location.pathname === '/create-listing'}>Proposer un hébergement</Nav.Link>}
            <Nav.Link as={Link} to="/listings" active={location.pathname === '/listings'}>Hébergements</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" active={location.pathname === '/profile'}>Mon Profil</Nav.Link>
                <Nav.Link as={Link} to="/messages" active={location.pathname === '/messages'}>Messages</Nav.Link>
                <Button variant="outline-danger" onClick={logout} className="ml-2">Déconnexion</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" active={location.pathname === '/login'}>Connexion</Nav.Link>
                <Nav.Link as={Link} to="/register" active={location.pathname === '/register'}>Inscription</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;