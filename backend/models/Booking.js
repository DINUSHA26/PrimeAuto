import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {

    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    trim: true,
    uppercase: true
  },
  vehicleModel: {
    type: String,
    trim: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service selection is required']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  bayNumber: {
    type: Number,
    required: [true, 'Bay number is required'],
    enum: [1, 2, 3],
    min: 1,
    max: 3
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index for efficient availability queries
bookingSchema.index({ bookingDate: 1, bayNumber: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ status: 1, bookingDate: 1 });
bookingSchema.index({ customerEmail: 1, bookingDate: -1 });

// Method to check if booking overlaps with another booking
bookingSchema.methods.hasOverlap = function (otherStartTime, otherEndTime) {
  return (otherStartTime < this.endTime) && (otherEndTime > this.startTime);
};

export default mongoose.model('Booking', bookingSchema);