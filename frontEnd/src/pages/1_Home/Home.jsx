// src/pages/1_Home/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, reviewAPI } from '../../services/api';
import * as echarts from 'echarts';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const Home = () => {
  const { user } = useAuth();
  const [featuredChefs, setFeaturedChefs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedChefs();
    fetchTestimonials();
  }, []);

  useEffect(() => {
    initSatisfactionChart();
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, []);

  const fetchFeaturedChefs = async () => {
    try {
      const response = await userAPI.getChefs({ featured: true, limit: 6 });
      setFeaturedChefs(response.data.chefs);
    } catch (error) {
      console.error('Error fetching featured chefs:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await reviewAPI.getTestimonials();
      setTestimonials(response.data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Set placeholder testimonials when API fails
      setTestimonials([
        {
          id: '1',
          name: 'John Smith',
          image: 'https://placehold.co/100x100/2c3e50/ffffff?text=JS',
          text: 'Amazing experience! The chef was professional and the food was delicious.',
          rating: 5
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          image: 'https://placehold.co/100x100/8e44ad/ffffff?text=SJ',
          text: 'Perfect dinner party thanks to our wonderful chef. Will definitely book again!',
          rating: 5
        },
        {
          id: '3',
          name: 'Michael Williams',
          image: 'https://placehold.co/100x100/16a085/ffffff?text=MW',
          text: 'The cooking class we booked was informative and fun. We learned so many new techniques!',
          rating: 4
        }
      ]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
  };

  const initSatisfactionChart = () => {
    const chartDom = document.getElementById('satisfactionChart');
    if (!chartDom) return;

    if (chartRef.current) {
      chartRef.current.dispose();
    }

    const myChart = echarts.init(chartDom);
    chartRef.current = myChart;

    const option = {
      title: {
        text: 'Customer Satisfaction',
        left: 'center',
        textStyle: {
          color: '#333',
          fontWeight: 'normal',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        data: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
      },
      series: [
        {
          name: 'Satisfaction',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 70, name: 'Very Satisfied', itemStyle: { color: '#D4AF37' } },
            { value: 20, name: 'Satisfied', itemStyle: { color: '#2ecc71' } },
            { value: 7, name: 'Neutral', itemStyle: { color: '#3498db' } },
            { value: 2, name: 'Dissatisfied', itemStyle: { color: '#e67e22' } },
            { value: 1, name: 'Very Dissatisfied', itemStyle: { color: '#e74c3c' } }
          ]
        }
      ]
    };

    myChart.setOption(option);
    
    // Make chart responsive
    window.addEventListener('resize', () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative flex-shrink-0 pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              Experience Culinary Excellence at Home
            </h1>
            <p className="text-xl text-white mb-8">
              Book professional chefs for private dining, events, or cooking classes.
            </p>
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg p-2 max-w-2xl">
              <i className="fas fa-search text-gray-400 mx-3"></i>
              <input
                type="text"
                placeholder="Search for cuisines or chefs..."
                className="flex-1 border-none outline-none py-2 px-4 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="rounded-full px-6 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors ml-2 font-medium"
              >
                Find Chefs
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-2xl mb-4">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Chef</h3>
              <p className="text-gray-600">
                Browse profiles, read reviews, and find the perfect chef for your occasion.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-2xl mb-4">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Your Experience</h3>
              <p className="text-gray-600">
                Select a date, customize your menu, and confirm your booking.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-2xl mb-4">
                <i className="fas fa-utensils"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Meal</h3>
              <p className="text-gray-600">
                Relax as your chef prepares a memorable culinary experience in your home.
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Link to="/how-it-works">
              <button className="rounded-full px-8 py-3 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors font-medium">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Chefs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Featured Chefs
          </h2>
          {featuredChefs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredChefs.map((chef) => (
                <div key={chef._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={chef.chefProfile?.image || "https://placehold.co/300x300/e0e0e0/ffffff?text=Chef"}
                      alt={chef.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{chef.name}</h3>
                    <p className="text-gray-600 mb-2">
                      <i className="fas fa-utensils mr-2 text-[#D4AF37]"></i>
                      {chef.chefProfile?.specialty || "Various Cuisines"}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <i className="fas fa-certificate mr-2 text-[#D4AF37]"></i>
                      {chef.chefProfile?.experience || "Professional Chef"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-star text-[#D4AF37] mr-1"></i>
                        <span className="text-gray-700">{chef.chefProfile?.rating || '4.5'}</span>
                      </div>
                      <Link to={`/chef/${chef._id}`}>
                        <button className="rounded-full px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors">
                          View Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-3xl text-[#D4AF37] mb-4"></i>
                <p className="text-gray-600">Loading featured chefs...</p>
              </div>
            </div>
          )}
          <div className="flex justify-center mt-12">
            <Link to="/explore">
              <button className="rounded-full px-8 py-3 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors font-medium">
                Explore All Chefs
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            What Our Clients Say
          </h2>
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={`star-${testimonial.id}-${i}`} 
                            className={`fas fa-star text-xs ${i < testimonial.rating ? 'text-[#D4AF37]' : 'text-gray-300'} mr-1`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{testimonial.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-3xl text-[#D4AF37] mb-4"></i>
                <p className="text-gray-600">Loading testimonials...</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div id="satisfactionChart" style={{ width: '100%', height: '300px' }}></div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-[#D4AF37]">1,200+</h3>
                  <p className="text-gray-600 mt-2">Happy Customers</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-[#D4AF37]">300+</h3>
                  <p className="text-gray-600 mt-2">Professional Chefs</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-[#D4AF37]">5,000+</h3>
                  <p className="text-gray-600 mt-2">Meals Served</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-[#D4AF37]">4.8</h3>
                  <p className="text-gray-600 mt-2">Average Rating</p>
                </div>
              </div>
            </div>
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
            Whether you're planning a special dinner, organizing an event, or looking to learn new culinary skills, 
            our professional chefs are ready to create exceptional experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/explore">
              <button className="w-full sm:w-auto rounded-full px-8 py-3 bg-white text-[#D4AF37] hover:bg-gray-100 transition-colors font-medium">
                Find a Chef
              </button>
            </Link>
            <Link to="/register">
              <button className="w-full sm:w-auto rounded-full px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[#D4AF37] transition-colors font-medium">
                Join as a Chef
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;