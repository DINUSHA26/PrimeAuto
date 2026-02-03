import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    // Relaxed regex to allow + symbols and wider domain formats
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER', 'INVENTORY_STAFF', 'VIEW_ONLY', 'CUSTOMER'],
    default: 'CUSTOMER'
  },

  permissions: {
    canManageUsers: { type: Boolean, default: false },
    canManageProducts: { type: Boolean, default: false },
    canManageServices: { type: Boolean, default: false },
    canManageBookings: { type: Boolean, default: false },
    canDeleteProducts: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// IMPORTANT: When using async/await in pre-save hooks, DON'T use next()
// Just use async function without the next parameter

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Set permissions based on role before saving
userSchema.pre('save', function () {
  // Set permissions based on role
  switch (this.role) {
    case 'SUPER_ADMIN':
      this.permissions = {
        canManageUsers: true,
        canManageProducts: true,
        canManageServices: true,
        canManageBookings: true,
        canDeleteProducts: true,
        canViewReports: true
      };
      break;
    case 'ADMIN':
      this.permissions = {
        canManageUsers: false,
        canManageProducts: true,
        canManageServices: true,
        canManageBookings: true,
        canDeleteProducts: true,
        canViewReports: true
      };
      break;
    case 'SERVICE_MANAGER':
      this.permissions = {
        canManageUsers: false,
        canManageProducts: false,
        canManageServices: true,
        canManageBookings: true,
        canDeleteProducts: false,
        canViewReports: true
      };
      break;
    case 'INVENTORY_STAFF':
      this.permissions = {
        canManageUsers: false,
        canManageProducts: true,
        canManageServices: false,
        canManageBookings: false,
        canDeleteProducts: false,
        canViewReports: false
      };
      break;
    case 'VIEW_ONLY':
      this.permissions = {
        canManageUsers: false,
        canManageProducts: false,
        canManageServices: false,
        canManageBookings: false,
        canDeleteProducts: false,
        canViewReports: true
      };
      break;
    case 'CUSTOMER':
      this.permissions = {
        canManageUsers: false,
        canManageProducts: false,
        canManageServices: false,
        canManageBookings: false,
        canDeleteProducts: false,
        canViewReports: false
      };
      break;
  }

});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      permissions: this.permissions
    },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
};

export default mongoose.model('User', userSchema);