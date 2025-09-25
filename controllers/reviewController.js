import { validationResult } from 'express-validator';
import Review from '../models/Review.js';
import Reservation from '../models/Reservation.js';

export const createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { car, rating, comment } = req.body;

  try {
    const reservation = await Reservation.findOne({
      car,
      customer: req.user._id,
      status: { $in: ['completed', 'confirmed'] },
    });

    if (!reservation) {
      return res.status(403).json({ message: 'No eligible reservation found for this car' });
    }

    const review = await Review.create({
      car,
      customer: req.user._id,
      rating,
      comment,
    });

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
