import api from './api';

export const recommendationService = {
  getRecommendations: (params) => api.get('/recommendations', { params }),
  getRecommendationById: (recId) => api.get(`/recommendations/${recId}`),
  getRecommendationsForUser: () => api.get('/recommendations/user/me'),
};
