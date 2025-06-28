import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductReviews } from '../../service/api';

export const getProductReviews = createAsyncThunk(
  'productReviews/getProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      return await fetchProductReviews(productId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productReviewsSlice = createSlice({
  name: 'productReviews',
  initialState: {
    loading: false,
    reviews: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
        state.reviews = [];
        state.error = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productReviewsSlice.reducer;
