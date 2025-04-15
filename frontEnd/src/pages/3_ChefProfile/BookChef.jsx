import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, bookingAPI } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const BookChef = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    numberOfGuests: 2,
    location: '',
    occasion: '',
    specialRequests: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchChefData();
  }, [id]);

  const fetchChefData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get chef data
      const chefResponse = await userAPI.getChefProfile(id);
      console.log('Chef response:', chefResponse.data);
      
      // Check if there's a chef object in the response
      if (chefResponse.data && chefResponse.data.chef) {
        setChef(chefResponse.data.chef);
      } else if (chefResponse.data) {
        setChef(chefResponse.data);
      } else {
        setError('Chef profile data not found');
      }
    } catch (error) {
      console.error('Error fetching chef data:', error);
      setError('Failed to load chef profile. Please try again later.');
    } finally {
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
    
    if (!user) {
      setError('Please log in to book a chef');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have chef data
      if (!chef || !chef._id) {
        throw new Error('Chef information is not available');
      }
      
      // Calculate estimated duration and total amount
      const hourlyRate = chef.chefProfile?.hourlyRate || 100;
      const estimatedDuration = 3; // Default to 3 hours if not specified
      const totalAmount = hourlyRate * estimatedDuration;
      
      // Create booking data with complete chef information
      const bookingData = {
        chefId: chef._id,
        chef: {
          _id: chef._id,
          name: chef.name,
          cuisine: chef.chefProfile?.specialty || chef.chefProfile?.cuisines?.join(', ') || 'Various Cuisines',
          image: chef.profilePicture || chef.chefProfile?.image,
          hourlyRate: chef.chefProfile?.hourlyRate
        },
        userId: user.id,
        user: {
          _id: user.id,
          name: user.name,
          email: user.email
        },
        date: formData.date,
        time: formData.time,
        numberOfGuests: parseInt(formData.numberOfGuests),
        location: formData.location,
        occasion: formData.occasion || undefined,
        specialRequests: formData.specialRequests || undefined,
        contactPhone: formData.contactPhone,
        status: 'pending',
        estimatedDuration,
        totalAmount,
        createdAt: new Date().toISOString()
      };
      
      // Submit booking
      const response = await bookingAPI.createBooking(bookingData);
      console.log('Booking created:', response.data);
      
      setSuccess(true);
      
      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create booking. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format today's date for min attribute
  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (loading && !chef) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading chef information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !chef) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
            <button 
              onClick={() => navigate(-1)} 
              className="mt-2 text-[#D4AF37] hover:text-[#C19B2E]"
            >
              Go back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="py-10 px-4 sm:px-6 lg:px-8 flex-grow max-w-4xl mx-auto w-full">
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-5 rounded-md text-center">
            <h2 className="text-xl font-bold mb-2">Booking Successful!</h2>
            <p>Your booking with {chef.name} has been created successfully.</p>
            <p className="mt-2">Redirecting to your bookings page...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Session with {chef?.name}</h1>
              <p className="text-gray-600">Fill in the details below to book {chef?.name} for your culinary experience.</p>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row mb-6">
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
                    <img 
                      src={chef?.chefProfile?.image || "https://placehold.co/100x100/e0e0e0/ffffff?text=Chef"} 
                      alt={chef?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h2 className="text-xl font-semibold text-gray-800">{chef?.name}</h2>
                  <p className="text-[#D4AF37] mb-1">{chef?.chefProfile?.specialty || "Various Cuisines"}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < Math.floor(chef?.chefProfile?.rating || 0) ? '' : 'text-gray-300'}`}
                        ></i>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{chef?.chefProfile?.rating || '4.5'}</span>
                  </div>
                  <p className="text-gray-600">
                    {chef?.chefProfile?.hourlyRate 
                      ? `$${chef.chefProfile.hourlyRate}/hour` 
                      : "Contact for pricing details"}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={getTodayFormatted()}
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    id="numberOfGuests"
                    name="numberOfGuests"
                    min="1"
                    max="50"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location/Address *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    placeholder="Full address where the chef will cook"
                  />
                </div>
                
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    placeholder="Your phone number for contact"
                  />
                </div>
                
                <div>
                  <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">
                    Occasion (Optional)
                  </label>
                  <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  >
                    <option value="">Select occasion (optional)</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="4"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    placeholder="Any dietary restrictions, allergies, or special requests..."
                  ></textarea>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Booking Summary</h3>
                  <p className="text-sm text-gray-600 mb-1">Chef: {chef?.name}</p>
                  <p className="text-sm text-gray-600 mb-1">Cuisine: {chef?.chefProfile?.specialty || "Various Cuisines"}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Estimated Price: {chef?.chefProfile?.hourlyRate 
                      ? `$${chef.chefProfile.hourlyRate} per hour (final price may vary)` 
                      : "To be determined"}
                  </p>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-xs text-gray-500">
                      By booking, you agree to our <a href="#" className="text-[#D4AF37]">Terms of Service</a> and <a href="#" className="text-[#D4AF37]">Cancellation Policy</a>.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D4AF37] hover:bg-[#C19B2E] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Book Now'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookChef; 