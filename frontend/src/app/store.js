// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import productReviewsReducer from '../features/review/productReviewSlice';

export const store = configureStore({
  reducer: {
    productReviews: productReviewsReducer,
  },
});

export default store;