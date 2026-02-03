import api from './api';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'primeauto_token';

const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      // Store token in cookie
      Cookies.set(TOKEN_KEY, response.data.data.token, { expires: 7 }); // 7 days
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove(TOKEN_KEY);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Get token from cookie
  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!Cookies.get(TOKEN_KEY);
  }
};

export default authService;