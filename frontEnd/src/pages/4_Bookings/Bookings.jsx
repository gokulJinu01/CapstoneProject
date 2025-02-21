import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import api from '../../services/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings')
      .then(response => {
        setBookings(response.data.bookings);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mt-10">My Bookings</h1>
        {loading ? (
          <p className="text-center mt-4">Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <div className="mt-8">
            {bookings.map(booking => (
              <div key={booking._id} className="border p-4 rounded-lg mb-4">
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-4">No bookings found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Bookings;