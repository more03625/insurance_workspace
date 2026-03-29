import api from './api';
import { ENDPOINTS } from '../constants/api';

export const uploadDocument = async (documentData) => {
  const response = await api.post(`${ENDPOINTS.DOCUMENTS}/`, documentData);
  return response.data;
};
