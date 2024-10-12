import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function GuestBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/guest`, {
        headers: { 'x-auth-token': token }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/bookings/${bookingId}/status`, 
        { status: 'cancelled' },
        { headers: { 'x-auth-token': token } }
      );
      fetchBookings();  // Rafraîchir la liste des réservations
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation', error);
    }
  };

  return (
    <div>
      <h2>Mes réservations en tant que voyageur</h2>
      {bookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.listing.title}</h3>
          <p>Hôte : {booking.host.username}</p>
          <p>Du : {new Date(booking.startDate).toLocaleDateString()} au {new Date(booking.endDate).toLocaleDateString()}</p>
          <p>Statut : {booking.status}</p>
          {booking.status === 'pending' && (
            <button onClick={() => handleCancelBooking(booking._id)}>Annuler la réservation</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default GuestBookings;