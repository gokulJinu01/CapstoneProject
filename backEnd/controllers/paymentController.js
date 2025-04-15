const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const User = require('../models/User');

/**
 * @desc    Create payment intent
 * @route   POST /api/payments/create-intent
 * @access  Private
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('chef', 'chefProfile.pricing');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Calculate amount based on booking details
    const amount = calculateBookingAmount(booking);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        chefId: booking.chef._id.toString()
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Process payment
 * @route   POST /api/payments/process
 * @access  Private
 */
exports.processPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      chef: booking.chef,
      amount: paymentIntent.amount,
      paymentIntentId,
      status: 'completed',
      paymentMethod: paymentIntent.payment_method
    });

    // Update booking status
    booking.status = 'confirmed';
    booking.payment = payment._id;
    await booking.save();

    res.status(200).json({
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('chef', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization
    if (
      payment.user.toString() !== req.user.id &&
      payment.chef.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user payments
 * @route   GET /api/payments/user
 * @access  Private
 */
exports.getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('booking')
      .populate('chef', 'name email')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      payments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get chef payments
 * @route   GET /api/payments/chef
 * @access  Private (Chef Only)
 */
exports.getChefPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    if (req.user.role !== 'chef') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query = { chef: req.user.id };
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const payments = await Payment.find(query)
      .populate('booking')
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Payment.countDocuments(query);

    // Calculate total earnings
    const totalEarnings = await Payment.aggregate([
      { $match: { chef: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      payments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total,
      totalEarnings: totalEarnings[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Refund payment
 * @route   POST /api/payments/:id/refund
 * @access  Private (Admin Only)
 */
exports.refundPayment = async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment already refunded' });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentIntentId,
      reason: 'requested_by_customer'
    });

    // Update payment status
    payment.status = 'refunded';
    payment.refundId = refund.id;
    payment.refundReason = reason;
    payment.refundedAt = Date.now();
    await payment.save();

    // Update booking status
    await Booking.findByIdAndUpdate(payment.booking, {
      status: 'refunded'
    });

    res.status(200).json({
      message: 'Payment refunded successfully',
      refund
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get payment statistics
 * @route   GET /api/payments/stats
 * @access  Private (Admin/Chef)
 */
exports.getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: 'completed' };

    if (req.user.role === 'chef') {
      query.chef = req.user._id;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility function to calculate booking amount
const calculateBookingAmount = (booking) => {
  const { duration, numberOfGuests } = booking;
  const { hourlyRate, serviceCharge, guestCharge } = booking.chef.chefProfile.pricing;

  const baseAmount = hourlyRate * duration;
  const guestAmount = (numberOfGuests - 1) * guestCharge;
  const serviceAmount = (baseAmount + guestAmount) * (serviceCharge / 100);

  return Math.round((baseAmount + guestAmount + serviceAmount) * 100); // Convert to cents for Stripe
}; 