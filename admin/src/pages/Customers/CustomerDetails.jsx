import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import bookingService from '../../services/bookingService';
import api from '../../services/api';
import {
    FaUser, FaEnvelope, FaCalendarAlt, FaHistory,
    FaArrowLeft, FaBox, FaWrench, FaClock, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const CustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]); // In case we add booking fetching
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Fetch Customer Details
                const userData = await userService.getUser(id);
                setCustomer(userData);

                // 2. Fetch Orders for this user
                const ordersResponse = await api.get('/orders', { params: { userId: id } });
                setOrders(ordersResponse.data.data || []);

                // 3. Fetch Bookings for this user
                // Ideally bookingService should support userId param
                try {
                    // Check if GetAllBookings supports userId
                    const bookingsData = await bookingService.getAllBookings({ userId: id });
                    setBookings(bookingsData.data || []);
                } catch (bErr) {
                    console.error("Error fetching bookings:", bErr);
                    setBookings([]);
                }

            } catch (error) {
                console.error('Error fetching customer details:', error);
                toast.error('Failed to load customer information');
                navigate('/admin/customers');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, navigate]);

    const getStatusColor = (status) => {
        const lower = status?.toLowerCase();
        if (lower === 'delivered' || lower === 'completed' || lower === 'confirmed') return 'bg-green-100 text-green-700';
        if (lower === 'pending') return 'bg-yellow-100 text-yellow-700';
        if (lower === 'cancelled') return 'bg-red-100 text-red-700';
        if (lower === 'shipped' || lower === 'processing' || lower === 'in-progress') return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold">Loading profile...</p>
            </div>
        );
    }

    if (!customer) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <button
                onClick={() => navigate('/admin/customers')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-medium transition-colors"
            >
                <FaArrowLeft /> Back to Customers
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 mb-8 border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-lg ring-4 ring-white">
                    {customer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-black text-slate-800 mb-2">{customer.name}</h1>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <FaEnvelope className="text-blue-500" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <FaCalendarAlt className="text-blue-500" /> Joined {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-wider text-xs font-bold">
                            Role: {customer.role}
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-3xl font-black text-slate-800">{orders.length}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Orders</div>
                    </div>
                    <div className="text-center px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-3xl font-black text-slate-800">{bookings.length}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bookings</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order History */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg font-black text-slate-700 flex items-center gap-3">
                            <FaBox className="text-blue-500" /> Order History
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[500px]">
                        {orders.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <FaBoxOpen className="text-4xl mx-auto mb-3 opacity-30" />
                                <p>No orders found for this customer.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 font-bold text-slate-400 uppercase text-xs">ID</th>
                                        <th className="px-6 py-3 font-bold text-slate-400 uppercase text-xs">Date</th>
                                        <th className="px-6 py-3 font-bold text-slate-400 uppercase text-xs">Amount</th>
                                        <th className="px-6 py-3 font-bold text-slate-400 uppercase text-xs">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.map(order => (
                                        <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Booking History */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg font-black text-slate-700 flex items-center gap-3">
                            <FaWrench className="text-indigo-500" /> Booking History
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[500px]">
                        {bookings.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <FaHistory className="text-4xl mx-auto mb-3 opacity-30" />
                                <p>No bookings found for this customer.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 font-bold text-slate-400 uppercase text-xs">Service</th>
                                        <th className="px-6 py-3 font-bold text-slate-400 uppercase text-xs">Date & Time</th>
                                        <th className="px-6 py-3 font-bold text-slate-400 uppercase text-xs">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings.map(booking => (
                                        <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-700">
                                                {booking.service?.name || 'Unknown Service'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                                    <span className="text-xs text-slate-400">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;
