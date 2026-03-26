import api from './api';

export const contributionService = {
  /**
   * List all contributions for the current user.
   */
  getUserContributions: (userId) => api.get(`/contributions/utilisateur/${userId}`),

  /**
   * List contributions for a specific project.
   */
  getProjectContributions: (projetId) => api.get(`/contributions/projet/${projetId}`),

  /**
   * Initiate a contribution (payment intent).
   */
  initiateContribution: (data) => api.post('/contributions/initiate', data),

  /**
   * Confirm a payment (Simulation mode).
   */
  confirmContribution: (contributionId) => api.post(`/contributions/${contributionId}/confirm`),

  /**
   * Get total amount for a project.
   */
  getTotalForProject: (projetId) => api.get(`/contributions/projet/${projetId}/total`)
};

export default contributionService;