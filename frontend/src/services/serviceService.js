// src/services/serviceService.js
import api from './api';

// Get all services
export const getAllServices = async () => {
  try {
    const response = await api.get('/services');
    // Backend returns { success, count, data }
    // Extract the data array
    return response.data.data; // Return the actual services array
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Get single service by ID
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/services/${id}`);
    // Backend returns { success, data }
    return response.data.data; // Return the single service object
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};