import api from './api';
import { ENDPOINTS } from '../constants/api';

export const uploadDocument = async (documentData) => {
  const response = await api.post(`${ENDPOINTS.DOCUMENTS}/`, documentData);
  return response.data;
};

export const getDocumentsByClaim = async (claimId) => {
  const response = await api.get(`${ENDPOINTS.DOCUMENTS}/claim/${claimId}`);
  return response.data;
};
