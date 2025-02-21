import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import * as echarts from 'echarts';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredChefs, setFeaturedChefs] = useState([]);
  const [cuisineCategories, setCuisineCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/chefs')
      .then(response => setFeaturedChefs(response.data.chefs))
      .catch(error => console.error('Error fetching chefs:', error));

    api.get('/cuisines')
      .then(response => setCuisineCategories(response.data.cuisines))
      .catch(error => console.error('Error fetching cuisines:', error));

    api.get('/testimonials')
      .then(response => setTestimonials(response.data.testimonials))
      .catch(error => console.error('Error fetching testimonials:', error));

    const chartDom = document.getElementById('satisfaction-chart');
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const option = {
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        yAxis: {
          type: 'value',
          max: 100
        },
        series: [{
          data: [95, 93, 98, 94, 97, 99],
          type: 'line',
          smooth: true,
          color: '#D4AF37'
        }]
      };
      chart.setOption(option);
    }
  }, []);

  const handleSearch = () => {
    console.log('Search clicked with query:', searchQuery);
    // Implement search functionality
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <div className="relative pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://public.readdy.ai/ai/img_res/30caef81ffc00caf2165f4b3132105ab.jpg')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Experience Culinary Excellence at Home
            </h1>
            <p className="text-xl text-white mb-8">
              Book professional chefs for private dining, events, or cooking classes.
            </p>
            <div className="flex items-center bg-white rounded-lg p-2 max-w-2xl">
              <i className="fas fa-search text-gray-400 mx-3"></i>
              <input
                type="text"
                placeholder="Search for cuisines or chefs..."
                className="flex-1 border-none outline-none py-2 px-4 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="!rounded-button whitespace-nowrap px-6 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors ml-2"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Chefs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Featured Chefs
          </h2>
          {featuredChefs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredChefs.map((chef) => (
                <div key={chef._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{chef.name}</h3>
                    <p className="text-gray-600 mb-4">{chef.specialty}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-star text-[#D4AF37] mr-1"></i>
                        <span>{chef.rating}</span>
                      </div>
                      <button
                        onClick={() => console.log("Book Now for", chef._id)}
                        className="!rounded-button whitespace-nowrap px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                    <Link to={`/chef/${chef._id}`} className="block mt-4 text-[#D4AF37] hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">Loading featured chefs...</p>
          )}
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Explore Cuisines
          </h2>
          {cuisineCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {cuisineCategories.map((cuisine, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => console.log('Selected cuisine:', cuisine.name)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={cuisine.image}
                      alt={cuisine.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                    <h3 className="text-2xl font-semibold text-white">{cuisine.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">Loading cuisines...</p>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Browse &amp; Select</h3>
              <p className="text-gray-600">Explore our curated selection of professional chefs.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-calendar-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Book &amp; Customize</h3>
              <p className="text-gray-600">Choose your date and customize your menu.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-utensils text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Enjoy the Experience</h3>
              <p className="text-gray-600">Relax and enjoy a professional culinary experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Customer Satisfaction
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div id="satisfaction-chart" style={{ width: '100%', height: '300px' }}></div>
            </div>
            <div>
              {testimonials.length > 0 ? (
                <div className="space-y-8">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                          <p className="text-gray-600 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{testimonial.comment}</p>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-[#D4AF37] mr-1"></i>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">Loading testimonials...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;