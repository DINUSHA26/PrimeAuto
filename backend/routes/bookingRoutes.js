import express from 'express';
import {
  getAvailability,
  createBooking,
  getAllBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getBaySchedule,
  getMyBookings
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/availability', getAvailability);

// Private routes
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.delete('/:id', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAllBookings);
router.patch('/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateBookingStatus);
router.get('/schedule/:date', protect, authorize('ADMIN', 'SUPER_ADMIN'), getBaySchedule);

export default router;