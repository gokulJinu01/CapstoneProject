import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const isSignedIn = Boolean(user);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Hire A Chef
            </Link>
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[#D4AF37]">Home</Link>
              <Link to="/explore" className="text-gray-700 hover:text-[#D4AF37]">Explore Chefs</Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-[#D4AF37]">How It Works</Link>
              <Link to="/about" className="text-gray-700 hover:text-[#D4AF37]">About Us</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link to="/favorites">
                  <button className="!rounded-button whitespace-nowrap px-4 py-2 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors">
                    <i className="fas fa-heart mr-2"></i> Favorites
                  </button>
                </Link>
                <Link to="/profile">
                  <button className="!rounded-button whitespace-nowrap px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors">
                    <i className="fas fa-user mr-2"></i> Profile
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="!rounded-button whitespace-nowrap px-6 py-2 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="!rounded-button whitespace-nowrap px-6 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;