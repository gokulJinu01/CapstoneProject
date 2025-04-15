import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requireRole }) => {
  const { isSignedIn, user, loading } = useAuth();
  const location = useLocation();

  // Show loading state if auth state is still being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-3xl text-[#D4AF37] mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check for required role
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component
  return children;
};

export default PrivateRoute; 