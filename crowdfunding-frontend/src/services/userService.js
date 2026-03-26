import api from './api';

export const userService = {
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userId, profile) => api.put(`/utilisateurs/${userId}`, profile),
  getUserById: (userId) => api.get(`/utilisateurs/${userId}`),
  updateUser: (userId, data) => api.put(`/utilisateurs/${userId}`, data),
  
  // Admin Endpoints
  getAllUsers: () => api.get('/utilisateurs'),
  banUser: (userId) => api.put(`/utilisateurs/${userId}/ban`),
  activateUser: (userId) => api.put(`/utilisateurs/${userId}/activate`),
};