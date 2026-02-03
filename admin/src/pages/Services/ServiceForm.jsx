import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServices } from '../../hooks/useServices';
import { toast } from 'react-toastify';
import serviceService from '../../services/serviceService';

const ServiceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createService, updateService } = useServices();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        isActive: true
    });

    const isEditMode = !!id;

    useEffect(() => {
        const fetchService = async () => {
            if (isEditMode) {
                setLoading(true);
                try {
                    const response = await serviceService.getService(id);
                    const service = response.data || response;
                    setFormData({
                        name: service.name,
                        description: service.description || '',
                        duration: service.duration,
                        price: service.price,
                        isActive: service.isActive
                    });
                } catch (error) {
                    toast.error('Failed to fetch service details');
                    navigate('/admin/services');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchService();
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || formData.duration <= 0 || formData.price < 0) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setLoading(true);
        let result;

        if (isEditMode) {
            result = await updateService(id, formData);
        } else {
            result = await createService(formData);
        }

        setLoading(false);

        if (result.success) {
            toast.success(`Service ${isEditMode ? 'updated' : 'created'} successfully`);
            navigate('/admin/services');
        } else {
            toast.error(result.error);
        }
    };

    if (loading && isEditMode && !formData.name) {
        return <div className="p-4">Loading form...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Service' : 'Add New Service'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Service Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                    />
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                            Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            min="15"
                            step="15"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                            Price ($) *
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="text-sm font-bold text-gray-700">Active</span>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/services')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Service' : 'Create Service')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;
