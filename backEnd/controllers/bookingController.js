// controllers/bookingController.js
const Booking = require('../models/Booking');
const User = require('../models/User');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = async (req, res) => {
  try {
    const {
      chefId,
      chef, // Allow passing chef info from frontend
      date,
      time,
      numberOfGuests,
      occasion,
      menuPreferences,
      specialRequests,
      location,
      status = 'pending',
      contactPhone
    } = req.body;

    // Validation
    if (!chefId || !date || !time || !numberOfGuests || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if chef exists
    const chefUser = await User.findOne({ _id: chefId, role: 'Chef' });
    if (!chefUser) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Create booking object with chef information
    const bookingData = {
      user: req.user.id,
      chef: chefId,
      date,
      time,
      numberOfGuests,
      occasion,
      menuPreferences,
      specialRequests,
      location,
      status,
      contactPhone,
      totalAmount: chefUser.chefProfile?.hourlyRate || 0,
      // Store chef details for frontend display
      chefDetails: {
        name: chefUser.name,
        email: chefUser.email,
        specialty: chefUser.chefProfile?.specialty || '',
        image: chefUser.profilePicture || ''
      },
      userDetails: {
        name: req.user.name,
        email: req.user.email
      }
    };

    // Create booking
    const booking = await Booking.create(bookingData);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all bookings (filtered by user role)
 * @route   GET /api/bookings
 * @access  Private
 */
exports.getBookings = async (req, res) => {
  try {
    let query = {};
    
    // Filter bookings based on user role
    if (req.user.role === 'Admin') {
      // Admin can see all bookings
    } else if (req.user.role === 'Chef') {
      // Chef can only see bookings where they are the chef
      query.chef = req.user.id;
    } else {
      // Regular user can only see their own bookings
      query.user = req.user.id;
    }

    // Get bookings with chef and user information
    const bookings = await Booking.find(query)
      .populate('chef', 'name email profilePicture chefProfile')
      .populate('user', 'name email')
      .sort('-createdAt');

    // Format bookings for the frontend
    const formattedBookings = bookings.map(booking => {
      const bookingObj = booking.toObject();
      
      // Ensure chef information is present in a format the frontend expects
      if (bookingObj.chef) {
        bookingObj.chef = {
          _id: bookingObj.chef._id,
          name: bookingObj.chef.name,
          cuisine: bookingObj.chef.chefProfile?.specialty || 'Various Cuisines',
          image: bookingObj.chef.profilePicture || ''
        };
      }
      
      return bookingObj;
    });

    res.status(200).json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('chef', 'name email chefProfile');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to view this booking
    if (
      booking.user._id.toString() !== req.user.id &&
      booking.chef._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update booking status
 * @route   PUT /api/bookings/:id/status
 * @access  Private
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, price } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only chef or admin can update status
    if (req.user.role !== 'Chef' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update booking status' });
    }

    // If user is chef, they can only update their own bookings
    if (req.user.role === 'Chef' && booking.chef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    if (price) booking.totalAmount = price;

    const updatedBooking = await booking.save();
    
    // TODO: Send notification to user about status update

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update booking details
 * @route   PUT /api/bookings/:id
 * @access  Private
 */
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow updates if booking is pending
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update confirmed or completed booking' });
    }

    // Only booking user can update details
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending' }, // Reset status to pending on update
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cancel booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check cancellation policy (e.g., 24 hours before)
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

    if (hoursUntilBooking < 24) {
      return res.status(400).json({ message: 'Cannot cancel booking less than 24 hours before start time' });
    }

    // Only booking user or chef can cancel
    if (
      booking.user.toString() !== req.user.id &&
      booking.chef.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason;
    booking.cancelledBy = req.user.id;
    booking.cancelledAt = new Date();

    await booking.save();

    // TODO: Send cancellation notification to all parties

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get chef's availability
 * @route   GET /api/bookings/chef/:chefId/availability
 * @access  Public
 */
exports.getChefAvailability = async (req, res) => {
  try {
    const { chefId } = req.params;
    const { date } = req.query;

    // Get chef's bookings for the date
    const bookings = await Booking.find({
      chef: chefId,
      date: date,
      status: { $in: ['confirmed', 'pending'] }
    }).select('time');

    // Get chef's working hours (should be stored in chef profile)
    const chef = await User.findById(chefId).select('chefProfile.workingHours');
    
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Calculate available time slots
    const workingHours = chef.chefProfile?.workingHours || {
      start: '09:00',
      end: '17:00',
      interval: 60 // minutes
    };

    // Return available time slots
    res.status(200).json({
      date,
      workingHours,
      bookedSlots: bookings.map(b => b.time)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get booking statistics
 * @route   GET /api/bookings/stats
 * @access  Private (Admin/Chef)
 */
exports.getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $match: {
          ...(req.user.role === 'chef' ? { chef: req.user._id } : {})
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments(
      req.user.role === 'chef' ? { chef: req.user._id } : {}
    );

    res.status(200).json({
      totalBookings,
      statusBreakdown: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get chef's bookings
 * @route   GET /api/bookings/chef
 * @access  Private (Chef only)
 */
exports.getChefBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ chef: req.user.id })
      .populate('user', 'name email')
      .sort('-createdAt');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};