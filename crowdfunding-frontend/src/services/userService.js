import api from './api';

export const userService = {
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userId, profile) => api.put(`/utilisateurs/${userId}`, profile),
  getUserById: (userId) => api.get(`/utilisateurs/${userId}`),
  updateUser: (userId, data) => api.put(`/utilisateurs/${userId}`, data),
};