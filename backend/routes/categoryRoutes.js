import express from 'express';
import {
    getAllCategories,
    createCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF'), createCategory);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteCategory);

export default router;
