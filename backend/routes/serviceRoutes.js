import express from 'express';
import {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Admin routes (add authentication middleware in production)
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;