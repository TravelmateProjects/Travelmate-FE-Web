import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Automatically send cookies with every request
});

// Add an interceptor to automatically refresh the token when the accessToken expires
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call the refresh token API (assuming endpoint is /auth/refresh-token and backend returns new accessToken via cookie)
        await API.post('/auth/refresh-token');
        // After successful refresh, retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh also fails, logout or redirect to login page if needed
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
