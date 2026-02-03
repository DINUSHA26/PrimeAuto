import express from 'express';
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, authorize('ADMIN', 'SUPER_ADMIN'), getAllOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .patch(protect, authorize('ADMIN', 'SUPER_ADMIN'), updateOrderStatus);

export default router;

