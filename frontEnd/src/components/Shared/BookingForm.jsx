import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, userAPI } from '../../services/api';

const BookingForm = () => {
  const { chefId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    numberOfGuests: 1,
    menuId: '',
    specialRequests: '',
    location: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchChefDetails();
  }, [chefId]);

  const fetchChefDetails = async () => {
    try {
      const response = await userAPI.getChefProfile(chefId);
      setChef(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chef details:', err);
      setError('Failed to load chef details.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await bookingAPI.createBooking({
        ...formData,
        chefId,
        userId: user._id
      });
      
      // Navigate to payment page or booking confirmation
      navigate(`/bookings/${response.data._id}/payment`);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!chef) {
    return <div className="text-center">Chef not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Book {chef.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Number of Guests</label>
          <input
            type="number"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            required
            min="1"
            max="20"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Menu Selection</label>
          <select
            name="menuId"
            value={formData.menuId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            required
          >
            <option value="">Select a menu</option>
            {chef.menus?.map(menu => (
              <option key={menu._id} value={menu._id}>
                {menu.name} - ${menu.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            required
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Contact Phone</label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Special Requests</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            rows="4"
            placeholder="Any dietary restrictions or special requests?"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#D4AF37] text-white py-2 rounded hover:bg-[#C19B2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm; 