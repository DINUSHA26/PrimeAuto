import User from '../models/User.js';
import crypto from 'crypto';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Super Admin
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;

    const filter = {};

    // Customer Manager can ONLY see customers
    if (req.user.role === 'CUSTOMER_MANAGER') {
      filter.role = 'CUSTOMER';
    } else if (role) {
      filter.role = role;
    }

    // Default to active users only if not specified
    if (isActive === undefined) {
      filter.isActive = true;
    } else if (isActive === 'true') {
      filter.isActive = true;
    } else if (isActive === 'false') {
      filter.isActive = false;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Super Admin
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Customer Manager can only view customers
    if (req.user.role === 'CUSTOMER_MANAGER' && user.role !== 'CUSTOMER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view Customer profiles'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Super Admin
export const createUser = async (req, res) => {
  try {
    let { name, role, password } = req.body;
    const email = req.body.email ? req.body.email.toLowerCase() : '';

    // Customer Manager can ONLY create Customers
    if (req.user.role === 'CUSTOMER_MANAGER') {
      if (role && role !== 'CUSTOMER') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only create Customer accounts'
        });
      }
      role = 'CUSTOMER';
    }

    console.log('API: Creating user with data:', { name, email, role, passwordProvided: !!password });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // ... (reactivation logic omitted for brevity in replacement, but I should copy it if I replace the whole function)
      // I will implement safer replacement chunk by chunk or full function.
      // Since I'm replacing chunks, I will do full block replacements.
      // Wait, replacement tool replaces the *TargetContent* with *ReplacementContent*.
      // I should be careful not to delete logic.

      console.log('API: User exists. Active status:', existingUser.isActive);
      if (existingUser.isActive) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Reactivate pseudo-deleted user
      const finalPassword = password || crypto.randomBytes(8).toString('hex');

      existingUser.name = name;
      existingUser.password = finalPassword;
      // If Customer Manager, force role to CUSTOMER
      existingUser.role = (req.user.role === 'CUSTOMER_MANAGER') ? 'CUSTOMER' : (role || 'VIEW_ONLY');
      existingUser.isActive = true;
      existingUser.createdBy = req.user.id;

      await existingUser.save();
      existingUser.password = undefined;

      console.log('API: Reactivated user:', existingUser._id);
      return res.status(201).json({
        success: true,
        message: 'User account reactivated successfully',
        data: {
          user: existingUser,
          tempPassword: finalPassword
        }
      });
    }

    // Use provided password or generate temporary one
    const finalPassword = password || crypto.randomBytes(8).toString('hex');

    // Create user
    try {
      const user = await User.create({
        name,
        email,
        password: finalPassword,
        role: role || 'VIEW_ONLY',
        createdBy: req.user.id
      });

      // Remove password from response
      user.password = undefined;

      console.log('API: Created new user:', user._id);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user,
          tempPassword: finalPassword // In production, email this instead of returning
        }
      });
    } catch (createError) {
      console.error('API: User creation validation error:', createError);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: createError.message
      });
    }

  } catch (error) {
    console.error('API: General creation error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Super Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    // Prevent updating password through this route
    if (req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'Use reset password endpoint to change password'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Customer Manager check
    if (req.user.role === 'CUSTOMER_MANAGER') {
      if (user.role !== 'CUSTOMER') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update Customer accounts'
        });
      }
      if (role && role !== 'CUSTOMER') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You cannot change a user role to something other than Customer'
        });
      }
    }


    // Prevent deactivating or changing role of the last Super Admin
    if (user.role === 'SUPER_ADMIN' && (role !== 'SUPER_ADMIN' || isActive === false)) {
      const superAdminCount = await User.countDocuments({
        role: 'SUPER_ADMIN',
        isActive: true
      });

      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot modify the last Super Admin account'
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private/Super Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Customer Manager check
    if (req.user.role === 'CUSTOMER_MANAGER' && user.role !== 'CUSTOMER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only delete Customer accounts'
      });
    }

    // Prevent deleting the last Super Admin
    if (user.role === 'SUPER_ADMIN') {
      const superAdminCount = await User.countDocuments({
        role: 'SUPER_ADMIN',
        isActive: true
      });

      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last Super Admin account'
        });
      }
    }

    // Hard delete to free up the email address
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {}
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Reset user password
// @route   POST /api/users/:id/reset-password
// @access  Private/Super Admin
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    user.password = tempPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: {
        tempPassword // In production, email this instead of returning
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};