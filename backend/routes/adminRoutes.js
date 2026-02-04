import express from 'express';
import {
    clearAllOrders,
    clearAllBookings
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require Super Admin privileges
router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.delete('/clear-orders', clearAllOrders);
router.delete('/clear-bookings', clearAllBookings);

export default router;
