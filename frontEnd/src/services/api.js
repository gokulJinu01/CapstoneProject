// You can use Axios or Fetch here for your API calls
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request interceptor - token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request interceptor - headers:', config.headers);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => {
    console.log('Response interceptor - response:', response);
    return response;
  },
  (error) => {
    console.error('Response interceptor - error:', error);
    console.error('Response interceptor - error response:', error.response);
    
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Clear local storage and redirect to login page
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show notification
        if (!window.location.pathname.includes('/login')) {
          alert('Your session has expired. Please log in again.');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  validateToken: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadProfileImage: (formData) => 
    api.post('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  getChefs: (params) => {
    console.log('API getChefs called with params:', params);
    return api.get('/chefs', { params });
  },
  getChefProfile: (id) => api.get(`/chefs/${id}`),
  updateChefProfile: (data) => api.put('/users/chef/profile', data),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (chefId) => api.post('/users/favorites', { chefId }),
  removeFavorite: (chefId) => api.delete(`/users/favorites/${chefId}`),
  checkFavoriteStatus: (chefId) => api.get(`/users/favorites/check/${chefId}`)
};

// Booking endpoints
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getBookings: (params) => api.get('/bookings', { params }),
  getChefBookings: (params) => api.get('/bookings/chef', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBookingStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  getBookingStats: () => api.get('/bookings/stats')
};

// Review endpoints
export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getChefReviews: (chefId, params) => api.get(`/reviews/chef/${chefId}`, { params }),
  getUserReviews: () => api.get('/reviews/user'),
  getReviewById: (id) => api.get(`/reviews/${id}`),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  getTestimonials: () => api.get('/reviews/testimonials')
};

// Menu endpoints
export const menuAPI = {
  createMenu: (data) => api.post('/menus', data),
  getMenus: (params) => api.get('/menus', { params }),
  getMenuById: (id) => api.get(`/menus/${id}`),
  updateMenu: (id, data) => api.put(`/menus/${id}`, data),
  deleteMenu: (id) => api.delete(`/menus/${id}`),
  getChefMenus: (chefId) => api.get(`/chefs/${chefId}/menus`),
  addMenuItem: (menuId, data) => api.post(`/menus/${menuId}/items`, data),
  updateMenuItem: (menuId, itemId, data) => api.put(`/menus/${menuId}/items/${itemId}`, data),
  deleteMenuItem: (menuId, itemId) => api.delete(`/menus/${menuId}/items/${itemId}`)
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  getAllChefs: (params) => api.get('/admin/chefs', { params }),
  updateChef: (id, data) => api.put(`/admin/chefs/${id}`, data),
  approveChef: (id) => api.put(`/admin/chefs/${id}/approve`),
  rejectChef: (id) => api.put(`/admin/chefs/${id}/reject`),
  
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  updateBooking: (id, data) => api.put(`/admin/bookings/${id}`, data),
  deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),
  
  getAllReviews: (params) => api.get('/admin/reviews', { params }),
  approveReview: (id) => api.put(`/admin/reviews/${id}/approve`),
  rejectReview: (id) => api.delete(`/admin/reviews/${id}`)
};

export default api;
