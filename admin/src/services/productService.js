import api from './api';

// Product/Spare Parts Service
const productService = {
  // Get all spare parts with optional filters
  getAllSpareParts: async (params = {}) => {
    try {
      const response = await api.get('/spare-parts', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single spare part by ID
  getSparePart: async (id) => {
    try {
      const response = await api.get(`/spare-parts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get spare part by part number
  getSparePartByPartNumber: async (partNumber) => {
    try {
      const response = await api.get(`/spare-parts/part-number/${partNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new spare part (requires authentication & authorization)
  createSparePart: async (sparePartData) => {
    try {
      const response = await api.post('/spare-parts', sparePartData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update spare part (requires authentication & authorization)
  updateSparePart: async (id, sparePartData) => {
    try {
      const response = await api.put(`/spare-parts/${id}`, sparePartData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update stock quantity (requires authentication & authorization)
  updateStock: async (id, stockData) => {
    try {
      const response = await api.patch(`/spare-parts/${id}/stock`, stockData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete spare part (requires Super Admin or Admin role)
  deleteSparePart: async (id) => {
    try {
      const response = await api.delete(`/spare-parts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get low stock alerts (requires authentication)
  getLowStockAlerts: async () => {
    try {
      const response = await api.get('/spare-parts/alerts/low-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get inventory statistics (requires authentication)
  getInventoryStats: async () => {
    try {
      const response = await api.get('/spare-parts/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default productService;