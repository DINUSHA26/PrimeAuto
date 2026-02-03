import express from 'express';
import {
  getAllSpareParts,
  getSparePart,
  getSparePartByPartNumber,
  createSparePart,
  updateSparePart,
  updateStock,
  deleteSparePart,
  getLowStockAlerts,
  getInventoryStats
} from '../controllers/sparePartController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllSpareParts);
router.get('/part-number/:partNumber', getSparePartByPartNumber);
router.get('/:id', getSparePart);

// Protected routes - require authentication
router.get('/stats', protect, getInventoryStats);
router.get('/alerts/low-stock', protect, getLowStockAlerts);

// Admin and above can create/update
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF'), upload.single('image'), createSparePart);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF'), upload.single('image'), updateSparePart);
router.patch('/:id/stock', protect, authorize('SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF'), updateStock);

// Only Super Admin and Admin can delete
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteSparePart);

export default router;