import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profile) => api.put('/users/profile', profile),
};