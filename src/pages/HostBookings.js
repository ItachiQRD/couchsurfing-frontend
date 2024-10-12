import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function HostBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/host`, {
        headers: { 'x-auth-token': token }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations', error);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/bookings/${bookingId}/status`, 
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      fetchBookings();  // Rafraîchir la liste des réservations
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error);
    }
  };

  return (
    <div>
      <h2>Mes réservations en tant qu'hôte</h2>
      {bookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.listing.title}</h3>
          <p>Voyageur : {booking.guest.username}</p>
          <p>Du : {new Date(booking.startDate).toLocaleDateString()} au {new Date(booking.endDate).toLocaleDateString()}</p>
          <p>Statut : {booking.status}</p>
          {booking.status === 'pending' && (
            <div>
              <button onClick={() => handleStatusChange(booking._id, 'accepted')}>Accepter</button>
              <button onClick={() => handleStatusChange(booking._id, 'rejected')}>Refuser</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default HostBookings;