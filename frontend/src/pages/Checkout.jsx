import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaTruck, FaCreditCard, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Checkout = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
        }
        if (cartItems.length === 0 && !success) {
            navigate('/products');
        }
    }, [isAuthenticated, cartItems, navigate, success]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            shippingAddress,
            paymentMethod: 'Cash on Delivery',
            totalPrice: totalPrice
        };

        try {
            await api.post('/orders', orderData);
            setSuccess(true);
            clearCart();
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 animate-bounce">
                    <FaCheckCircle className="text-5xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">Thank you for your purchase. Your order has been received and is being processed.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-black mb-10 tracking-tighter">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Checkout Form */}
                    <div className="lg:w-2/3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <FaTruck />
                                    </div>
                                    Shipping Information
                                </h3>

                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm mb-6 flex items-center gap-2">
                                        <FaExclamationTriangle />
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            placeholder="Street Number, Area, Landmark"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={shippingAddress.address}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            placeholder="City Name"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={shippingAddress.city}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            required
                                            placeholder="000000"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={shippingAddress.postalCode}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={shippingAddress.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <FaCreditCard />
                                    </div>
                                    Payment Method
                                </h3>
                                <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white"></div>
                                        <span className="font-bold text-gray-800">Cash on Delivery</span>
                                    </div>
                                    <span className="text-blue-600 font-bold">Default</span>
                                </div>
                                <p className="mt-4 text-sm text-gray-500 italic">"Pay when you receive your spare parts at your doorstep."</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-70"
                            >
                                {loading ? 'Processing Order...' : `Place Order - $${totalPrice.toFixed(2)}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-bold mb-6">In Your Cart</h2>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/150'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-blue-600 font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-px bg-gray-100 mb-6"></div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-green-600 font-bold">Free</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Grand Total</span>
                                <span className="text-xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
