import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../configs/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Automatically send cookies with every request
});

// Add an interceptor to automatically refresh the token when the accessToken expires
// API.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;
    
//     // Don't retry for refresh-token requests to avoid infinite loops
//     if (
//       error.response?.status === 401 && 
//       !originalRequest._retry &&
//       !originalRequest.url?.includes('/auth/refresh-token')
//     ) {
//       originalRequest._retry = true;
//       try {
//         // Call the refresh token API with platform parameter
//         await API.post('/auth/refresh-token', { platform: 'web' });
//         // After successful refresh, retry the original request
//         return API(originalRequest);
//       } catch (refreshError) {
//         // If refresh also fails, redirect to login page
//         console.error('Token refresh failed:', refreshError);
//         // Có thể dispatch logout action hoặc redirect tới login
//         // window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default API;
