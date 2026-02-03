import { useState, useEffect, useCallback } from 'react';
import serviceService from '../services/serviceService';

export const useServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchServices = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await serviceService.getAllServices(params);
            setServices(response.data || response);
        } catch (err) {
            setError(err.message || 'Failed to fetch services');
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createService = async (serviceData) => {
        try {
            const response = await serviceService.createService(serviceData);
            await fetchServices();
            return { success: true, data: response.data || response };
        } catch (err) {
            return { success: false, error: err.message || 'Failed to create service' };
        }
    };

    const updateService = async (id, serviceData) => {
        try {
            const response = await serviceService.updateService(id, serviceData);
            await fetchServices();
            return { success: true, data: response.data || response };
        } catch (err) {
            return { success: false, error: err.message || 'Failed to update service' };
        }
    };

    const deleteService = async (id) => {
        try {
            await serviceService.deleteService(id);
            await fetchServices();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || 'Failed to delete service' };
        }
    };

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    return {
        services,
        loading,
        error,
        fetchServices,
        createService,
        updateService,
        deleteService
    };
};

export default useServices;
