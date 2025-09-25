import { validationResult } from 'express-validator';
import Car from '../models/Car.js';
import Reservation from '../models/Reservation.js';

export const getCars = async (req, res) => {
  const { city, type, minPrice, maxPrice, startDate, endDate } = req.query;

  const query = {};

  if (city) {
    query.city = { $regex: new RegExp(city, 'i') };
  }

  if (type) {
    query.type = { $regex: new RegExp(type, 'i') };
  }

  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) {
      query.pricePerDay.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.pricePerDay.$lte = Number(maxPrice);
    }
  }

  try {
    let availableCarsQuery = Car.find(query).populate('owner', 'name email');

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid date range' });
      }

      const overlappingReservations = await Reservation.find({
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } },
        ],
      }).select('car');

      const unavailableCarIds = overlappingReservations.map((reservation) => reservation.car);
      availableCarsQuery = availableCarsQuery.where('_id').nin(unavailableCarIds);
    }

    const cars = await availableCarsQuery.exec();

    return res.json(cars);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (req.user.role !== 'agency') {
      return res.status(403).json({ message: 'Only agencies can add cars' });
    }

    if (!req.user.isValidated) {
      return res.status(403).json({ message: 'Agency account not validated' });
    }

    const car = await Car.create({
      ...req.body,
      owner: req.user._id,
    });

    return res.status(201).json(car);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCar = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this car' });
    }

    Object.assign(car, req.body);
    await car.save();

    return res.json(car);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this car' });
    }

    await car.deleteOne();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
