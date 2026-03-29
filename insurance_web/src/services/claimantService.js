import api from './api';
import { ENDPOINTS } from '../constants/api';

export const createClaimant = async (claimantData) => {
  const response = await api.post(`${ENDPOINTS.CLAIMANTS}/`, claimantData);
  return response.data;
};
