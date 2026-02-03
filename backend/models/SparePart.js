import mongoose from 'mongoose';

const sparePartSchema = new mongoose.Schema({
  partNumber: {
    type: String,
    required: [true, 'Part number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['engine', 'transmission', 'brakes', 'suspension', 'electrical', 'body', 'filters', 'fluids', 'other'],
    lowercase: true
  },
  brand: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 5,
    min: [0, 'Minimum stock level cannot be negative']
  },
  location: {
    shelf: String,
    bin: String
  },
  compatibleVehicles: [{
    make: String,
    model: String,
    year: String
  }],
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual field to check if stock is low
sparePartSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.minStockLevel;
});

// Index for efficient queries
sparePartSchema.index({ category: 1, isActive: 1 });
sparePartSchema.index({ name: 'text', description: 'text' });

// Ensure virtuals are included in JSON
sparePartSchema.set('toJSON', { virtuals: true });
sparePartSchema.set('toObject', { virtuals: true });

export default mongoose.model('SparePart', sparePartSchema);