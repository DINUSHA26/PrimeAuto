// src/services/api.js
import axios from 'axios';

// Create axios instance with base configuration
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://primeauto-backend.onrender.com' : 'http://localhost:5000');

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  timeout: 60000, // 60 seconds timeout
});

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Normalize BASE_URL (remove trailing slash)
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

  // Normalize path (ensure leading slash)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};

// Request interceptor (optional - for adding auth tokens later)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional - for error handling)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
