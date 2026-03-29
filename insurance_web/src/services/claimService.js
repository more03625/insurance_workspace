import api from './api';
import { ENDPOINTS } from '../constants/api';

export const createClaim = async (claimData) => {
  const response = await api.post(`${ENDPOINTS.CLAIMS}/`, claimData);
  return response.data;
};

export const listClaims = async (offset = 0, limit = 100) => {
  const response = await api.get(`${ENDPOINTS.CLAIMS}/`, {
    params: { offset, limit },
  });
  return response.data;
};

export const verifyClaim = async (claimId, employeeId, status) => {
  const response = await api.post(`${ENDPOINTS.CLAIMS}/${claimId}/verify`, {
    employee_id: employeeId,
    status,
  });
  return response.data;
};
