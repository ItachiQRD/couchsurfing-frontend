import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function BookingForm({ listingId, onBookingComplete }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/bookings`, {
        listingId,
        startDate,
        endDate
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Demande de réservation envoyée avec succès !');
      onBookingComplete();
    } catch (error) {
      console.error('Erreur lors de la création de la réservation', error);
      alert('Une erreur est survenue lors de la création de la réservation');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <button type="submit">Réserver</button>
    </form>
  );
}

export default BookingForm;