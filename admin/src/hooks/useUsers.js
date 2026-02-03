import { useState, useEffect } from 'react';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const useUsers = (autoFetch = true) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers(filters);
      setUsers(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch users';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.createUser(userData);
      toast.success(response.message || 'User created successfully');
      await fetchUsers(); // Refresh list
      return response.data;
    } catch (err) {
      let errorMsg = err.response?.data?.message || 'Failed to create user';
      if (err.response?.data?.error) {
        errorMsg += `: ${err.response.data.error}`;
      }
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.updateUser(id, userData);
      toast.success('User updated successfully');
      await fetchUsers(); // Refresh list
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update user';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.deleteUser(id);
      toast.success(response.message || 'User deleted successfully');
      await fetchUsers(); // Refresh list
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.resetPassword(id);
      toast.success('Password reset successfully');
      return response.data.tempPassword;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword
  };
};

export default useUsers;