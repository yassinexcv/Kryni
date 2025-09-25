import express from 'express';
import { body } from 'express-validator';
import { createReview } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isCustomer } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  isCustomer,
  [
    body('car').notEmpty().withMessage('Car is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ],
  createReview
);

export default router;
