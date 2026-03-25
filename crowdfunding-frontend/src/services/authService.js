import api from './api';

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  googleLogin: (idToken) => api.post('/auth/google', idToken, {
    headers: { 'Content-Type': 'text/plain' }
  }),
};

export default authService;