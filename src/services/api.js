import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials:true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = useAuth();
        const newToken = await refreshToken();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        return api(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, redirigez vers la page de connexion
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
 
export const register = (username, email, password) => {
  return api.post('/auth/register', { username, email, password });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', { email });
};

export const getProfile = () => {
  return api.get('/profile');
};

export const updateProfile = (profileData) => {
  return api.put('/profile', profileData);
};

export const createListing = (listingData) => {
  return api.post('/listings', listingData);
};

export const getHostBookings = () => {
  return api.get('/bookings/host');
};

export const getGuestBookings = () => {
  return api.get('/bookings/guest');
};

export const updateBookingStatus = (bookingId, status) => {
  return api.put(`/bookings/${bookingId}/status`, { status });
};

export const blockUser = async (userId) => {
  return api.post(`/users/block/${userId}`);
};

export const unblockUser = async (userId) => {
  return api.post(`/users/unblock/${userId}`);
};

export const getBlockStatus = async (userId) => {
  return api.get(`/users/block-status/${userId}`);
};

export const getConversations = () => {
  return api.get('/messages/conversations');
};

export const getMessages = (userId) => {
  return api.get(`/messages/conversation/${userId}`);
};

export const sendMessage = (recipientId, content, image) => {
  const formData = new FormData();
  formData.append('recipientId', recipientId);
  formData.append('content', content);
  if (image) {
    formData.append('image', image);
  }
  return api.post('/messages', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export default api;