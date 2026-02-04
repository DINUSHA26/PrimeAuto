import api from './api';

const adminService = {
    // Clear all orders
    clearAllOrders: async () => {
        try {
            const response = await api.delete('/admin/clear-orders');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Clear all bookings
    clearAllBookings: async () => {
        try {
            const response = await api.delete('/admin/clear-bookings');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default adminService;
