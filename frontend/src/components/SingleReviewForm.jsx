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

  const renderResult = () => {
    if (!result) return null;

    const {
      original_review,
      sentiment,
      emotion,
      aspect_sentiments
    } = result;

    return (
      <div style={styles.resultBox}>
        <h3>🔍 Review Summary</h3>
        <p><strong>📝 Review:</strong> {original_review}</p>
        <p><strong>😊 Emotion:</strong> {emotion?.label}</p>
        <p><strong>🧠 Sentiment:</strong> {sentiment?.label}</p>
        <div>
          <strong>📌 Aspects Mentioned:</strong>
          <ul>
            {aspect_sentiments && Object.keys(aspect_sentiments).length > 0 ? (
              Object.entries(aspect_sentiments).map(([aspect, data], idx) => (
                <li key={idx}>
                  <span style={styles.aspectLabel}>{aspect}</span> — <em>{data.label}</em>
                </li>
              ))
            ) : (
              <li>No aspects identified in the review.</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Enter your review here..."
          style={styles.textarea}
        />
        <br />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={handleClear}
          style={{ ...styles.button, backgroundColor: '#aaa' }}
        >
          Clear
        </button>
      </form>

      {renderResult()}

      {error && (
        <div style={styles.error}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fdfdfd',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    margin: '10px 5px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  resultBox: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f0f8ff',
  },
  aspectLabel: {
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default SingleReviewForm;
