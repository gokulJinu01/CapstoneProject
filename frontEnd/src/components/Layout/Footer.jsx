import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would send this to your backend
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold">
                <span className="text-[#D4AF37]">Hire</span> A Chef
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Bringing professional culinary experiences to your home. Explore chefs, book services, and enjoy gourmet meals.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-lg">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/explore" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  Find Chefs
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  to="/faqs" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-lg">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/accessibility" 
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-lg">Subscribe</h4>
            <p className="text-gray-400 mb-4">
              Get exclusive offers and updates on new chefs and services.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-l-md w-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-[#D4AF37] text-white px-4 py-2 rounded-r-md hover:bg-[#C19B2E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              {subscribed && (
                <p className="text-[#D4AF37] text-sm">Thanks for subscribing!</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Hire A Chef. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 text-sm">
              Made with <i className="fas fa-heart text-[#D4AF37]"></i> in New York City
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;