import api from './api';

export const disputeService = {
  createDispute: (data) => api.post('/litiges', data),
  getAllDisputes: () => api.get('/litiges'),
  getDisputeById: (id) => api.get(`/litiges/${id}`),
  resolveDispute: (id, resolution) => api.patch(`/litiges/${id}/resolve`, resolution),
};
