import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaUser, FaBox, FaCalendarCheck, FaSignOutAlt, FaChevronRight, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const [ordersRes, bookingsRes] = await Promise.all([
                    api.get('/orders/myorders'),
                    api.get('/bookings/mybookings')
                ]);
                setOrders(ordersRes.data.data);
                setBookings(bookingsRes.data.data);
            } catch (err) {
                console.error('Error fetching profile data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (authLoading || !user) {
        return <div className="min-h-screen pt-32 text-center">Loading profile...</div>;
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
            case 'confirmed':
                return 'text-green-600 bg-green-50';
            case 'pending':
            case 'processing':
                return 'text-blue-600 bg-blue-50';
            case 'cancelled':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Profile Section */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                        <div className="bg-blue-600 h-32 relative">
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white text-blue-600">
                                    <FaUser size={40} />
                                </div>
                            </div>
                        </div>
                        <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                                <p className="text-gray-500 font-medium">{user.email}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">{user.role}</span>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
                            >
                                <FaSignOutAlt />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Selectors */}
                        <div className="lg:w-1/4 space-y-4">
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaCalendarCheck />
                                    My Bookings
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'bookings' ? 'bg-white/20' : 'bg-gray-100'}`}>{bookings.length}</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaBox />
                                    Order History
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white/20' : 'bg-gray-100'}`}>{orders.length}</span>
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="lg:w-3/4">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                        <div className="animate-spin mb-4"><FaClock size={32} /></div>
                                        <p>Fetching your data...</p>
                                    </div>
                                ) : activeTab === 'bookings' ? (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                            <FaCalendarCheck className="text-blue-600" />
                                            Service Bookings
                                        </h2>
                                        {bookings.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-gray-400 mb-4">No bookings found</p>
                                                <button onClick={() => navigate('/services')} className="text-blue-600 font-bold hover:underline">Schedule your first service</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {bookings.map(booking => (
                                                    <div key={booking._id} className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors shadow-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="font-bold text-gray-800 text-lg">{booking.service?.name}</h3>
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500">
                                                            <div className="flex items-center gap-2">
                                                                <FaClock className="text-gray-300" />
                                                                {new Date(booking.bookingDate).toLocaleDateString()}
                                                            </div>
                                                            <div className="flex items-center gap-2 font-bold text-gray-700">
                                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            <div className="col-span-2 md:col-span-1 text-xs bg-gray-50 p-2 rounded-lg italic">
                                                                Bay: {booking.bayNumber} | Vehicle: {booking.vehicleNumber}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                            <FaBox className="text-blue-600" />
                                            Product Orders
                                        </h2>
                                        {orders.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-gray-400 mb-4">No orders found</p>
                                                <button onClick={() => navigate('/products')} className="text-blue-600 font-bold hover:underline">Browse spare parts</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {orders.map(order => (
                                                    <div key={order._id} className="p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors shadow-sm bg-gray-50/30">
                                                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
                                                                <p className="font-mono text-xs text-blue-600 uppercase">#{order._id.slice(-8)}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</p>
                                                                    <p className="font-black text-gray-900">${order.totalPrice.toFixed(2)}</p>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                                            {order.orderItems.map((item, idx) => (
                                                                <div key={idx} className="flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden" title={item.name}>
                                                                    <img src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                            ))}
                                                            {order.orderItems.length > 5 && (
                                                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                                    +{order.orderItems.length - 5}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
