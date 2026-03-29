import api from './api';
import { ENDPOINTS } from '../constants/api';

export const createPolicyMaster = async (policyData) => {
  const response = await api.post(`${ENDPOINTS.POLICY_MASTER}/`, policyData);
  return response.data;
};

export const listPolicies = async () => {
  const response = await api.get(`${ENDPOINTS.POLICY_MASTER}/`);
  return response.data;
};

export const purchasePolicy = async (purchaseData) => {
  const response = await api.post(`${ENDPOINTS.USER_POLICIES}/`, purchaseData);
  return response.data;
};

export const getUserPolicies = async (userId) => {
  const response = await api.get(`${ENDPOINTS.USER_POLICIES}/${userId}`);
  return response.data;
};
