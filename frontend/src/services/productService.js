// src/services/productService.js
import api from './api';

// Get all spare parts (products)
export const getAllProducts = async () => {
  try {
    const response = await api.get('/spare-parts');
    
    // DEBUG logs
    console.log('Full response:', response);
    console.log('response.data:', response.data);
    
    // Backend returns { success, count, data }
    // Extract the data array
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // Fallback
    return [];
    
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

// Get single spare part by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/spare-parts/${id}`);
    
    console.log('Single product response:', response.data);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get products by category (optional)
export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/spare-parts?category=${category}`);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Search products (optional)
export const searchProducts = async (searchQuery) => {
  try {
    const response = await api.get(`/spare-parts?search=${searchQuery}`);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};