/**
 * Mock authentication middleware that allows all requests
 * In a real application, this would verify the JWT token
 * and set req.user with the authenticated user's information
 */
const auth = (roles = []) => {
  return (req, res, next) => {
    // For simplicity in mock mode, simulate an authenticated user
    req.user = {
      id: 'user123',
      name: 'Mock User',
      email: 'user@example.com',
      role: 'User'
    };
    
    // If roles are specified, check if user has one of the required roles
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. You do not have the required permissions.'
      });
    }
    
    next();
  };
};

module.exports = auth; 