import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
