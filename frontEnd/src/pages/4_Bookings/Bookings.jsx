// src/pages/4_Bookings/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

// Mock bookings for development
const mockBookings = [
  {
    _id: 'booking1',
    chef: {
      _id: '1',
      name: 'Arjun Kumar',
      cuisine: 'French Cuisine',
      image: 'https://images.unsplash.com/photo-1622021142947-3e6c94da0592'
    },
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    time: '19:00',
    numberOfGuests: 4,
    location: '123 Main St, New York, NY',
    status: 'confirmed',
    totalAmount: 480
  },
  {
    _id: 'booking2',
    chef: {
      _id: '4',
      name: 'Takashi Yamamoto',
      cuisine: 'Japanese Cuisine',
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf'
    },
    date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    time: '18:30',
    numberOfGuests: 2,
    location: '456 Park Ave, New York, NY',
    status: 'pending',
    totalAmount: 300
  },
  {
    _id: 'booking3',
    chef: {
      _id: '3',
      name: 'Maria Garcia',
      cuisine: 'Spanish Cuisine',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548'
    },
    date: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    time: '20:00',
    numberOfGuests: 6,
    location: '789 Broadway, New York, NY',
    status: 'completed',
    totalAmount: 600
  },
  {
    _id: 'booking4',
    chef: {
      _id: '7',
      name: 'Sophie Laurent',
      cuisine: 'Pastry & Desserts',
      image: 'https://images.unsplash.com/photo-1607631568010-a87245c0dbd6'
    },
    date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    time: '15:00',
    numberOfGuests: 8,
    location: '101 Fifth Ave, New York, NY',
    status: 'cancelled',
    totalAmount: 720
  }
];

const Bookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        setError('Please log in to view your bookings');
        setLoading(false);
        return;
      }

      try {
        const response = await bookingAPI.getBookings();
        
        if (response.data && Array.isArray(response.data)) {
          // Filter bookings to only show the current user's bookings
          const userBookings = response.data.filter(booking => 
            booking.userId === user.id || 
            booking.user?._id === user.id ||
            booking.user?.id === user.id
          );
          setBookings(userBookings);
        } else if (response.data && Array.isArray(response.data.bookings)) {
          // Filter bookings to only show the current user's bookings
          const userBookings = response.data.bookings.filter(booking => 
            booking.userId === user.id || 
            booking.user?._id === user.id ||
            booking.user?.id === user.id
          );
          setBookings(userBookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again.');
        setBookings([]);
      }
    } catch (err) {
      console.error('Error in fetchBookings:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      // Find the booking to cancel
      const bookingToCancel = bookings.find(b => b._id === bookingId);
      if (!bookingToCancel) {
        setError('Booking not found.');
        return;
      }
      
      // Verify the booking belongs to the current user
      if (bookingToCancel.userId !== user.id && 
          bookingToCancel.user?._id !== user.id &&
          bookingToCancel.user?.id !== user.id) {
        setError('You are not authorized to cancel this booking.');
        return;
      }
      
      await bookingAPI.cancelBooking(bookingId);
      
      // Update the booking status in the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
    } catch (err) {
      console.error('Error canceling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'upcoming') {
      return bookingDate >= today && booking.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return bookingDate < today && booking.status !== 'cancelled';
    } else if (activeTab === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <button
            onClick={() => navigate('/explore')}
            className="bg-[#D4AF37] text-white px-6 py-2 rounded-md hover:bg-[#C19B2E] transition-colors"
          >
            Book a Chef
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'upcoming'
                ? 'bg-[#D4AF37] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'past'
                ? 'bg-[#D4AF37] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'cancelled'
                ? 'bg-[#D4AF37] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    {booking.chef?.image ? (
                      <img
                        src={booking.chef.image}
                        alt={booking.chef.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        <i className="fas fa-user text-gray-400 text-2xl"></i>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.chef?.name || 'Chef Name Not Available'}
                      </h3>
                      <p className="text-gray-600">{booking.chef?.cuisine || 'Cuisine Not Specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <p className="text-gray-600 mt-2">
                      ${booking.totalAmount || 'Price not available'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="text-gray-900">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{booking.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="text-gray-900">{booking.numberOfGuests} people</p>
                  </div>
                </div>
                
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <i className="far fa-calendar-times text-gray-400 text-xl"></i>
            </div>
            <h3 className="mt-5 text-lg font-medium text-gray-900">No {activeTab} bookings</h3>
            <p className="mt-2 text-sm text-gray-500">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming bookings." 
                : activeTab === 'past'
                ? "You don't have any past bookings."
                : "You don't have any cancelled bookings."}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Bookings;