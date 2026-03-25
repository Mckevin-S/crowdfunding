import api from './api';

export const kycService = {
  submitKyc: (kycData) => api.post('/kyc', kycData),
  getKycStatus: () => api.get('/kyc/status'),
};