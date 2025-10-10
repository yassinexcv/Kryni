import { validationResult } from 'express-validator';
import Reservation from '../models/Reservation.js';
import Car from '../models/Car.js';

const datesOverlap = (startA, endA, startB, endB) =>
  startA <= endB && endA >= startB;

export const createReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { car: carId, startDate, endDate } = req.body;

  try {
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (!car.availability) {
      return res.status(400).json({ message: 'Car is not available' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return res.status(400).json({ message: 'Invalid reservation dates' });
    }

    const existingReservations = await Reservation.find({
      car: carId,
      status: { $in: ['pending', 'confirmed'] },
    });

    const isUnavailable = existingReservations.some((reservation) =>
      datesOverlap(start, end, reservation.startDate, reservation.endDate)
    );

    if (isUnavailable) {
      return res.status(400).json({ message: 'Car already reserved for selected dates' });
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((end - start + oneDay) / oneDay);
    const totalPrice = days * car.pricePerDay;

    const reservation = await Reservation.create({
      customer: req.user._id,
      car: carId,
      startDate: start,
      endDate: end,
      totalPrice,
    });

    return res.status(201).json(reservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserReservations = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
    return res.status(403).json({ message: 'Not authorized to view these reservations' });
  }

  try {
    const reservations = await Reservation.find({ customer: id })
      .populate('car')
      .populate('customer', 'name email');

    return res.json(reservations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const reservation = await Reservation.findById(id).populate('car');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const isAgencyOwner =
      req.user.role === 'agency' &&
      reservation.car.owner.toString() === req.user._id.toString();

    if (!(req.user.role === 'admin' || isAgencyOwner)) {
      return res.status(403).json({ message: 'Not authorized to update reservation status' });
    }

    reservation.status = status;
    if (status === 'cancelled') {
      if (req.user.role !== 'admin') {
        return res
          .status(403)
          .json({ message: 'Only administrators can approve reservation cancellations' });
      }

      const now = new Date();
      const cancellationData = reservation.cancellation || {};

      if (!cancellationData.requestedAt) {
        cancellationData.requestedAt = now;
      }

      if (typeof cancellationData.refundEligible !== 'boolean') {
        const previousApprovedCancellations = await Reservation.countDocuments({
          _id: { $ne: reservation._id },
          customer: reservation.customer,
          'cancellation.status': 'approved',
        });

        cancellationData.refundEligible = previousApprovedCancellations < 2;
      }

      const carWasUnavailable = reservation.car ? reservation.car.availability === false : false;

      let hasOtherActiveReservations = false;

      if (reservation.car) {
        hasOtherActiveReservations = Boolean(
          await Reservation.exists({
            _id: { $ne: reservation._id },
            car: reservation.car._id,
            status: { $in: ['pending', 'confirmed'] },
            startDate: { $lte: reservation.endDate },
            endDate: { $gte: reservation.startDate },
          })
        );
      }

      cancellationData.status = 'approved';
      cancellationData.approvedAt = now;
      cancellationData.approvedBy = req.user._id;
      cancellationData.fraudSuspected = Boolean(!hasOtherActiveReservations && carWasUnavailable);

      reservation.cancellation = cancellationData;
      reservation.markModified('cancellation');

      reservation.status = status;

      if (reservation.car && !hasOtherActiveReservations && reservation.car.availability === false) {
        reservation.car.availability = true;
        await reservation.car.save();
      }
    } else {
      reservation.status = status;
    }

    await reservation.save();

    return res.json(reservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id).populate('car');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    if (['cancelled', 'completed'].includes(reservation.status)) {
      return res.status(400).json({ message: 'Reservation cannot be cancelled' });
    }

    if (reservation.cancellation?.status === 'pending') {
      return res.status(400).json({ message: 'Cancellation request already pending approval' });
    }

    const now = new Date();

    if (new Date(reservation.startDate) <= now) {
    if (new Date(reservation.startDate) <= new Date()) {
      return res
        .status(400)
        .json({ message: 'Cannot cancel a reservation that has already started' });
    }

    const previousApprovedCancellations = await Reservation.countDocuments({
      _id: { $ne: reservation._id },
      customer: req.user._id,
      'cancellation.status': 'approved',
    });

    const refundEligible = previousApprovedCancellations < 2;

    reservation.cancellation = {
      ...(reservation.cancellation || {}),
      status: 'pending',
      requestedAt: now,
      refundEligible,
      fraudSuspected: false,
    };

    reservation.markModified('cancellation');

    await reservation.save();

    return res.json({
      message: 'Cancellation request submitted and awaiting admin approval',
      reservation,
    });
    reservation.status = 'cancelled';
    await reservation.save();

    return res.json(reservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
