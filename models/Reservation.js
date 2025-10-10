import mongoose from 'mongoose';

const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    cancellation: {
      status: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
      },
      requestedAt: Date,
      approvedAt: Date,
      approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      refundEligible: {
        type: Boolean,
        default: true,
      },
      fraudSuspected: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
