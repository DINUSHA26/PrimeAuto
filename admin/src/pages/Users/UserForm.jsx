import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import userService from '../../services/userService';
import { toast } from 'react-toastify';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createUser, updateUser } = useUsers(false); // Disable autoFetch
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'VIEW_ONLY'
  });

  const isEditMode = !!id;

  useEffect(() => {
    const fetchUser = async () => {
      if (isEditMode) {
        setLoading(true);
        try {
          const user = await userService.getUser(id);
          setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '' // Don't populate password
          });
        } catch (error) {
          toast.error('Failed to fetch user details');
          navigate('/admin/users');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEditMode) {
        // Remove password if empty in edit mode
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) {
          delete dataToUpdate.password;
        }
        await updateUser(id, dataToUpdate);
      } else {
        await createUser(formData);
      }
      // Success toast is handled by useUsers hook
      // Add a small delay to ensure toast is seen before nav (optional, but good for UX)
      setTimeout(() => {
        navigate('/admin/users');
      }, 500);
    } catch (error) {
      // handled by hook
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit User' : 'Create New User'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
              minLength={6}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER_MANAGER">Customer Manager</option>
              <option value="SERVICE_MANAGER">Service Manager</option>
              <option value="INVENTORY_STAFF">Inventory Staff</option>
              <option value="VIEW_ONLY">View Only</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select the appropriate role for this user. Super Admins have full access.
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
