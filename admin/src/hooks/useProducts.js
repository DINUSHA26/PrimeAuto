import { useState, useEffect } from 'react';
import productService from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAllSpareParts(params);
      setProducts(response.data || response);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const response = await productService.createSparePart(productData);
      await fetchProducts(); // Refresh the list
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create product' };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await productService.updateSparePart(id, productData);
      await fetchProducts(); // Refresh the list
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update product' };
    }
  };

  const updateProductStock = async (id, stockData) => {
    try {
      const response = await productService.updateStock(id, stockData);
      await fetchProducts(); // Refresh the list
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update stock' };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteSparePart(id);
      await fetchProducts(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete product' };
    }
  };

  const getLowStockAlerts = async () => {
    try {
      const response = await productService.getLowStockAlerts();
      return { success: true, data: response.data || response };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to fetch low stock alerts' };
    }
  };

  const getInventoryStats = async () => {
    try {
      const response = await productService.getInventoryStats();
      return { success: true, data: response.data || response };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to fetch inventory stats' };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
    getLowStockAlerts,
    getInventoryStats,
  };
};