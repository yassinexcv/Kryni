import express from 'express';
import { body } from 'express-validator';
import {
  createReservation,
  getUserReservations,
  updateReservationStatus,
  cancelReservation,
} from '../controllers/reservationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isCustomer, authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  isCustomer,
  [
    body('car').notEmpty().withMessage('Car is required'),
    body('startDate').isISO8601().withMessage('Start date is required'),
    body('endDate').isISO8601().withMessage('End date is required'),
  ],
  createReservation
);

router.get('/user/:id', authenticate, getUserReservations);

router.put(
  '/:id/status',
  authenticate,
  authorizeRoles('admin', 'agency'),
  [body('status').notEmpty().withMessage('Status is required')],
  updateReservationStatus
);

router.patch('/:id/cancel', authenticate, isCustomer, cancelReservation);

export default router;
