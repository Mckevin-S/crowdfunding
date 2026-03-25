import { createSlice } from '@reduxjs/toolkit';

const kycSlice = createSlice({
  name: 'kyc',
  initialState: {
    status: 'PENDING',
    documents: [],
  },
  reducers: {
    setKycStatus: (state, action) => {
      state.status = action.payload;
    },
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
  },
});

export const { setKycStatus, setDocuments } = kycSlice.actions;
export default kycSlice.reducer;