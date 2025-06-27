import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSingleReviewAnalysis,
  clearResult,
} from '../features/review/reviewSlice';

const SingleReviewForm = () => {
  const [review, setReview] = useState('');
  const dispatch = useDispatch();
  const { loading, result, error } = useSelector((state) => state.review);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (review.trim() === '') return;
    dispatch(fetchSingleReviewAnalysis(review));
  };

  const handleClear = () => {
    setReview('');
    dispatch(clearResult());
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Enter your review here..."
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        <button type="button" disabled={loading} onClick={handleClear}>
          Clear
        </button>
      </form>

      {result && (
        <div>
          <h3>Analysis Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default SingleReviewForm;
