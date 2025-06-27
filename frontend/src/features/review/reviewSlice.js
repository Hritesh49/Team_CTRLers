import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyzeSingleReview } from '../../service/api';

export const fetchSingleReviewAnalysis = createAsyncThunk(
  'review/fetchSingleReviewAnalysis',
  async (reviewText, { rejectWithValue }) => {
    try {
      const response = await analyzeSingleReview(reviewText);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    loading: false,
    result: null,
    error: null,
  },

  reducers: {
    clearResult: (state) => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleReviewAnalysis.pending, (state) => {
        state.loading = true;
        state.result = null;
        state.error = null;
      })
      .addCase(fetchSingleReviewAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(fetchSingleReviewAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearResult } = reviewSlice.actions;
export default reviewSlice.reducer;
