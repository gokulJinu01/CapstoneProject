// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/1_Home/Home';
import ExploreChefs from '../pages/2_ExploreChefs/ExploreChefs';
import ChefProfile from '../pages/3_ChefProfile/ChefProfile';
import BookChef from '../pages/3_ChefProfile/BookChef';
import Bookings from '../pages/4_Bookings/Bookings';
import Favorites from '../pages/5_Favorites/Favorites';
import AdminDashboard from '../pages/6_AdminDashboard/AdminDashboard';
import Login from '../pages/7_Auth/Login';
import Register from '../pages/7_Auth/Register';
import Profile from '../pages/7_Auth/Profile';
import HowItWorks from '../pages/HowItWorks';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreChefs />} />
        <Route path="/chef/:id" element={<ChefProfile />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/chef/:id/book" element={
          <PrivateRoute>
            <BookChef />
          </PrivateRoute>
        } />
        <Route path="/bookings" element={
          <PrivateRoute>
            <Bookings />
          </PrivateRoute>
        } />
        <Route path="/favorites" element={
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
        
        {/* Fallback 404 route - should be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Simple NotFound component
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" className="px-6 py-3 bg-[#D4AF37] text-white rounded-full hover:bg-[#C19B2E] transition-colors">
      Go back to Home
    </a>
  </div>
);

export default AppRouter;