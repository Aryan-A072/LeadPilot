import axios from '../lib/axios';

export const getLeads = async (params = {}) => {
  const response = await axios.get('/leads', { params });
  return response.data;
};

export const getLeadById = async (id) => {
  const response = await axios.get(`/leads/${id}`);
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await axios.post('/leads', leadData);
  return response.data;
};

export const updateLead = async (id, leadData) => {
  const response = await axios.patch(`/leads/${id}`, leadData);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await axios.delete(`/leads/${id}`);
  return response.data;
};

export const scoreLead = async (id, icp) => {
  const response = await axios.post(`/leads/${id}/score`, icp);
  return response.data;
};