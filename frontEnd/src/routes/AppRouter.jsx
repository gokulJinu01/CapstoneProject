import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from '../pages/1_Home/Home';
import ExploreChefs from '../pages/2_ExploreChefs/ExploreChefs';
import ChefProfile from '../pages/3_ChefProfile/ChefProfile';
import Bookings from '../pages/4_Bookings/Bookings';
import Favorites from '../pages/5_Favorites/Favorites';
import AdminDashboard from '../pages/6_AdminDashboard/AdminDashboard';
import Login from '../pages/7_Auth/Login';
import Register from '../pages/7_Auth/Register';
import Profile from '../pages/7_Auth/Profile';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreChefs />} />
        <Route path="/chef/:id" element={<ChefProfile />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
