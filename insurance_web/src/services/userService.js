import api from './api';
import { ENDPOINTS } from '../constants/api';

export const createUser = async (userData) => {
  const response = await api.post(`${ENDPOINTS.USERS}/`, userData);
  return response.data;
};
