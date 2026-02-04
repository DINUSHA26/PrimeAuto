import Order from '../models/Order.js';
import Booking from '../models/Booking.js';

// @desc    Clear all orders
// @route   DELETE /api/admin/clear-orders
// @access  Private/Super Admin
export const clearAllOrders = async (req, res) => {
    try {
        // Double check it's super admin (middleware does this, but extra layer if needed)
        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to perform this action'
            });
        }

        await Order.deleteMany({});

        res.status(200).json({
            success: true,
            message: 'All orders have been cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing orders',
            error: error.message
        });
    }
};

// @desc    Clear all bookings
// @route   DELETE /api/admin/clear-bookings
// @access  Private/Super Admin
export const clearAllBookings = async (req, res) => {
    try {
        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to perform this action'
            });
        }

        await Booking.deleteMany({});

        res.status(200).json({
            success: true,
            message: 'All bookings have been cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing bookings',
            error: error.message
        });
    }
};
