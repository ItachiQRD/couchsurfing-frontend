import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/message.css';
import { Form, Button, Alert, Dropdown } from 'react-bootstrap';
import { FaMicrophone, FaStop, FaPaperPlane, FaSmile } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const { userId } = useParams();
  const messagesEndRef = useRef(null);
  const mediaRecorder = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
        headers: { 'x-auth-token': token }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
      setError('Impossible de charger les messages. Veuillez réessayer.');
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setError('ID utilisateur manquant');
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId, fetchMessages]);

 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('ID utilisateur manquant');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('recipientId', userId);
      formData.append('content', newMessage);
      if (image) {
        formData.append('image', image);
      }
      if (audioBlob) {
        formData.append('voiceMessage', audioBlob, 'voice-message.webm');
      }
      
      await axios.post(`${API_URL}/messages`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setNewMessage('');
      setImage(null);
      setAudioBlob(null);
      fetchMessages();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message', error);
      setError('Impossible d\'envoyer le message. Veuillez réessayer.');
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();
        setIsRecording(true);

        const audioChunks = [];
        mediaRecorder.current.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.current.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
        });
      });
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  const handleReaction = async (messageId, reaction) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/messages/${messageId}/react`, { reaction }, {
        headers: { 'x-auth-token': token }
      });
      fetchMessages();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réaction', error);
    }
  };

  return (
    <div className="messages-container">
      <h2>Conversation</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="messages-list">
        {messages.map(message => (
          <div key={message._id} className={`message-item ${message.sender === userId ? 'sent' : 'received'}`}>
            <p>{message.content}</p>
            {message.image && (
              <img src={`${API_URL}${message.image}`} alt="Message attachment" className="message-image" />
            )}
            {message.voiceMessage && (
              <audio controls src={`${API_URL}${message.voiceMessage}`} className="voice-message" />
            )}
            <div className="message-footer">
              <small className="text-muted">{new Date(message.createdAt).toLocaleString()}</small>
              <Dropdown>
                <Dropdown.Toggle variant="light" size="sm">
                  <FaSmile />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                    <Dropdown.Item key={emoji} onClick={() => handleReaction(message._id, emoji)}>
                      {emoji}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {message.reactions.length > 0 && (
              <div className="message-reactions">
                {message.reactions.map((reaction, index) => (
                  <span key={index}>{reaction.reaction}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Form onSubmit={handleSubmit} className="message-form">
        <Form.Group>
          <Form.Control
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message"
          />
        </Form.Group>
        <Form.Group controlId="image-upload">
          <Form.Label>Ajouter une image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </Form.Group>
        <div className="message-actions">
          <Button variant="outline-secondary" onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </Button>
          <Button variant="primary" type="submit">
            <FaPaperPlane />
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Messages;