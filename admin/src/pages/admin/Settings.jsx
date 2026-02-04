import React, { useState } from 'react';
import { FaExclamationTriangle, FaTrash, FaShieldAlt } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const Settings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ show: false, action: null, title: '', message: '' });

    // Only Super Admin can see this
    if (user?.role !== 'SUPER_ADMIN') {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <p className="mt-4 text-gray-600">You do not have permission to access these settings.</p>
            </div>
        );
    }

    const handleAction = async () => {
        setLoading(true);
        try {
            if (confirmModal.action === 'clear_orders') {
                const res = await adminService.clearAllOrders();
                toast.success(res.message);
            } else if (confirmModal.action === 'clear_bookings') {
                const res = await adminService.clearAllBookings();
                toast.success(res.message);
            }
        } catch (error) {
            toast.error(error.message || 'Action failed');
        } finally {
            setLoading(false);
            setConfirmModal({ ...confirmModal, show: false });
        }
    };

    const openConfirm = (action, title, message) => {
        setConfirmModal({ show: true, action, title, message });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <FaCog className="text-slate-400" />
                    System Settings
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage system-wide configurations and data.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaShieldAlt className="text-red-500" />
                        Danger Zone
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Irreversible actions. Tread carefully!
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Clear Orders */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-red-100 rounded-xl bg-red-50/50">
                        <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-red-900">Clear All Orders</h3>
                            <p className="text-sm text-red-700 mt-1">
                                Permanently delete EVERY order in the database. Product stock will NOT be reverted.
                            </p>
                        </div>
                        <button
                            onClick={() => openConfirm('clear_orders', 'Clear All Orders', 'Are you absolutely sure? This will delete all order history permanently. This action cannot be undone.')}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors shadow-sm flex items-center gap-2"
                        >
                            <FaTrash size={14} /> Clear Orders
                        </button>
                    </div>

                    {/* Clear Bookings */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-red-100 rounded-xl bg-red-50/50">
                        <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-red-900">Clear All Bookings</h3>
                            <p className="text-sm text-red-700 mt-1">
                                Permanently delete ALL service bookings. Schedule slots will be freed up.
                            </p>
                        </div>
                        <button
                            onClick={() => openConfirm('clear_bookings', 'Clear All Bookings', 'Are you absolutely sure? This will delete all booking history permanently. This action cannot be undone.')}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors shadow-sm flex items-center gap-2"
                        >
                            <FaTrash size={14} /> Clear Bookings
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <FaExclamationTriangle className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold">{confirmModal.title}</h3>
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {confirmModal.message}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAction}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? 'Processing...' : 'Yes, Delete Everything'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Cog Icon for import if not passed, but Sidebar passes it. 
// Actually we need to import FaCog in this file
import { FaCog } from 'react-icons/fa';

export default Settings;
