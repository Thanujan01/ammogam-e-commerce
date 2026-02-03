import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_BASE });

// Set token immediately if it exists in localStorage
const storedToken = localStorage.getItem('ammogam_token');
if (storedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

// Add interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;

      // Only clear auth if we're on a protected route and have a token
      // This prevents clearing auth on initial page load
      if (localStorage.getItem('ammogam_token') &&
        currentPath !== '/login' &&
        currentPath !== '/register' &&
        currentPath !== '/') {
        localStorage.removeItem('ammogam_token');
        localStorage.removeItem('ammogam_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('ammogam_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('ammogam_token');
  }
}
