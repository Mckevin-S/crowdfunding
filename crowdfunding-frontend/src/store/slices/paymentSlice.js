import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentMethods: [],
    currentPayment: null,
  },
  reducers: {
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
  },
});

export const { setPaymentMethods, setCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;