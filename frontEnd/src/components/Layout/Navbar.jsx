// src/components/Layout/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isSignedIn, user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-800">
                <span className="text-[#D4AF37]">Hire</span> A Chef
              </span>
            </Link>
            
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link 
                to="/" 
                className={`text-base font-medium transition-colors ${
                  isActive('/') ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-700 hover:text-[#D4AF37]'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/explore" 
                className={`text-base font-medium transition-colors ${
                  isActive('/explore') ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-700 hover:text-[#D4AF37]'
                }`}
              >
                Explore Chefs
              </Link>
              {isSignedIn && (
                <Link 
                  to="/bookings" 
                  className={`text-base font-medium transition-colors ${
                    isActive('/bookings') ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-700 hover:text-[#D4AF37]'
                  }`}
                >
                  My Bookings
                </Link>
              )}
              <Link 
                to="/how-it-works" 
                className={`text-base font-medium transition-colors ${
                  isActive('/how-it-works') ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-700 hover:text-[#D4AF37]'
                }`}
              >
                How It Works
              </Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link to="/favorites">
                  <button className="rounded-full px-4 py-2 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors flex items-center">
                    <i className="fas fa-heart mr-2"></i>
                    Favorites
                  </button>
                </Link>
                <div className="relative group">
                  <button className="rounded-full px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors flex items-center">
                    <i className="fas fa-user mr-2"></i>
                    {user?.name || 'Profile'}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <i className="fas fa-user-circle mr-2"></i> My Profile
                    </Link>
                    <Link to="/bookings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <i className="fas fa-calendar-alt mr-2"></i> My Bookings
                    </Link>
                    {user?.role === 'Chef' && (
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <i className="fas fa-chart-line mr-2"></i> Chef Dashboard
                      </Link>
                    )}
                    {user?.role === 'Admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <i className="fas fa-cog mr-2"></i> Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="rounded-full px-6 py-2 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="rounded-full px-6 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#D4AF37] focus:outline-none"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-inner border-t">
          <nav className="flex flex-col space-y-3 pb-3">
            <Link 
              to="/" 
              className={`text-base font-medium block py-2 ${
                isActive('/') ? 'text-[#D4AF37]' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`text-base font-medium block py-2 ${
                isActive('/explore') ? 'text-[#D4AF37]' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Chefs
            </Link>
            {isSignedIn && (
              <Link 
                to="/bookings" 
                className={`text-base font-medium block py-2 ${
                  isActive('/bookings') ? 'text-[#D4AF37]' : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}
            <Link 
              to="/how-it-works" 
              className={`text-base font-medium block py-2 ${
                isActive('/how-it-works') ? 'text-[#D4AF37]' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            
            {isSignedIn ? (
              <>
                <Link 
                  to="/favorites" 
                  className="text-base font-medium block py-2 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-heart mr-2 text-[#D4AF37]"></i> Favorites
                </Link>
                <Link 
                  to="/profile" 
                  className="text-base font-medium block py-2 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-user-circle mr-2 text-[#D4AF37]"></i> My Profile
                </Link>
                {user?.role === 'Chef' && (
                  <Link 
                    to="/dashboard" 
                    className="text-base font-medium block py-2 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-chart-line mr-2 text-[#D4AF37]"></i> Chef Dashboard
                  </Link>
                )}
                {user?.role === 'Admin' && (
                  <Link 
                    to="/admin" 
                    className="text-base font-medium block py-2 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-cog mr-2 text-[#D4AF37]"></i> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setMobileMenuOpen(false);
                    window.location.href = '/';
                  }}
                  className="text-base font-medium block py-2 text-red-600 w-full text-left"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                </button>
              </>
            ) : (
              <div className="flex space-x-4 pt-2">
                <Link 
                  to="/login" 
                  className="block w-1/2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full rounded-full px-4 py-2 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link 
                  to="/register" 
                  className="block w-1/2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full rounded-full px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;