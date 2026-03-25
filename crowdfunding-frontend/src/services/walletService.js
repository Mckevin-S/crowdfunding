import api from './api';

export const walletService = {
  getWallet: (userId) => api.get(`/wallet/utilisateur/${userId}`),
  getBalance: () => api.get('/wallet/me'),
  addFunds: (amount, method) => api.post('/wallet/add-funds', { amount, method }),
  withdrawFunds: (amount) => api.post('/wallet/withdraw', { amount }),
  getTransactionHistory: () => api.get('/wallet/transactions'),
};
