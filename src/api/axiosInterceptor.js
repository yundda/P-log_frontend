import axios from 'axios';

const API = process.env.REACT_APP_API_SERVER;

const instance = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  config => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { token } = JSON.parse(storedAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default instance;
