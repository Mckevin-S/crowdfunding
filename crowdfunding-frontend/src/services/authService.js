import api from './api';

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  googleLogin: (idToken, role) => api.post('/auth/google', { idToken, role }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyCode: (email, code) => api.post('/auth/verify-code', { email, code }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

export default authService;