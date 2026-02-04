import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER', 'INVENTORY_STAFF', 'VIEW_ONLY'), getDashboardStats);

export default router;
