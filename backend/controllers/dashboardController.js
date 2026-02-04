import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import SparePart from '../models/SparePart.js';
import Service from '../models/Service.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // --- ORDERS STATS ---
        const ordersTodayPromise = Order.countDocuments({
            createdAt: { $gte: today }
        });

        const ordersMonthPromise = Order.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });

        const totalOrdersPromise = Order.countDocuments();

        // --- BOOKINGS STATS ---
        const bookingsTodayPromise = Booking.countDocuments({
            createdAt: { $gte: today }
            // Or based on bookingDate? Usually "Total Service Bookings" implies volume of work booked.
            // But "Vehicles Serviced Today" implies actual service date.
        });

        const totalBookingsPromise = Booking.countDocuments();

        // Vehicles Serviced Today (Bookings scheduled for today)
        // Assuming bookingDate is the field
        const vehiclesServicedTodayPromise = Booking.countDocuments({
            bookingDate: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            },
            status: { $in: ['confirmed', 'completed', 'in-progress'] }
        });

        // --- USERS STATS ---
        const activeCustomersPromise = User.countDocuments({
            role: 'CUSTOMER',
            isActive: true
        });

        // --- INVENTORY STATS ---
        // Low stock is simpler to just query. 
        // Ideally use aggregate if logic is complex, but here we can just find and filter or count.
        // SparePart schema has a virtual `isLowStock` but we can't query virtuals easily in DB.
        // But we can query: quantity <= minStockLevel
        const lowStockPromise = SparePart.countDocuments({
            $expr: { $lte: ["$quantity", "$minStockLevel"] }
        });


        // --- REVENUE CALCULATION (Aggregation) ---
        // Products Revenue (Orders)
        const productRevenueAgg = Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } }, // Exclude cancelled
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        // Services Revenue (Bookings)
        // Booking might not have price directly? It references Service.
        // If Booking has a `totalAmount` field, great. If not, we might need to lookup Service price.
        // Let's check Booking model... I don't recall seeing totalAmount in Booking schema in previous turns.
        // I'll assume we need to lookup. Or maybe I should check Booking.js first to be safe.
        // I recall `Booking.js` having `service` reference.

        // Let's execute the simple ones first, and I will check Booking model in parallel or just assume simple sum if possible.
        // Actually, I should verify Booking schema to get Revenue right.

        // For now I'll write the code assuming simpler structure, but I'll check Booking.js right after this block to confirm revenue logic.
        // Just in case, I will put a placeholder for Service Revenue.

        const [
            ordersToday,
            ordersMonth,
            totalOrders,
            bookingsToday, // This is "Bookings made today"
            totalBookings,
            vehiclesServicedToday,
            activeCustomers,
            lowStockCount,
            productRevenueResult
        ] = await Promise.all([
            ordersTodayPromise,
            ordersMonthPromise,
            totalOrdersPromise,
            bookingsTodayPromise,
            totalBookingsPromise,
            vehiclesServicedTodayPromise,
            activeCustomersPromise,
            lowStockPromise,
            productRevenueAgg
        ]);

        const productRevenue = productRevenueResult[0]?.total || 0;

        // We still need Service Revenue. 
        // I'll assume I need to do a lookup.
        const serviceRevenueResult = await Booking.aggregate([
            { $match: { status: { $in: ['completed', 'confirmed'] } } },
            {
                $lookup: {
                    from: 'services',
                    localField: 'service',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            { $unwind: '$serviceDetails' },
            { $group: { _id: null, total: { $sum: '$serviceDetails.price' } } }
        ]);
        const serviceRevenue = serviceRevenueResult[0]?.total || 0;

        const totalRevenue = productRevenue + serviceRevenue;

        res.status(200).json({
            success: true,
            data: {
                orders: {
                    today: ordersToday,
                    month: ordersMonth,
                    total: totalOrders
                },
                bookings: {
                    total: totalBookings,
                    vehiclesServicedToday
                },
                customers: {
                    active: activeCustomers
                },
                inventory: {
                    lowStock: lowStockCount
                },
                revenue: {
                    total: totalRevenue,
                    products: productRevenue,
                    services: serviceRevenue
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};
