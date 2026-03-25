import api from './api';

export const equityService = {
  getEquityProjects: (params) => api.get('/equity', { params }),
  getEquityById: (equityId) => api.get(`/equity/${equityId}`),
  createEquity: (equityData) => api.post('/equity', equityData),
  updateEquity: (equityId, data) => api.put(`/equity/${equityId}`, data),
};
