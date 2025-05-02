import axios from 'axios';

// Create an instance of axios with default configuration
const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_BACKEND_HOST || 'localhost'}:${import.meta.env.VITE_BACKEND_PORT || '8000'}`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // This is important for sending cookies with requests
});

// Store the CSRF token
let csrfToken = '';

// Function to set the CSRF token
export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

// Add a request interceptor to include CSRF token in all non-GET requests
api.interceptors.request.use(config => {
  // Only add CSRF token for non-GET requests
  if (config.method !== 'get' && csrfToken) {
    config.headers['X-Csrftoken'] = csrfToken;
  }
  return config;
});

export default api;
