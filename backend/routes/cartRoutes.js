import express from 'express';
import { getCart, syncCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All cart routes are protected

router.route('/')
    .get(getCart)
    .delete(clearCart);

router.post('/sync', syncCart);

export default router;
