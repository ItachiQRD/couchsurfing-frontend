import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Badge } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Conversations() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, /*[userId]*/);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { 'x-auth-token': token }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations', error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Mes conversations</h2>
      <ListGroup>
        {conversations.map(conv => (
          <ListGroup.Item 
            key={conv._id} 
            as={Link} 
            to={`/conversation/${conv.user._id}`}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>{conv.user.username}</h5>
              <p className="mb-1">{conv.lastMessage.content}</p>
              <small>{new Date(conv.lastMessage.createdAt).toLocaleString()}</small>
            </div>
            {conv.unreadCount > 0 && (
              <Badge variant="primary" pill>
                {conv.unreadCount}
              </Badge>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Conversations;