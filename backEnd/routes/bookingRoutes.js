// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getChefBookings,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking endpoints require authentication
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/chef/:chefId', protect, getChefBookings);
router.delete('/:bookingId', protect, cancelBooking);

module.exports = router;