import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
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
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.detail ||
      error.message ||
      'Network error. Please try again.';
    const wrapped = new Error(message);
    wrapped.code = error.response?.data?.error?.code;
    wrapped.status = error.response?.status;
    return Promise.reject(wrapped);
  }
);

export default api;
