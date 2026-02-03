import React, { useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { toast } from 'react-toastify';

const BookingsList = () => {
    const { bookings, loading, error, updateBookingStatus } = useBookings();
    const [filterStatus, setFilterStatus] = useState('all');

    const handleStatusChange = async (id, newStatus) => {
        if (newStatus === 'cancelled' && !window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }
        const result = await updateBookingStatus(id, newStatus);
        if (result.success) {
            toast.success(`Booking marked as ${newStatus}`);
        } else {
            toast.error(result.error);
        }
    };

    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    if (loading) return <div className="p-4">Loading bookings...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bookings</h2>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer / Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bay</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                                        <div className="text-sm text-gray-500">{booking.vehicleModel} ({booking.vehicleNumber})</div>
                                        <div className="text-xs text-gray-400">{booking.customerPhone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.service?.name || 'Unknown Service'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                                        <div>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Bay {booking.bayNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    booking.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        booking.status === 'confirmed' ? 'bg-indigo-100 text-indigo-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                            <div className="flex justify-end gap-2">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded text-xs"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'in-progress')}
                                                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-xs"
                                                    >
                                                        Start
                                                    </button>
                                                )}
                                                {booking.status === 'in-progress' && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'completed')}
                                                        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingsList;
