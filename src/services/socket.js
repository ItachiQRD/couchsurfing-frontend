import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export const joinRoom = (userId) => {
  socket.emit('join', userId);
};

export const sendMessage = (recipientId, content) => {
  socket.emit('sendMessage', { recipientId, content });
};

export const onNewMessage = (callback) => {
  socket.on('newMessage', callback);
};

export default socket;