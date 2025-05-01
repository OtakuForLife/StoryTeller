import axios from 'axios';

// Create an instance of axios with default configuration
const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_BACKEND_HOST || 'localhost'}:${import.meta.env.VITE_BACKEND_PORT || '8000'}`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // This is important for sending cookies with requests
});

export default api;