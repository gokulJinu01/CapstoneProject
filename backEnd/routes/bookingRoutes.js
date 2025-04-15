// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  updateBooking,
  cancelBooking,
  getChefBookings,
  getBookingStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const auth = require('../middleware/auth');

// Mock bookings data
const mockBookings = [];

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', auth(['User']), (req, res) => {
  const { chefId, date, time, numberOfGuests, menuId, location, contactPhone, specialRequests } = req.body;
  
  if (!chefId || !date || !time || !numberOfGuests || !location || !contactPhone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const newBooking = {
    _id: `b${Date.now()}`,
    user: req.user.id,
    chef: chefId,
    date: new Date(`${date}T${time}`).toISOString(),
    numberOfGuests,
    menuId,
    location,
    contactPhone,
    specialRequests,
    status: 'pending',
    totalAmount: Math.floor(Math.random() * 10000) / 100 + 100, // Random amount between $100-$200
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockBookings.push(newBooking);
  
  res.status(201).json({
    message: 'Booking created successfully',
    booking: newBooking
  });
});

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for the authenticated user
 * @access  Private
 */
router.get('/', auth(['User']), (req, res) => {
  const userBookings = mockBookings.filter(booking => booking.user === req.user.id);
  
  res.status(200).json({
    bookings: userBookings,
    count: userBookings.length
  });
});

/**
 * @route   GET /api/bookings/:id
 * @desc    Get a specific booking
 * @access  Private
 */
router.get('/:id', auth(), (req, res) => {
  const booking = mockBookings.find(booking => booking._id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  // Only allow access if user owns the booking or is a chef assigned to it
  if (booking.user !== req.user.id && booking.chef !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to access this booking' });
  }
  
  res.status(200).json({ booking });
});

/**
 * @route   PUT /api/bookings/:id/status
 * @desc    Update booking status
 * @access  Private (Chef only)
 */
router.put('/:id/status', auth(['Chef']), (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const booking = mockBookings.find(booking => booking._id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  // Only allow the chef assigned to the booking to update status
  if (booking.chef !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this booking' });
  }
  
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  
  res.status(200).json({
    message: 'Booking status updated successfully',
    booking
  });
});

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking
 * @access  Private
 */
router.delete('/:id', auth(), (req, res) => {
  const bookingIndex = mockBookings.findIndex(booking => booking._id === req.params.id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  // Only allow cancellation if user owns the booking
  if (mockBookings[bookingIndex].user !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to cancel this booking' });
  }
  
  // Remove booking from array
  mockBookings.splice(bookingIndex, 1);
  
  res.status(200).json({
    message: 'Booking cancelled successfully'
  });
});

// All booking endpoints require authentication
router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.get('/stats', protect, authorize('Admin', 'Chef'), getBookingStats);
router.get('/chef', protect, authorize('Chef'), getChefBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, authorize('Chef', 'Admin'), updateBookingStatus);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;