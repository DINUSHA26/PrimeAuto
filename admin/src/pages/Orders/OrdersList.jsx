import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaEye, FaCheck, FaTruck, FaTimes, FaSearch, FaMapMarkerAlt, FaPhone, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../services/api';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders');
            setOrders(data.data);
            setError(null);
        } catch (err) {
            console.error('Fetch orders error:', err);
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders(); // Refresh list to show updated status and potential stock changes
            if (selectedOrder && selectedOrder._id === orderId) {
                // If the updated order is open in modal, refresh its data too
                const { data } = await api.get(`/orders/${orderId}`);
                setSelectedOrder(data.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const openOrderDetails = async (orderId) => {
        try {
            const { data } = await api.get(`/orders/${orderId}`);
            setSelectedOrder(data.data);
            setIsModalOpen(true);
        } catch (err) {
            toast.error('Failed to load order details');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Product Orders</h1>
                    <p className="text-slate-500 text-sm">Manage customer orders and track fulfillment</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search ID, Customer..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all shadow-sm font-medium"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-bold">Loading orders...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border border-red-100 italic">
                    {error}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[10px] text-blue-600 font-bold">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800">{order.user?.name}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-black text-slate-900">${order.totalPrice.toFixed(2)}</div>
                                            <div className="text-[10px] text-slate-400">{order.orderItems?.length || 0} items</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 text-xl">
                                                <button
                                                    onClick={() => openOrderDetails(order._id)}
                                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                {order.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'Processing')}
                                                        className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-all"
                                                        title="Mark as Processing"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}
                                                {order.status === 'Processing' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Mark as Shipped"
                                                    >
                                                        <FaTruck />
                                                    </button>
                                                )}
                                                {(order.status === 'Shipped' || order.status === 'Processing') && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                                        className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                                                        title="Mark as Delivered"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}
                                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Cancel Order"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200 flex flex-col">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-black text-slate-800">Order Details</h2>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <p className="text-slate-400 font-mono text-xs">ID: #{selectedOrder._id.toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 transition-all hover:rotate-90"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Side: Customer & Shipping */}
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                                            Customer Information
                                        </h3>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xl">
                                                    {selectedOrder.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-lg">{selectedOrder.user?.name}</p>
                                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                                        <FaSearch className="text-[10px]" /> {selectedOrder.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                                            Delivery Address
                                        </h3>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <FaMapMarkerAlt className="text-slate-400 mt-1" />
                                                <div>
                                                    <p className="font-bold text-slate-700">{selectedOrder.shippingAddress?.address}</p>
                                                    <p className="text-sm text-slate-500">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 pt-2 border-t border-slate-200/50">
                                                <FaPhone className="text-slate-400" />
                                                <p className="font-bold text-slate-700 text-sm">{selectedOrder.shippingAddress?.phone}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Side: Order Items */}
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                        Order Items
                                    </h3>
                                    <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                                        <div className="p-2 space-y-1">
                                            {selectedOrder.orderItems?.map((item, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-xl flex items-center gap-4 border border-slate-100">
                                                    <div className="w-14 h-14 rounded-lg bg-slate-50 flex-shrink-0 p-1">
                                                        <img
                                                            src={getImageUrl(item.image) || 'https://via.placeholder.com/150'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-md"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                                                        <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-slate-900 text-sm">${(item.quantity * item.price).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-6 bg-slate-100/50 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Subtotal</span>
                                                <span className="font-black text-slate-700">${selectedOrder.totalPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Shipping</span>
                                                <span className="font-black text-green-600">FREE</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                                <span className="font-black text-slate-800">Total</span>
                                                <span className="text-2xl font-black text-blue-600">${selectedOrder.totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer: Quick Actions */}
                        <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                            {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                                <button
                                    onClick={() => handleStatusUpdate(selectedOrder._id, 'Delivered')}
                                    className="px-6 py-3 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-green-600/20"
                                >
                                    <FaCheck /> Mark as Delivered & Update Stock
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersList;
