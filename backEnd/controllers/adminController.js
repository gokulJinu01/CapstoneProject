const User = require('../models/User');
const Chef = require('../models/Chef');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Category = require('../models/Category');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

/**
 * @desc    Get platform overview statistics
 * @route   GET /api/admin/overview
 * @access  Private (Admin)
 */
exports.getPlatformOverview = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalChefs = await User.countDocuments({ role: 'chef' });
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get recent activity
    const recentBookings = await Booking.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .populate('chef', 'name email');

    const recentReviews = await Review.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .populate('chef', 'name email');

    // Get revenue statistics
    const revenueStats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user growth
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      totalUsers,
      totalChefs,
      totalBookings,
      totalReviews,
      totalCategories,
      recentBookings,
      recentReviews,
      revenueStats,
      userGrowth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all users with filtering and pagination
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      status, 
      search,
      sort = '-createdAt' 
    } = req.query;

    const query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update user status (ban/unban)
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    user.statusReason = reason;
    await user.save();

    // Create notification for user
    await Notification.create({
      user: user._id,
      type: 'status_update',
      message: `Your account has been ${status}. ${reason ? `Reason: ${reason}` : ''}`,
      data: { status, reason }
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all reports with filtering and pagination
 * @route   GET /api/admin/reports
 * @access  Private (Admin)
 */
exports.getReports = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      status,
      sort = '-createdAt' 
    } = req.query;

    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .populate('reported', 'name email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Report.countDocuments(query);

    res.status(200).json({
      reports,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Handle report (resolve/dismiss)
 * @route   PUT /api/admin/reports/:id/handle
 * @access  Private (Admin)
 */
exports.handleReport = async (req, res) => {
  try {
    const { action, resolution } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = action === 'resolve' ? 'resolved' : 'dismissed';
    report.resolution = resolution;
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    await report.save();

    // Create notification for reporter
    await Notification.create({
      user: report.reporter,
      type: 'report_update',
      message: `Your report has been ${action}ed. ${resolution ? `Resolution: ${resolution}` : ''}`,
      data: { action, resolution }
    });

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get platform settings
 * @route   GET /api/admin/settings
 * @access  Private (Admin)
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update platform settings
 * @route   PUT /api/admin/settings
 * @access  Private (Admin)
 */
exports.updateSettings = async (req, res) => {
  try {
    const {
      platformName,
      platformDescription,
      contactEmail,
      supportPhone,
      commissionRate,
      minimumBookingAmount,
      maximumBookingAmount,
      bookingAdvanceDays,
      cancellationPolicy,
      termsAndConditions,
      privacyPolicy
    } = req.body;

    const settings = await Settings.findOne();
    
    if (settings) {
      Object.assign(settings, {
        platformName,
        platformDescription,
        contactEmail,
        supportPhone,
        commissionRate,
        minimumBookingAmount,
        maximumBookingAmount,
        bookingAdvanceDays,
        cancellationPolicy,
        termsAndConditions,
        privacyPolicy
      });
      await settings.save();
    } else {
      await Settings.create({
        platformName,
        platformDescription,
        contactEmail,
        supportPhone,
        commissionRate,
        minimumBookingAmount,
        maximumBookingAmount,
        bookingAdvanceDays,
        cancellationPolicy,
        termsAndConditions,
        privacyPolicy
      });
    }

    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get system logs
 * @route   GET /api/admin/logs
 * @access  Private (Admin)
 */
exports.getSystemLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      level, 
      type,
      startDate,
      endDate,
      sort = '-timestamp' 
    } = req.query;

    const query = {};
    
    if (level) query.level = level;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await SystemLog.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await SystemLog.countDocuments(query);

    res.status(200).json({
      logs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Clear system logs
 * @route   DELETE /api/admin/logs
 * @access  Private (Admin)
 */
exports.clearSystemLogs = async (req, res) => {
  try {
    const { days } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    await SystemLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    res.status(200).json({ message: 'System logs cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get backup status and create backup
 * @route   GET /api/admin/backup
 * @access  Private (Admin)
 */
exports.getBackupStatus = async (req, res) => {
  try {
    const backups = await Backup.find().sort('-createdAt');
    res.status(200).json(backups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create manual backup
 * @route   POST /api/admin/backup
 * @access  Private (Admin)
 */
exports.createBackup = async (req, res) => {
  try {
    const backup = await Backup.create({
      type: 'manual',
      status: 'in_progress',
      createdBy: req.user._id
    });

    // Trigger backup process (implement backup logic)
    // This could involve:
    // 1. Dumping database
    // 2. Compressing files
    // 3. Uploading to cloud storage
    // 4. Updating backup status

    res.status(201).json(backup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Restore from backup
 * @route   POST /api/admin/backup/:id/restore
 * @access  Private (Admin)
 */
exports.restoreBackup = async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);

    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    // Trigger restore process (implement restore logic)
    // This could involve:
    // 1. Downloading backup
    // 2. Restoring database
    // 3. Verifying restore
    // 4. Updating backup status

    res.status(200).json({ message: 'Backup restore initiated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 