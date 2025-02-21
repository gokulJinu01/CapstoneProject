import React from 'react';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Hire A Chef</h1>
            <nav className="hidden md:flex ml-10 space-x-8">
              <a href="#" className="text-gray-700 hover:text-[#D4AF37]">Home</a>
              <a href="#" className="text-gray-700 hover:text-[#D4AF37]">Explore Chefs</a>
              <a href="#" className="text-gray-700 hover:text-[#D4AF37]">How It Works</a>
              <a href="#" className="text-gray-700 hover:text-[#D4AF37]">About Us</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="!rounded-button whitespace-nowrap px-6 py-2 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors">
              Sign In
            </button>
            <button className="!rounded-button whitespace-nowrap px-6 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors">
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
