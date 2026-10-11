import axios from '../lib/axios';

export const generateOutreach = async (leadId) => {
  const response = await axios.post(`/leads/${leadId}/outreach`);
  return response.data;
};

export const getOutreachDrafts = async (leadId) => {
  const response = await axios.get(`/leads/${leadId}/outreach`);
  return response.data;
};