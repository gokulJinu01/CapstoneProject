// You can use Axios or Fetch here for your API calls
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api' // or your actual backend URL
});

export default api;
