import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const TOKEN_KEY = 'insurance_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.success === false) {
      const error = new Error(data.error?.message || 'Something went wrong');
      error.code = data.error?.code;
      return Promise.reject(error);
    }
    return data;
  },
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem('insurance_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.detail?.error?.message ||
      error.response?.data?.error?.message ||
      error.response?.data?.detail ||
      error.message ||
      'Network error. Please try again.';
    const wrapped = new Error(typeof message === 'string' ? message : 'Request failed');
    wrapped.code = error.response?.data?.error?.code;
    wrapped.status = error.response?.status;
    return Promise.reject(wrapped);
  }
);

export default api;
