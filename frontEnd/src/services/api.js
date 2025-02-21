import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'  // Adjust if your backend runs on a different URL/port
});

export default api;