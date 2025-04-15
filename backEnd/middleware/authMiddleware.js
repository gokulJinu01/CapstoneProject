// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mock users for development (when using mock DB)
// Import the same mock users from authController
const mockUsers = [
  {
    _id: '1',
    name: 'Test User',
    email: 'user@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjCBZbQJdwPKijF8QVbkUUElC3W', // password: password
    role: 'User'
  },
  {
    _id: '2',
    name: 'Test Chef',
    email: 'chef@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjCBZbQJdwPKijF8QVbkUUElC3W', // password: password
    role: 'Chef',
    chefProfile: {
      specialty: 'Italian Cuisine',
      experience: 5,
      bio: 'Experienced chef with passion for Italian cuisine',
      location: 'New York, NY',
      pricing: 100,
      availability: true
    }
  },
  {
    _id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjCBZbQJdwPKijF8QVbkUUElC3W', // password: password
    role: 'Admin'
  }
];

// Helper function to check if we're using mock database
const isMockDatabase = () => {
  return !process.env.MONGO_URI || process.env.MONGO_URI === 'mock';
};

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers (Bearer token) or in cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token with fallback secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123456789');

    // Check if we're using mock database
    if (isMockDatabase()) {
      // Find the user in mock data
      const user = mockUsers.find(user => user._id === decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create a user object without password
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      // Attach user to req
      req.user = userWithoutPassword;
      req.user.id = decoded.id; // Add id property for compatibility
      next();
      return;
    }

    // Attach user to req for real database
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token failed', error: error.message });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'User role not found' });
    }
    
    // Normalize roles for case-insensitive comparison
    const userRole = req.user.role.toLowerCase();
    const normalizedRoles = roles.map(role => role.toLowerCase());
    
    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Not authorized for this action',
        requiredRoles: roles,
        userRole: req.user.role 
      });
    }
    
    next();
  };
};

// Admin middleware
exports.admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
  next();
};