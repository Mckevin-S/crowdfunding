import api from './api';

const ContributionService = {
  initiate: async (data) => {
    const response = await api.post('/contributions/initiate', data);
    return response.data;
  },
  
  confirm: async (id) => {
    const response = await api.post(`/contributions/${id}/confirm`);
    return response.data;
  },

  getStats: async (projectId) => {
    const response = await api.get(`/contributions/projet/${projectId}/total`);
    return response.data;
  },

  getUserContributions: (userId) => api.get(`/contributions/utilisateur/${userId}`),
};

export default ContributionService;