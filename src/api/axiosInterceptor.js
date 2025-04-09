import axios from 'axios';

axios.interceptors.request.use(config => {
  const storedAuth = JSON.parse(localStorage.getItem('auth'));
  if (storedAuth?.token) {
    config.headers.Authorization = `Bearer ${storedAuth.token}`;
  }
  return config;
});
