import express from 'express';
import { login, register, getCurrentUser, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

export default router;