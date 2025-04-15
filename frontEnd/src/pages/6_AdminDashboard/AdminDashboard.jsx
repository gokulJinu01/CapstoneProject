// src/pages/6_AdminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, userAPI, bookingAPI, reviewAPI } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import ChefDashboard from './ChefDashboard';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if user is not logged in (handled by PrivateRoute)
    if (!user) return;
    
    // If user is a chef, show chef dashboard instead
    if (user.role === 'Chef') {
      setLoading(false);
      return;
    }
    
    // Check if user is admin
    if (user.role !== 'Admin') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    
    fetchInitialData();
  }, [user]);
  
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats
      const statsResponse = await fetchStats();
      setStats(statsResponse);
      
      // Load initial data based on active tab
      if (activeTab === 'dashboard') {
        // Already loaded stats
      } else if (activeTab === 'users') {
        await fetchUsers();
      } else if (activeTab === 'chefs') {
        await fetchChefs();
      } else if (activeTab === 'bookings') {
        await fetchBookings();
      } else if (activeTab === 'reviews') {
        await fetchReviews();
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
        setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      // For mock API without admin endpoints, combine existing endpoints
      const totalChefs = (await userAPI.getChefs({})).data.chefs?.length || 0;
      const bookingStats = (await bookingAPI.getBookingStats()).data || {};
      const totalBookings = bookingStats.totalBookings || 0;
      
      // Mock total users count
      const totalUsers = totalChefs + 50; // Assuming 50 regular users
      
      return {
        totalUsers,
        totalChefs,
        totalBookings,
        recentBookings: totalBookings > 0 ? Math.floor(totalBookings * 0.2) : 0,
        pendingReviews: 12, // Mock value
        revenue: '$' + (totalBookings * 120).toLocaleString() // Mock value assuming $120 per booking
      };
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      return null;
    }
  };
  
  const fetchUsers = async () => {
    try {
      // Use admin API if available, otherwise fall back to mocked data
      try {
        const response = await adminAPI.getAllUsers();
        setUsers(response.data);
      } catch {
        // Mock users data if admin endpoint not available
        setUsers([
          { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'User', createdAt: '2023-01-05' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', createdAt: '2023-02-12' },
          { _id: '3', name: 'Admin User', email: 'admin@chefapp.com', role: 'Admin', createdAt: '2023-01-01' },
          // Add more mock users as needed
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users data.");
    }
  };
  
  const fetchChefs = async () => {
    try {
      const response = await userAPI.getChefs({});
      setChefs(response.data.chefs || []);
    } catch (error) {
      console.error("Failed to fetch chefs:", error);
      setError("Failed to load chefs data.");
    }
  };
  
  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getBookings({});
      setBookings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setError("Failed to load bookings data.");
    }
  };
  
  const fetchReviews = async () => {
    try {
      // Mock reviews data since we don't have a global reviews endpoint
      setReviews([
        { _id: '1', rating: 4.5, comment: 'Great experience!', user: { name: 'Alice Cooper' }, chef: { name: 'Chef Gordon' }, createdAt: '2023-05-15' },
        { _id: '2', rating: 5, comment: 'Amazing food and service!', user: { name: 'Bob Dylan' }, chef: { name: 'Chef Julia' }, createdAt: '2023-05-20' },
        // Add more mock reviews as needed
      ]);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setError("Failed to load reviews data.");
    }
  };
  
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setLoading(true);
    
    try {
      if (tab === 'dashboard') {
        const statsResponse = await fetchStats();
        setStats(statsResponse);
      } else if (tab === 'users') {
        await fetchUsers();
      } else if (tab === 'chefs') {
        await fetchChefs();
      } else if (tab === 'bookings') {
        await fetchBookings();
      } else if (tab === 'reviews') {
        await fetchReviews();
      }
    } catch (err) {
      console.error(`Error loading ${tab} data:`, err);
      setError(`Failed to load ${tab} data.`);
    } finally {
        setLoading(false);
    }
  };
  
  // Handler functions for CRUD operations
  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert('Failed to delete user');
      }
    }
  };
  
  const approveChef = async (chefId) => {
    try {
      await adminAPI.approveChef(chefId);
      // Update chef's status in the list
      setChefs(chefs.map(chef => 
        chef._id === chefId ? { ...chef, approved: true } : chef
      ));
      alert('Chef approved successfully');
    } catch (error) {
      console.error("Failed to approve chef:", error);
      alert('Failed to approve chef');
    }
  };
  
  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, { status });
      // Update booking status in the list
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status } : booking
      ));
      alert(`Booking status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert('Failed to update booking status');
    }
  };
  
  const approveReview = async (reviewId) => {
    try {
      await adminAPI.approveReview(reviewId);
      // Update review's status in the list
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, approved: true } : review
      ));
      alert('Review approved successfully');
    } catch (error) {
      console.error("Failed to approve review:", error);
      alert('Failed to approve review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Render chef dashboard if user is a chef
  if (user && user.role === 'Chef') {
    return <ChefDashboard user={user} />;
  }

  // Render admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Admin Header */}
            <div className="bg-[#D4AF37] text-white px-6 py-4">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p>Welcome back, {user?.name || 'Administrator'}</p>
            </div>
            
            {/* Admin Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button 
                  onClick={() => handleTabChange('dashboard')} 
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'dashboard'
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  Dashboard
                </button>
                
                <button 
                  onClick={() => handleTabChange('users')} 
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="fas fa-users mr-2"></i>
                  Users
                </button>
                
                <button 
                  onClick={() => handleTabChange('chefs')} 
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'chefs'
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="fas fa-utensils mr-2"></i>
                  Chefs
                </button>
                
                <button 
                  onClick={() => handleTabChange('bookings')} 
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Bookings
                </button>
                
                <button 
                  onClick={() => handleTabChange('reviews')} 
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="fas fa-star mr-2"></i>
                  Reviews
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
                  <p className="ml-3 text-gray-600">Loading data...</p>
                </div>
              ) : (
                <>
                  {/* Dashboard Tab */}
                  {activeTab === 'dashboard' && stats && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Overview</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                              <i className="fas fa-users text-xl"></i>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Total Users</p>
                              <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                              <i className="fas fa-utensils text-xl"></i>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Total Chefs</p>
                              <p className="text-2xl font-bold">{stats.totalChefs}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                              <i className="fas fa-calendar-check text-xl"></i>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                              <p className="text-2xl font-bold">{stats.totalBookings}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                              <i className="fas fa-calendar-alt text-xl"></i>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Recent Bookings</p>
                              <p className="text-2xl font-bold">{stats.recentBookings}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-500 mr-4">
                              <i className="fas fa-star text-xl"></i>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Pending Reviews</p>
                              <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#D4AF37]">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-50 text-[#D4AF37] mr-4">
                              <i className="fas fa-dollar-sign text-xl"></i>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                              <p className="text-2xl font-bold">{stats.revenue}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Users Tab */}
                  {activeTab === 'users' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Manage Users</h2>
                        <button className="bg-[#D4AF37] text-white px-4 py-2 rounded-md hover:bg-[#C19B2E]">
                          <i className="fas fa-plus mr-2"></i>
                          Add User
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                              <tr key={user._id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm">{user._id}</td>
                                <td className="py-3 px-4 text-sm">{user.name}</td>
                                <td className="py-3 px-4 text-sm">{user.email}</td>
                                <td className="py-3 px-4 text-sm">
                                  <span 
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      user.role === 'Admin' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : user.role === 'Chef'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {user.role}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-sm">
                                  <button className="text-blue-500 hover:text-blue-700 mr-3">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => deleteUser(user._id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Chefs Tab */}
                  {activeTab === 'chefs' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Manage Chefs</h2>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="text" 
                            placeholder="Search chefs..." 
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                          />
                          <button className="bg-[#D4AF37] text-white px-4 py-2 rounded-md hover:bg-[#C19B2E]">
                            <i className="fas fa-plus mr-2"></i>
                            Add Chef
                          </button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Chef</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Location</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {chefs.map(chef => (
                              <tr key={chef._id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                      <img 
                                        src={chef.chefProfile?.image || "https://placehold.co/100x100/e0e0e0/ffffff?text=Chef"} 
                                        alt={chef.name} 
                                        className="h-10 w-10 rounded-full object-cover"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{chef.name}</div>
                                      <div className="text-sm text-gray-500">{chef.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm">{chef.chefProfile?.specialty || "Various Cuisines"}</td>
                                <td className="py-3 px-4 text-sm">
                                  <div className="flex items-center">
                                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                                    <span>{chef.chefProfile?.rating || "4.5"}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm">{chef.chefProfile?.location || "Not specified"}</td>
                                <td className="py-3 px-4 text-sm">
                                  <span 
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      chef.chefProfile?.approved || chef.chefProfile?.featured
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {chef.chefProfile?.approved || chef.chefProfile?.featured ? 'Approved' : 'Pending'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <button 
                                    className="text-green-500 hover:text-green-700 mr-2"
                                    onClick={() => approveChef(chef._id)}
                                  >
                                    <i className="fas fa-check-circle"></i>
                                  </button>
                                  <button className="text-blue-500 hover:text-blue-700 mr-2">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Bookings Tab */}
                  {activeTab === 'bookings' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Manage Bookings</h2>
                        <div className="flex items-center space-x-3">
                          <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                          </select>
                          <button className="bg-[#D4AF37] text-white px-4 py-2 rounded-md hover:bg-[#C19B2E]">
                            <i className="fas fa-filter mr-2"></i>
                            Filter
                          </button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Chef</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {bookings.map(booking => (
                              <tr key={booking._id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm">{booking._id}</td>
                                <td className="py-3 px-4 text-sm">{booking.user?.name || "Unknown User"}</td>
                                <td className="py-3 px-4 text-sm">{booking.chef?.name || "Unknown Chef"}</td>
                                <td className="py-3 px-4 text-sm">
                                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <span 
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      booking.status === 'confirmed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : booking.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : booking.status === 'completed'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  ${booking.totalAmount || 0}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <div className="flex space-x-2">
                                    <select 
                                      className="border rounded text-sm px-1 py-1"
                                      onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                                      value={booking.status}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="confirmed">Confirm</option>
                                      <option value="completed">Complete</option>
                                      <option value="canceled">Cancel</option>
                                    </select>
                                    <button className="text-blue-500 hover:text-blue-700">
                                      <i className="fas fa-eye"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Manage Reviews</h2>
                        <div className="flex items-center space-x-3">
                          <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                          </select>
                          <button className="bg-[#D4AF37] text-white px-4 py-2 rounded-md hover:bg-[#C19B2E]">
                            <i className="fas fa-filter mr-2"></i>
                            Filter
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {reviews.map(review => (
                          <div key={review._id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">{review.user?.name || "Anonymous"}</span>
                                  <span className="text-sm text-gray-500">reviewed {review.chef?.name || "a chef"}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <i 
                                      key={i}
                                      className={`fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    ></i>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{review.rating}</span>
                              </div>
                            </div>
                            
                            <p className="mt-3 text-gray-700">{review.comment || review.text}</p>
                            
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                              <div className="flex space-x-2">
                                <button 
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                                  onClick={() => approveReview(review._id)}
                                >
                                  <i className="fas fa-check mr-1"></i>
                                  Approve
                                </button>
                                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                                  <i className="fas fa-edit mr-1"></i>
                                  Edit
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200">
                                  <i className="fas fa-times mr-1"></i>
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;