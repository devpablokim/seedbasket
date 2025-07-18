import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/seedbasket-342ca/us-central1/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const { auth } = await import('../config/firebase');
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to get a fresh token
        const { auth } = await import('../config/firebase');
        const user = auth.currentUser;
        
        if (user) {
          const newToken = await user.getIdToken(true);
          
          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Redirect to login if token refresh fails
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;