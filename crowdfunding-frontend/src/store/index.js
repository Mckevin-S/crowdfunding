import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import messageReducer from './slices/messageSlice';
import contributionReducer from './slices/contributionSlice';
import paymentReducer from './slices/paymentSlice';
import userReducer from './slices/userSlice';
import kycReducer from './slices/kycSlice';
import uiReducer from './slices/uiSlice';
import apiErrorMiddleware from './middleware/apiErrorMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    contribution: contributionReducer,
    payment: paymentReducer,
    user: userReducer,
    kyc: kycReducer,
    ui: uiReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiErrorMiddleware),
});

// Types disponibles si vous migrez vers TypeScript :
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;