import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyzeSingleReview, analyzeBatchReviews } from '../../service/api';

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

export const fetchBatchReviewAnalysis = createAsyncThunk(
  'review/fetchBatchReviewAnalysis',
  async (reviews, { rejectWithValue }) => {
    try {
      const response = await analyzeBatchReviews(reviews);
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
    batchLoading: false,
    batchResult: null,
    batchError: null,
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
      .addCase(fetchBatchReviewAnalysis.pending, (state) => {
        state.batchLoading = true;
        state.batchResult = null;
        state.batchError = null;
      })
      .addCase(fetchBatchReviewAnalysis.fulfilled, (state, action) => {
        state.batchLoading = false;
        state.batchResult = action.payload;
      })
      .addCase(fetchBatchReviewAnalysis.rejected, (state, action) => {
        state.batchLoading = false;
        state.batchError = action.payload;
      })

  },
});

export const { clearResult } = reviewSlice.actions;
export default reviewSlice.reducer;
