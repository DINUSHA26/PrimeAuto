import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// Configuration constants
const TOTAL_BAYS = 3;
const WORKING_HOURS = {
  start: 8, // 8:00 AM
  end: 17   // 5:00 PM (17:00)
};
const SLOT_INTERVAL = 30; // 30 minutes

// Helper function to create time slots
const createTimeSlot = (date, hours, minutes = 0) => {
  const slot = new Date(date);
  slot.setHours(hours, minutes, 0, 0);
  return slot;
};

// Helper function to check if a time range is available in a specific bay
const isBayAvailable = async (bayNumber, date, startTime, endTime, excludeBookingId = null) => {
  // Ensure we don't mutate the incoming date object
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);

  const query = {
    bayNumber,
    bookingDate: {
      $gte: startOfDay,
      $lt: endOfDay
    },
    status: { $nin: ['cancelled'] }
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBookings = await Booking.find(query);

  // Check for overlap with any existing booking
  for (let booking of existingBookings) {
    if (startTime < booking.endTime && endTime > booking.startTime) {
      return false; // Overlap found
    }
  }

  return true; // No overlap, bay is available
};

// Helper function to find an available bay for a time slot
const findAvailableBay = async (date, startTime, endTime, excludeBookingId = null) => {
  for (let bay = 1; bay <= TOTAL_BAYS; bay++) {
    const isAvailable = await isBayAvailable(bay, date, startTime, endTime, excludeBookingId);
    if (isAvailable) {
      return bay;
    }
  }
  return null; // No bay available
};

// @desc    Get available time slots for a service on a specific date
// @route   GET /api/bookings/availability
// @access  Public
export const getAvailability = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Service ID and date are required'
      });
    }

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const serviceDuration = service.duration; // in minutes
    const bookingDate = new Date(date);

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book for past dates'
      });
    }

    const availableSlots = [];
    const now = new Date();

    // Generate all possible time slots
    for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_INTERVAL) {
        const startTime = createTimeSlot(new Date(bookingDate), hour, minute);
        const endTime = new Date(startTime.getTime() + serviceDuration * 60000);

        // Check if the slot is in the past (if booking for today)
        if (startTime < now) {
          continue;
        }

        // Check if end time exceeds working hours
        if (endTime.getHours() > WORKING_HOURS.end ||
          (endTime.getHours() === WORKING_HOURS.end && endTime.getMinutes() > 0)) {
          continue;
        }

        // Check if at least one bay is available
        const availableBay = await findAvailableBay(bookingDate, startTime, endTime);

        if (availableBay !== null) {
          availableSlots.push({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            displayTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            availableBays: await getAvailableBaysForSlot(bookingDate, startTime, endTime)
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      date: bookingDate.toISOString().split('T')[0],
      service: {
        id: service._id,
        name: service.name,
        duration: service.duration
      },
      availableSlots,
      totalSlots: availableSlots.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching availability',
      error: error.message
    });
  }
};

// Helper function to get number of available bays for a slot
const getAvailableBaysForSlot = async (date, startTime, endTime) => {
  let count = 0;
  for (let bay = 1; bay <= TOTAL_BAYS; bay++) {
    if (await isBayAvailable(bay, date, startTime, endTime)) {
      count++;
    }
  }
  return count;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, startTime, customerName, customerEmail, customerPhone, vehicleNumber, vehicleModel, notes } = req.body;

    // Validate required fields
    if (!serviceId || !bookingDate || !startTime || !customerName || !customerEmail || !customerPhone || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Calculate end time
    const requestedStartTime = new Date(startTime);
    const requestedEndTime = new Date(requestedStartTime.getTime() + service.duration * 60000);
    const dateOnly = new Date(bookingDate);

    // Validate booking is not in the past
    const now = new Date();
    if (requestedStartTime < now) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book for past time'
      });
    }

    // Validate within working hours
    if (requestedStartTime.getHours() < WORKING_HOURS.start ||
      requestedEndTime.getHours() > WORKING_HOURS.end ||
      (requestedEndTime.getHours() === WORKING_HOURS.end && requestedEndTime.getMinutes() > 0)) {
      return res.status(400).json({
        success: false,
        message: `Bookings must be within working hours (${WORKING_HOURS.start}:00 - ${WORKING_HOURS.end}:00)`
      });
    }

    // Find available bay
    const availableBay = await findAvailableBay(dateOnly, requestedStartTime, requestedEndTime);

    if (availableBay === null) {
      return res.status(409).json({
        success: false,
        message: 'No bays available for the selected time slot. Please choose a different time.'
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      customerName,
      customerEmail,
      customerPhone,
      vehicleNumber,
      vehicleModel,
      service: serviceId,
      bookingDate: dateOnly,
      startTime: requestedStartTime,
      endTime: requestedEndTime,
      bayNumber: availableBay,
      notes
    });


    // Populate service details
    await booking.populate('service');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const { status, date, bayNumber, email } = req.query;

    // Customer Manager restriction
    if (req.user.role === 'CUSTOMER_MANAGER' && !req.query.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Customer Managers must specify a user ID'
      });
    }

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      const selectedDate = new Date(date);
      filter.bookingDate = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      };
    }

    if (bayNumber) {
      filter.bayNumber = parseInt(bayNumber);
    }

    if (email) {
      filter.customerEmail = email.toLowerCase();
    }

    if (req.query.userId) {
      filter.user = req.query.userId;
    }

    const bookings = await Booking.find(filter)
      .populate('service')
      .sort({ bookingDate: -1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('service');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user or user is admin
    if (booking.user && booking.user.toString() !== req.user._id.toString() && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && req.user.role !== 'CUSTOMER_MANAGER') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service')
      .sort({ bookingDate: -1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your bookings',
      error: error.message
    });
  }
};


// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('service');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Public
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// @desc    Get bay schedule for a specific date
// @route   GET /api/bookings/schedule/:date
// @access  Private/Admin
export const getBaySchedule = async (req, res) => {
  try {
    const { date } = req.params;
    const selectedDate = new Date(date);

    const bookings = await Booking.find({
      bookingDate: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      },
      status: { $nin: ['cancelled'] }
    })
      .populate('service')
      .sort({ bayNumber: 1, startTime: 1 });

    // Organize by bay
    const schedule = {
      bay1: bookings.filter(b => b.bayNumber === 1),
      bay2: bookings.filter(b => b.bayNumber === 2),
      bay3: bookings.filter(b => b.bayNumber === 3)
    };

    res.status(200).json({
      success: true,
      date: date,
      schedule
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bay schedule',
      error: error.message
    });
  }
};
