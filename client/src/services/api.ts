import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Update with your server URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
