import api from './api';

export const paymentService = {
  createPaymentIntent: (paymentData) => api.post('/stripe/create-intent', paymentData),
  confirmPayment: (paymentIntentId) => api.post(`/stripe/confirm/${paymentIntentId}`),
  getPaymentHistory: (userId) => api.get(`/transactions/utilisateur/${userId}`),
  verifyPayment: (paymentIntentId) => api.get(`/stripe/verify/${paymentIntentId}`),
};