import api from './api';

export const kycService = {
  submitKyc: (kycData) => api.post('/kyc-documents', kycData),
  getKycStatus: () => api.get('/kyc-documents/status'),
  getKycDocuments: (userId) => api.get(`/kyc-documents/utilisateur/${userId}`),
  updateKycStatus: (docId, status, reason) => api.patch(`/kyc-documents/${docId}/status`, null, { params: { status, reason } }),
  getAllKyc: () => api.get('/kyc-documents'),
};