// src/services/bookingService.js
import api from './api';

// Create new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get user bookings (optional - for future use)
export const getUserBookings = async (userId) => {
  try {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Get availability for a service on a specific date
export const getAvailability = async (serviceId, date) => {
  try {
    const response = await api.get('/bookings/availability', {
      params: { serviceId, date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
};