import api from './api';

export const userService = {
  getProfile: () => api.get('/utilisateurs/me'),
  updateProfile: (profile) => api.put('/utilisateurs/me', profile),
  getUserById: (userId) => api.get(`/utilisateurs/${userId}`),
  updateUser: (userId, data) => api.put(`/utilisateurs/${userId}`, data),
};