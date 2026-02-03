import express from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Super Admin only routes
router.get('/', authorize('SUPER_ADMIN'), getAllUsers);
router.post('/', authorize('SUPER_ADMIN'), createUser);
router.delete('/:id', authorize('SUPER_ADMIN'), deleteUser);
router.post('/:id/reset-password', authorize('SUPER_ADMIN'), resetPassword);

// Super Admin and the user themselves can view/update
router.get('/:id', getUser);
router.put('/:id', updateUser);

export default router;