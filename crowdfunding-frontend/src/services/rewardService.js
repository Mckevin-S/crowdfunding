import api from './api';

export const rewardService = {
  getProjectRewards: (projectId) => api.get(`/rewards/projet/${projectId}`),
  createReward: (projectId, rewardData) => api.post('/rewards', { ...rewardData, projectId }),
  updateReward: (rewardId, data) => api.put(`/rewards/${rewardId}`, data),
  deleteReward: (rewardId) => api.delete(`/rewards/${rewardId}`),
  getRewardById: (rewardId) => api.get(`/rewards/${rewardId}`),
  listRewards: (params) => api.get('/rewards', { params }),
};
