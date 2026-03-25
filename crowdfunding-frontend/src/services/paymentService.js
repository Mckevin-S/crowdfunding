import api from './api';

export const paymentService = {
  processPayment: (paymentData) => api.post('/payments', paymentData),
};