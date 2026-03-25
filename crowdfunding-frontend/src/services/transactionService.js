import api from './api';

export const transactionService = {
  getTransactions: (params) => api.get('/transactions', { params }),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  getUserTransactions: (userId) => api.get(`/transactions/utilisateur/${userId}`),
};
