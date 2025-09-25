import express from 'express';
import { body } from 'express-validator';
import { getCars, createCar, updateCar, deleteCar } from '../controllers/carController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAgency } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', getCars);

router.post(
  '/',
  authenticate,
  isAgency,
  [
    body('brand').notEmpty().withMessage('Brand is required'),
    body('model').notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1900 }).withMessage('Year must be valid'),
    body('city').notEmpty().withMessage('City is required'),
    body('pricePerDay').isFloat({ min: 0 }).withMessage('Price per day must be positive'),
  ],
  createCar
);

router.put('/:id', authenticate, isAgency, updateCar);
router.delete('/:id', authenticate, isAgency, deleteCar);

export default router;
