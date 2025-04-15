const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Get user's notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(50);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create new notification
 * @route   POST /api/notifications
 * @access  Private
 */
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message, data } = req.body;

    const notification = await Notification.create({
      user: userId,
      type,
      message,
      data
    });

    // In a real app, you'd want to emit this via WebSocket
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get unread notifications count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility functions for creating different types of notifications
exports.createBookingNotification = async (booking, type) => {
  try {
    let message = '';
    let userId = '';

    switch (type) {
      case 'NEW_BOOKING':
        message = `New booking request from ${booking.user.name} for ${booking.date}`;
        userId = booking.chef;
        break;
      case 'BOOKING_CONFIRMED':
        message = `Your booking for ${booking.date} has been confirmed`;
        userId = booking.user;
        break;
      case 'BOOKING_CANCELLED':
        message = `Booking for ${booking.date} has been cancelled`;
        userId = booking.chef;
        break;
      case 'REMINDER':
        message = `Reminder: You have a booking tomorrow at ${booking.time}`;
        userId = booking.user;
        break;
    }

    await Notification.create({
      user: userId,
      type,
      message,
      data: { bookingId: booking._id }
    });
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
};

exports.createReviewNotification = async (review, type) => {
  try {
    let message = '';
    let userId = '';

    switch (type) {
      case 'NEW_REVIEW':
        message = `${review.userName} left you a new ${review.rating}-star review`;
        userId = review.chef;
        break;
      case 'REVIEW_RESPONSE':
        message = `Chef responded to your review`;
        userId = review.user;
        break;
    }

    await Notification.create({
      user: userId,
      type,
      message,
      data: { reviewId: review._id }
    });
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
};

exports.createChefNotification = async (chef, type) => {
  try {
    let message = '';
    let userId = '';

    switch (type) {
      case 'NEW_FOLLOWER':
        message = `A new user has added you to their favorites`;
        userId = chef._id;
        break;
      case 'PROFILE_FEATURED':
        message = `Congratulations! Your profile is now featured`;
        userId = chef._id;
        break;
    }

    await Notification.create({
      user: userId,
      type,
      message,
      data: { chefId: chef._id }
    });
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
}; 