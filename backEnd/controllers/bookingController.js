// controllers/bookingController.js
const Booking = require('../models/Booking');
const User = require('../models/User');

/**
 * POST /api/bookings
 * Creates a new booking request
 */
exports.createBooking = async (req, res) => {
  try {
    // req.user = { id, role } from auth
    const { chefId, date, message } = req.body;

    // Verify chef exists & is actually a Chef
    const chef = await User.findOne({ _id: chefId, role: 'Chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    const newBooking = await Booking.create({
      user: req.user.id,
      chef: chefId,
      date,
      message
    });

    res.status(201).json({ message: 'Booking request created', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/bookings
 * Gets all bookings for the current user
 */
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('chef', 'name email chefProfile') // include chef info
      .sort({ date: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/bookings/chef/:chefId
 * Gets all bookings for a particular chef
 */
exports.getChefBookings = async (req, res) => {
  const { chefId } = req.params;
  try {
    // Only allow if current user is the chef or an Admin
    if (req.user.role !== 'Admin' && req.user.id !== chefId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ chef: chefId })
      .populate('user', 'name email userProfile')
      .sort({ date: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/bookings/:bookingId
 * Cancels (deletes) a booking
 */
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only user who made it, the chef, or Admin can cancel
    if (
      req.user.role !== 'Admin' &&
      booking.user.toString() !== req.user.id &&
      booking.chef.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};