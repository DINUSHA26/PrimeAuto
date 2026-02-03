import SparePart from '../models/SparePart.js';

// @desc    Get all spare parts
// @route   GET /api/spare-parts
// @access  Public
export const getAllSpareParts = async (req, res) => {
  try {
    const { category, isActive, lowStock, search } = req.query;

    const filter = {};

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (lowStock === 'true') {
      // This will be handled after the query
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { partNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let spareParts = await SparePart.find(filter).sort({ name: 1 });

    // Filter for low stock if requested
    if (lowStock === 'true') {
      spareParts = spareParts.filter(part => part.quantity <= part.minStockLevel);
    }

    res.status(200).json({
      success: true,
      count: spareParts.length,
      data: spareParts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching spare parts',
      error: error.message
    });
  }
};

// @desc    Get single spare part
// @route   GET /api/spare-parts/:id
// @access  Public
export const getSparePart = async (req, res) => {
  try {
    const sparePart = await SparePart.findById(req.params.id);

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sparePart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching spare part',
      error: error.message
    });
  }
};

// @desc    Get spare part by part number
// @route   GET /api/spare-parts/part-number/:partNumber
// @access  Public
export const getSparePartByPartNumber = async (req, res) => {
  try {
    const sparePart = await SparePart.findOne({
      partNumber: req.params.partNumber.toUpperCase()
    });

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sparePart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching spare part',
      error: error.message
    });
  }
};

// @desc    Create new spare part
// @route   POST /api/spare-parts
// @access  Private/Admin
export const createSparePart = async (req, res) => {
  try {
    const partData = { ...req.body };

    // Handle location if it comes as a string (from FormData)
    if (typeof partData.location === 'string') {
      try {
        partData.location = JSON.parse(partData.location);
      } catch (e) {
        console.error('Failed to parse location:', e);
      }
    }

    if (req.file) {
      partData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const sparePart = await SparePart.create(partData);

    res.status(201).json({
      success: true,
      message: 'Spare part created successfully',
      data: sparePart
    });

  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A spare part with this part number already exists'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating spare part',
      error: error.message
    });
  }
};

// @desc    Update spare part
// @route   PUT /api/spare-parts/:id
// @access  Private/Admin
export const updateSparePart = async (req, res) => {
  try {
    const partData = { ...req.body };

    // Handle location if it comes as a string (from FormData)
    if (typeof partData.location === 'string') {
      try {
        partData.location = JSON.parse(partData.location);
      } catch (e) {
        console.error('Failed to parse location:', e);
      }
    }

    if (req.file) {
      partData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const sparePart = await SparePart.findByIdAndUpdate(
      req.params.id,
      partData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Spare part updated successfully',
      data: sparePart
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating spare part',
      error: error.message
    });
  }
};

// @desc    Update spare part stock
// @route   PATCH /api/spare-parts/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body;

    if (!quantity || !operation) {
      return res.status(400).json({
        success: false,
        message: 'Quantity and operation (add/subtract/set) are required'
      });
    }

    const sparePart = await SparePart.findById(req.params.id);

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    // Update quantity based on operation
    if (operation === 'add') {
      sparePart.quantity += quantity;
    } else if (operation === 'subtract') {
      if (sparePart.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }
      sparePart.quantity -= quantity;
    } else if (operation === 'set') {
      sparePart.quantity = quantity;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation. Use add, subtract, or set'
      });
    }

    await sparePart.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: sparePart
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating stock',
      error: error.message
    });
  }
};

// @desc    Delete spare part
// @route   DELETE /api/spare-parts/:id
// @access  Private/Admin
export const deleteSparePart = async (req, res) => {
  try {
    const sparePart = await SparePart.findByIdAndDelete(req.params.id);

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Spare part deleted successfully',
      data: {}
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting spare part',
      error: error.message
    });
  }
};

// @desc    Get low stock alert
// @route   GET /api/spare-parts/alerts/low-stock
// @access  Private/Admin
export const getLowStockAlerts = async (req, res) => {
  try {
    const spareParts = await SparePart.find({ isActive: true });

    const lowStockParts = spareParts.filter(part =>
      part.quantity <= part.minStockLevel
    );

    res.status(200).json({
      success: true,
      count: lowStockParts.length,
      data: lowStockParts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock alerts',
      error: error.message
    });
  }
};

// @desc    Get inventory statistics
// @route   GET /api/spare-parts/stats
// @access  Private/Admin
export const getInventoryStats = async (req, res) => {
  try {
    const totalParts = await SparePart.countDocuments({ isActive: true });
    const allParts = await SparePart.find({ isActive: true });

    const lowStockCount = allParts.filter(part =>
      part.quantity <= part.minStockLevel
    ).length;

    const outOfStockCount = allParts.filter(part =>
      part.quantity === 0
    ).length;

    const totalValue = allParts.reduce((sum, part) =>
      sum + (part.price * part.quantity), 0
    );

    const categoryCounts = await SparePart.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalParts,
        lowStockCount,
        outOfStockCount,
        totalValue: totalValue.toFixed(2),
        categoryCounts
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory statistics',
      error: error.message
    });
  }
};