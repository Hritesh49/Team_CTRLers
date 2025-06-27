import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBatchReviewAnalysis,
  clearResult,
} from '../features/review/reviewSlice';

const BatchReviewForm = () => {
  const [batchText, setBatchText] = useState('');
  const dispatch = useDispatch();
  const { batchLoading, batchResult, batchError } = useSelector((state) => state.review);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviews = batchText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (reviews.length === 0) return;
    dispatch(fetchBatchReviewAnalysis(reviews));
  };

  const handleClear = () => {
    setBatchText('');
    dispatch(clearResult());
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="10"
          value={batchText}
          onChange={(e) => setBatchText(e.target.value)}
          placeholder="Paste one review per line..."
        />
        <br />
        <button type="submit" disabled={batchLoading}>
          {batchLoading ? 'Analyzing Batch...' : 'Analyze Batch'}
        </button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </form>

      {batchResult && (
        <div>
          <h3>Batch Analysis Result:</h3>
          <pre>{JSON.stringify(batchResult, null, 2)}</pre>
        </div>
      )}

      {batchError && (
        <div style={{ color: 'red' }}>
          <p>Error: {batchError}</p>
        </div>
      )}
    </div>
  );
};

export default BatchReviewForm;
