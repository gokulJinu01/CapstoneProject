// src/pages/3_ChefProfile/ChefProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, reviewAPI, menuAPI } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const ChefProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [chef, setChef] = useState(null);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [activeImage, setActiveImage] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchChefData();
    checkFavoriteStatus();
  }, [id]);

  useEffect(() => {
    if (user && id) {
      checkFavoriteStatus();
    }
  }, [user, id]);

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
        setActiveImage(chefResponse.data.chef.chefProfile?.image || "https://placehold.co/300x300/e0e0e0/ffffff?text=Chef");
      } else if (chefResponse.data) {
        setChef(chefResponse.data);
        setActiveImage(chefResponse.data.chefProfile?.image || "https://placehold.co/300x300/e0e0e0/ffffff?text=Chef");
      } else {
        setError('Chef profile data not found');
        setLoading(false);
        return;
      }
      
      try {
        // Get menus - this might fail if the endpoint is not implemented
        const menusResponse = await menuAPI.getChefMenus(id);
        setMenus(menusResponse.data?.menus || []);
      } catch (menuError) {
        console.error('Error fetching menus:', menuError);
        setMenus([]);
      }
      
      try {
        // Get reviews - this might fail if the endpoint is not implemented
        const reviewsResponse = await reviewAPI.getChefReviews(id);
        setReviews(reviewsResponse.data?.reviews || []);
      } catch (reviewError) {
        console.error('Error fetching reviews:', reviewError);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching chef data:', error);
      setError('Failed to load chef profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      if (!user || !id) return;
      
      const response = await userAPI.checkFavoriteStatus(id);
      console.log('Favorite status response:', response);
      setIsFavorite(response.data?.isFavorite || false);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      // Don't show error to user, just set to false
      setIsFavorite(false);
    }
  };

  const handleGalleryClick = (imageUrl) => {
    setActiveImage(imageUrl);
    setShowGalleryModal(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-[#D4AF37]"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-[#D4AF37]"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-[#D4AF37]"></i>);
      }
    }

    return stars;
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please log in to add chefs to your favorites');
      return;
    }

    try {
      console.log('Current user:', user);
      console.log('Chef ID:', id);
      console.log('Current favorite status:', isFavorite);

      if (isFavorite) {
        const response = await userAPI.removeFavorite(id);
        console.log('Remove favorite response:', response);
        if (response.data) {
          setIsFavorite(false);
        }
      } else {
        const response = await userAPI.addFavorite(id);
        console.log('Add favorite response:', response);
        if (response.data) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Could not update favorites. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Please log in to manage your favorites';
        } else if (error.response.status === 404) {
          errorMessage = 'User not found. Please log in again.';
          // Clear local storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleContactClick = () => {
    if (!user) {
      alert('Please log in to contact the chef');
      return;
    }
    
    // Check if chef has contact information
    if (!chef.email && !chef.phone && !chef.chefProfile?.email && !chef.chefProfile?.phone) {
      alert('Contact information for this chef is not available. Please try booking them directly.');
      return;
    }
    
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-[#D4AF37] mb-4"></i>
            <p className="text-gray-600">Loading chef profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !chef) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-exclamation-circle text-3xl text-red-500 mb-4"></i>
            <p className="text-gray-800 font-medium">{error || 'Chef not found'}</p>
            <Link to="/explore" className="mt-4 inline-block text-[#D4AF37] hover:underline">
              Go back to Explore Chefs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <section className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden flex-shrink-0 shadow-md cursor-pointer" onClick={() => setShowGalleryModal(true)}>
                <img 
                  src={activeImage} 
                  alt={chef.name} 
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <h1 className="text-3xl font-bold text-gray-800">{chef.name}</h1>
                  {chef.chefProfile?.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#D4AF37] text-white mt-2 md:mt-0">
                      Featured Chef
                    </span>
                  )}
                </div>
                
                <p className="text-lg text-[#D4AF37] mb-4">
                  <i className="fas fa-utensils mr-2"></i>
                  {chef.chefProfile?.specialty || "Various Cuisines"}
                </p>
                
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <div className="flex items-center mr-4">
                    <div className="flex mr-2">
                      {renderStars(chef.chefProfile?.rating)}
                    </div>
                    <span className="font-medium">{chef.chefProfile?.rating || '4.5'}</span>
                    <span className="text-gray-500 ml-1">({reviews.length || 0} reviews)</span>
                  </div>
                  <div className="text-gray-600">
                    <i className="fas fa-map-marker-alt mr-1 text-[#D4AF37]"></i>
                    {chef.chefProfile?.location || 'Available for booking'}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {chef.chefProfile?.bio || "Professional chef offering culinary services for your events and special occasions."}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {chef.chefProfile?.specialties ? (
                    chef.chefProfile.specialties.map((specialty, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {chef.chefProfile?.specialty || 'Various Cuisines'}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Link to={`/chef/${chef._id}/book`}>
                    <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-full hover:bg-[#C19B2E] transition-colors">
                      <i className="far fa-calendar-alt mr-2"></i>
                      Book Now
                    </button>
                  </Link>
                  <button 
                    onClick={handleContactClick}
                    className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <i className="far fa-envelope mr-2"></i>
                    Contact Chef
                  </button>
                  <button 
                    onClick={handleToggleFavorite}
                    className="px-3 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? (
                      <i className="fas fa-heart text-red-500"></i>
                    ) : (
                      <i className="far fa-heart text-gray-500"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Gallery Preview */}
            {chef.chefProfile?.gallery && chef.chefProfile.gallery.length > 0 && (
              <div className="px-6 md:px-8 pb-6">
                <h3 className="text-lg font-semibold mb-3">Gallery</h3>
                <div className="grid grid-cols-5 gap-2">
                  <div 
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer ${activeImage === chef.chefProfile.image ? 'ring-2 ring-[#D4AF37]' : ''}`}
                    onClick={() => setActiveImage(chef.chefProfile.image)}
                  >
                    <img 
                      src={chef.chefProfile.image} 
                      alt="Main profile" 
                      className="w-full h-full object-cover object-center hover:opacity-90 transition-opacity"
                    />
                  </div>
                  {chef.chefProfile.gallery.map((image, index) => (
                    <div 
                      key={index} 
                      className={`aspect-square rounded-md overflow-hidden cursor-pointer ${activeImage === image ? 'ring-2 ring-[#D4AF37]' : ''}`}
                      onClick={() => setActiveImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover object-center hover:opacity-90 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
          
          {/* Quick Info */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-clock text-[#D4AF37] mr-2"></i>
                Experience
              </h3>
              <p className="text-gray-600">{chef.chefProfile?.experience || "Professional chef with years of experience"}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-dollar-sign text-[#D4AF37] mr-2"></i>
                Pricing
              </h3>
              <p className="text-gray-600">
                {chef.chefProfile?.hourlyRate 
                  ? `Starting at $${chef.chefProfile.hourlyRate}/hour` 
                  : "Contact for custom pricing"}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-users text-[#D4AF37] mr-2"></i>
                Availability
              </h3>
              <p className="text-gray-600">
                {chef.chefProfile?.availability 
                  ? "Available for booking" 
                  : "Currently unavailable"}
              </p>
            </div>
          </section>
          
          {/* Tabs Section */}
          <section className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'about'
                      ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('about')}
                >
                  About
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'menus'
                      ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('menus')}
                >
                  Menus
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* About Tab */}
              {activeTab === 'about' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">About {chef.name}</h2>
                  <p className="text-gray-600 mb-6">
                    {chef.chefProfile?.bio || "Professional chef with experience in culinary arts."}
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Culinary Background</h3>
                    <p className="text-gray-600 mb-2">
                      {chef.chefProfile?.experience || "Professional experience in the culinary industry"}
                    </p>
                    <p className="text-gray-600">
                      Specializing in {chef.chefProfile?.specialty || "various cuisines"} with expertise in creating memorable dining experiences.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chef.chefProfile?.specialties ? (
                        chef.chefProfile.specialties.map((specialty, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-1">{specialty}</h4>
                            <p className="text-sm text-gray-600">
                              Signature dish from {chef.name}'s repertoire.
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-1">{chef.chefProfile?.specialty || 'Various Cuisines'}</h4>
                          <p className="text-sm text-gray-600">
                            Signature style from {chef.name}'s culinary repertoire.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Booking Information</h3>
                    <p className="text-gray-600 mb-4">
                      {chef.name} is available for private dining events, cooking classes, and catering services.
                    </p>
                    
                    <Link to={`/chef/${chef._id}/book`}>
                      <button className="px-6 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C19B2E] transition-colors">
                        Check Availability
                      </button>
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Menus Tab */}
              {activeTab === 'menus' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Available Menus</h2>
                    <p className="text-gray-500 text-sm">
                      All prices are per person unless stated otherwise
                    </p>
                  </div>
                  
                  {menus.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {menus.map((menu) => (
                        <div key={menu._id || menu.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">{menu.name}</h3>
                          </div>
                          
                          <div className="p-4">
                            <p className="text-gray-600 mb-4">{menu.description}</p>
                            <p className="text-[#D4AF37] font-medium mb-4 text-xl">${menu.price}</p>
                            
                            <div className="space-y-4">
                              {menu.items?.map((item) => (
                                <div key={item._id || item.id} className="border-t border-gray-100 pt-3">
                                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-6">
                              <Link to={`/chef/${chef._id}/book`}>
                                <button className="w-full px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C19B2E] transition-colors">
                                  Book this Menu
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                        <i className="fas fa-utensils text-gray-400"></i>
                      </div>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No menus available</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Contact {chef.name} directly to discuss custom menu options.
                      </p>
                      <div className="mt-6">
                        <button className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-md hover:bg-gray-50 transition-colors">
                          Contact Chef
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Client Reviews</h2>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(chef.chefProfile?.rating)}
                      </div>
                      <span>{chef.chefProfile?.rating || '4.5'} ({reviews.length || 0} reviews)</span>
                    </div>
                  </div>
                  
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id || review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-start mb-4">
                            <img
                              src={review.user?.profileImage || "https://placehold.co/100x100/e0e0e0/ffffff?text=User"}
                              alt={review.user?.name}
                              className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-800">{review.user?.name || "Anonymous"}</h4>
                                  <div className="flex items-center">
                                    <div className="flex mr-2">
                                      {renderStars(review.rating)}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                  Verified Booking
                                </span>
                              </div>
                              <p className="text-gray-600 mt-2">{review.comment || review.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-4">
                        {reviews.length > 5 && (
                          <button className="text-[#D4AF37] font-medium hover:underline">
                            See all {reviews.length} reviews
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                        <i className="far fa-comment-alt text-gray-400"></i>
                      </div>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Be the first to review {chef.name}'s services.
                      </p>
                      <div className="mt-6">
                        <button className="px-6 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C19B2E] transition-colors">
                          Book a Service
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      
      {/* Image Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={() => setShowGalleryModal(false)}>
          <div className="max-w-4xl w-full h-full max-h-[80vh] p-4 relative" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-0 right-0 m-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setShowGalleryModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="h-full flex items-center justify-center">
              <img 
                src={activeImage} 
                alt={chef.name} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {chef.chefProfile?.gallery && chef.chefProfile.gallery.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 justify-center">
                <div 
                  className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === chef.chefProfile.image ? 'border-white' : 'border-transparent'}`}
                  onClick={() => setActiveImage(chef.chefProfile.image)}
                >
                  <img 
                    src={chef.chefProfile.image} 
                    alt="Main" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {chef.chefProfile.gallery.map((image, index) => (
                  <div 
                    key={index} 
                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === image ? 'border-white' : 'border-transparent'}`}
                    onClick={() => setActiveImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Contact {chef.name}</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              {(chef.email || chef.chefProfile?.email) && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-800">
                    <i className="far fa-envelope mr-2 text-[#D4AF37]"></i>
                    <a href={`mailto:${chef.email || chef.chefProfile?.email}`} className="hover:underline">
                      {chef.email || chef.chefProfile?.email}
                    </a>
                  </p>
                </div>
              )}
              
              {(chef.phone || chef.chefProfile?.phone) && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-800">
                    <i className="fas fa-phone-alt mr-2 text-[#D4AF37]"></i>
                    <a href={`tel:${chef.phone || chef.chefProfile?.phone}`} className="hover:underline">
                      {chef.phone || chef.chefProfile?.phone}
                    </a>
                  </p>
                </div>
              )}
              
              {chef.chefProfile?.location && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-gray-800">
                    <i className="fas fa-map-marker-alt mr-2 text-[#D4AF37]"></i>
                    {chef.chefProfile.location}
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">
                  You can also book this chef directly or send a message through our platform.
                </p>
                <div className="flex justify-center gap-4">
                  <Link 
                    to={`/chef/${chef._id}/book`}
                    className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C19B2E] transition-colors"
                    onClick={() => setShowContactModal(false)}
                  >
                    Book Now
                  </Link>
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      // Implement messaging functionality
                      alert('Messaging feature coming soon!');
                    }}
                    className="px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default ChefProfile;