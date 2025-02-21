// The main "Home" page, which incorporates all the content from your code snippet.
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import * as echarts from 'echarts';

// We recommend you import Swiper's CSS in your index.css or Tailwind's globals
// import 'swiper/css';
// import 'swiper/css/pagination';
// etc.

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  useEffect(() => {
    const chartDom = document.getElementById('satisfaction-chart');
    if (!chartDom) return;
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
      series: [
        {
          data: [95, 93, 98, 94, 97, 99],
          type: 'line',
          smooth: true,
          color: '#D4AF37'
        }
      ]
    };
    chart.setOption(option);
  }, []);

  const featuredChefs = [
    {
      id: 1,
      name: 'Chef Michael Anderson',
      specialty: 'French Cuisine',
      rating: 4.9,
      image:
        'https://public.readdy.ai/ai/img_res/a0d19061338e025a13a93eeca1677588.jpg'
    },
    {
      id: 2,
      name: 'Chef Isabella Martinez',
      specialty: 'Mediterranean',
      rating: 4.8,
      image:
        'https://public.readdy.ai/ai/img_res/3c75c6ba87f3e082fa878b1bf5f58e67.jpg'
    },
    {
      id: 3,
      name: 'Chef James Wilson',
      specialty: 'Asian Fusion',
      rating: 4.9,
      image:
        'https://public.readdy.ai/ai/img_res/84f0316fb53cd10cc274edc3ab952de6.jpg'
    }
  ];

  const cuisineCategories = [
    {
      name: 'French',
      image:
        'https://public.readdy.ai/ai/img_res/b1e99a5bacc3f605ba496438b2b6f150.jpg'
    },
    {
      name: 'Italian',
      image:
        'https://public.readdy.ai/ai/img_res/5e415da90787f6a4e94fd52ac8f94275.jpg'
    },
    {
      name: 'Japanese',
      image:
        'https://public.readdy.ai/ai/img_res/2453dc8230a457672d2ee7134c9c6965.jpg'
    },
    {
      name: 'Mediterranean',
      image:
        'https://public.readdy.ai/ai/img_res/eb9feec4a79008f6dd9ef995ba57f262.jpg'
    }
  ];

  const testimonials = [
    {
      name: 'Elizabeth Thompson',
      role: 'Event Organizer',
      comment:
        'The chef created an unforgettable dining experience for our corporate event. Exceptional service and incredible flavors!',
      rating: 5,
      image:
        'https://public.readdy.ai/ai/img_res/174a60edbabb49213ac95c8af195bc7d.jpg'
    },
    {
      name: 'Robert Mitchell',
      role: 'Food Enthusiast',
      comment:
        'Having a personal chef at home was amazing. The attention to detail and personalized menu exceeded our expectations.',
      rating: 5,
      image:
        'https://public.readdy.ai/ai/img_res/1eccaf65dd6475c53b8a1af4a2c00986.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://public.readdy.ai/ai/img_res/30caef81ffc00caf2165f4b3132105ab.jpg')`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Experience Culinary Excellence at Home
            </h1>
            <p className="text-xl text-white mb-8">
              Book professional chefs for private dining, events, or cooking
              classes. Elevate your dining experience with personalized menus.
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
              <button className="!rounded-button whitespace-nowrap px-6 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors ml-2">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredChefs.map((chef) => (
              <div key={chef.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                      <span className="text-gray-700">{chef.rating}</span>
                    </div>
                    <button className="!rounded-button whitespace-nowrap px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C19B2E] transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Explore Cuisines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {cuisineCategories.map((cuisine, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedCuisine(cuisine.name)}
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
              <p className="text-gray-600">
                Explore our curated selection of professional chefs and their unique menus.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-calendar-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Book &amp; Customize</h3>
              <p className="text-gray-600">
                Choose your date and customize your menu according to your preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-utensils text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Enjoy the Experience</h3>
              <p className="text-gray-600">
                Relax and enjoy a professional culinary experience in your own space.
              </p>
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
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#D4AF37] rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Stay Updated</h2>
            <p className="text-white mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive chef interviews, recipes, and special offers.
            </p>
            <div className="flex items-center justify-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-l-lg border-none outline-none"
              />
              <button className="!rounded-button whitespace-nowrap px-8 py-3 bg-gray-800 text-white hover:bg-gray-700 transition-colors rounded-l-none">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
