import React, { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';

const LocationInput = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const searchLocation = async (input) => {
    if (input.length < 3) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${input}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Erreur lors de la recherche de localisation:', error);
    }
  };

  const handleSelect = (item) => {
    const fullLocation = `${item.display_name}`;
    setQuery(fullLocation);
    setSuggestions([]);
    onLocationSelect(fullLocation, item.lat, item.lon);
  };

  return (
    <Form.Group>
      <Form.Label>Localisation</Form.Label>
      <Form.Control
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchLocation(e.target.value);
        }}
        placeholder="Entrez une ville"
      />
      <ListGroup>
        {suggestions.map((item) => (
          <ListGroup.Item 
            key={item.place_id} 
            action 
            onClick={() => handleSelect(item)}
          >
            {item.display_name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Form.Group>
  );
};

export default LocationInput;