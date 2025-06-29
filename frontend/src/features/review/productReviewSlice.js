import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReviewsByProductId, analyzeSingleReview } from '../../service/api';

export const fetchProductReviews = createAsyncThunk(
  'productReviews/fetch',
  async (productId, { rejectWithValue }) => {
    try {
      return await getReviewsByProductId(productId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productReviewSlice = createSlice({
  name: 'productReviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    appendNewReview: (state, action) => {
      state.reviews.unshift(action.payload); // Add to top
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { appendNewReview } = productReviewSlice.actions;
export default productReviewSlice.reducer;
