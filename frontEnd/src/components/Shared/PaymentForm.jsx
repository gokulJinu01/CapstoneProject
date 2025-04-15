import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, paymentAPI } from '../../services/api';

const PaymentForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getBookingById(bookingId);
      setBooking(response.data);
      
      // Create payment intent
      const paymentResponse = await paymentAPI.createPaymentIntent(bookingId);
      setClientSecret(paymentResponse.data.clientSecret);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      await paymentAPI.processPayment(bookingId);
      setPaymentStatus('success');
      // Redirect to booking confirmation after a short delay
      setTimeout(() => {
        navigate(`/bookings/${bookingId}`);
      }, 2000);
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading payment details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!booking) {
    return <div className="text-center">Booking not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      
      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Chef:</span> {booking.chef.name}
          </p>
          <p>
            <span className="font-medium">Date:</span>{' '}
            {new Date(booking.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Time:</span>{' '}
            {new Date(booking.date).toLocaleTimeString()}
          </p>
          <p>
            <span className="font-medium">Guests:</span> {booking.numberOfGuests}
          </p>
          <p>
            <span className="font-medium">Total Amount:</span> ${booking.totalAmount}
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="123"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Name on Card</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          {paymentStatus === 'success' ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Payment successful! Redirecting to booking details...
            </div>
          ) : (
            <button
              onClick={handlePaymentSuccess}
              className="w-full bg-[#D4AF37] text-white py-2 rounded hover:bg-[#C19B2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 