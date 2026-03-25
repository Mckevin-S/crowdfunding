import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contributionService from '../../services/contributionService';

export const fetchUserContributions = createAsyncThunk(
  'contribution/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await contributionService.getUserContributions(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur lors de la récupération des contributions');
    }
  }
);

const contributionSlice = createSlice({
  name: 'contribution',
  initialState: {
    contributions: [],
    loading: false,
    error: null,
  },
  reducers: {
    setContributions: (state, action) => {
      state.contributions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserContributions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserContributions.fulfilled, (state, action) => {
        state.loading = false;
        state.contributions = action.payload;
      })
      .addCase(fetchUserContributions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setContributions } = contributionSlice.actions;
export default contributionSlice.reducer;