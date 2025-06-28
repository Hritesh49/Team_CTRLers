import { configureStore } from '@reduxjs/toolkit';
import reviewReducer from '../features/review/reviewSlice';
import productReviewsReducer from '../features/review/productReviewSlice';

export const store = configureStore({
  reducer: {
    review: reviewReducer,
    productReviews: productReviewsReducer,
  },
});

export default store;
