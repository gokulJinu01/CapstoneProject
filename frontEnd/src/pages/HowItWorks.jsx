import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        {/* Hero Section */}
        <div className="bg-[#D4AF37] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">How It Works</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Discover how easy it is to book a professional chef for your next dining experience
            </p>
          </div>
        </div>
        
        {/* Steps Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800">Your Journey to Culinary Excellence</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                In just a few simple steps, you can enjoy a restaurant-quality dining experience in the comfort of your own home.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-gray-50 rounded-lg p-8 text-center relative">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div className="h-16 w-16 mx-auto mb-4 text-[#D4AF37]">
                  <i className="fas fa-search text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Find Your Chef</h3>
                <p className="text-gray-600">
                  Browse through our curated selection of professional chefs, read reviews, and find the perfect match for your culinary needs.
                </p>
                <div className="mt-6">
                  <Link to="/explore" className="text-[#D4AF37] font-medium hover:text-[#C19B2E] inline-flex items-center">
                    Browse Chefs
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="bg-gray-50 rounded-lg p-8 text-center relative">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div className="h-16 w-16 mx-auto mb-4 text-[#D4AF37]">
                  <i className="fas fa-calendar-alt text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Book Your Experience</h3>
                <p className="text-gray-600">
                  Choose a date and time, discuss menu options, and confirm all details directly through our platform.
                </p>
                <div className="mt-6">
                  <Link to="/explore" className="text-[#D4AF37] font-medium hover:text-[#C19B2E] inline-flex items-center">
                    Make a Booking
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="bg-gray-50 rounded-lg p-8 text-center relative">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div className="h-16 w-16 mx-auto mb-4 text-[#D4AF37]">
                  <i className="fas fa-utensils text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Enjoy Your Meal</h3>
                <p className="text-gray-600">
                  Relax as your chef arrives, prepares, and serves a delicious meal, and even takes care of the cleanup afterward.
                </p>
                <div className="mt-6">
                  <Link to="/register" className="text-[#D4AF37] font-medium hover:text-[#C19B2E] inline-flex items-center">
                    Create Account
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Service Types */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                We offer various culinary experiences to suit your needs and occasions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="h-16 w-16 mx-auto mb-4 text-[#D4AF37]">
                  <i className="fas fa-glass-cheers text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Private Dining</h3>
                <p className="text-gray-600">
                  Intimate dining experiences for special occasions, date nights, or just because.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="h-16 w-16 mx-auto mb-4 text-[#D4AF37]">
                  <i className="fas fa-users text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Events & Parties</h3>
                <p className="text-gray-600">
                  Catering for larger gatherings, celebrations, and corporate events.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="h-16 w-16 mx-auto mb-4 text-[#D4AF37]">
                  <i className="fas fa-chalkboard-teacher text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Cooking Classes</h3>
                <p className="text-gray-600">
                  Learn new techniques and recipes with hands-on instruction from professionals.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="h-16 w-16 mx-auto mb-4 text-[#D4AF37]">
                  <i className="fas fa-carrot text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Meal Prep</h3>
                <p className="text-gray-600">
                  Weekly meal preparation services to enjoy healthy, chef-prepared foods all week.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Everything you need to know about hiring a personal chef
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900">How much does it cost to hire a chef?</h3>
                <p className="mt-3 text-gray-600">
                  Pricing varies based on the chef's experience, menu complexity, number of guests, and services required. 
                  Chefs set their own rates which typically range from $50-$200+ per person. You can see pricing details on each chef's profile.
                </p>
              </div>
              
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900">Do I need to provide cooking equipment?</h3>
                <p className="mt-3 text-gray-600">
                  Most chefs will use your kitchen equipment, but they may bring specialty tools or equipment when needed. 
                  This can be discussed and arranged during the booking process.
                </p>
              </div>
              
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900">How far in advance should I book?</h3>
                <p className="mt-3 text-gray-600">
                  We recommend booking at least 1-2 weeks in advance, especially for special occasions or popular dates. 
                  However, some chefs may accommodate last-minute bookings based on their availability.
                </p>
              </div>
              
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900">Can I customize the menu?</h3>
                <p className="mt-3 text-gray-600">
                  Absolutely! Most chefs offer customizable menus and can accommodate dietary restrictions, allergies, and preferences. 
                  You can discuss menu options directly with your chef after booking.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link to="/faqs" className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#D4AF37] hover:bg-[#C19B2E]">
                View All FAQs
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-[#D4AF37]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Experience Culinary Excellence?
            </h2>
            <p className="text-white mb-8 text-lg max-w-3xl mx-auto">
              Create an account or start browsing our chef selection today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/explore">
                <button className="w-full sm:w-auto rounded-full px-8 py-3 bg-white text-[#D4AF37] hover:bg-gray-100 transition-colors font-medium">
                  Find a Chef
                </button>
              </Link>
              <Link to="/register">
                <button className="w-full sm:w-auto rounded-full px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[#D4AF37] transition-colors font-medium">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default HowItWorks; 