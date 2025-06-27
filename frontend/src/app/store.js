import { configureStore } from '@reduxjs/toolkit';
import reviewReducer from '../features/review/reviewSlice';

export const store = configureStore({
  reducer: {
    review: reviewReducer,
  },
});

export default store;
