import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';

export const useBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookingService.getAllBookings(params);
            setBookings(response.data || response);
        } catch (err) {
            setError(err.message || 'Failed to fetch bookings');
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBookingStatus = async (id, status) => {
        try {
            const response = await bookingService.updateBookingStatus(id, status);
            await fetchBookings(); // Refresh the list
            return { success: true, data: response.data || response };
        } catch (err) {
            return { success: false, error: err.message || 'Failed to update booking status' };
        }
    };

    const deleteBooking = async (id) => {
        try {
            await bookingService.deleteBooking(id);
            await fetchBookings(); // Refresh the list
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || 'Failed to delete booking' };
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return {
        bookings,
        loading,
        error,
        fetchBookings,
        updateBookingStatus,
        deleteBooking
    };
};

export default useBookings;
