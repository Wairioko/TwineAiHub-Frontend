import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => response,
  async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
              // Call the backend to refresh the token
              await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
              
              // Retry the original request
              return api(originalRequest);
          } catch (refreshError) {
              console.error('Refresh token expired or invalid:', refreshError);
              // Redirect to login page or handle logout
              window.location.href = '/login';
          }
      }
      return Promise.reject(error);
  }
);



export default api;
