import api from './api';

export const loanService = {
  getLoans: (params) => api.get('/loans', { params }),
  getLoanById: (loanId) => api.get(`/loans/${loanId}`),
  createLoan: (loanData) => api.post('/loans', loanData),
  updateLoan: (loanId, data) => api.put(`/loans/${loanId}`, data),
};
