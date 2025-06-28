import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews } from '../features/review/productReviewSlice';
import { useParams } from 'react-router-dom';
import { analyzeSingleReview } from '../service/api';

const ProductReviewList = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { loading, reviews, error } = useSelector((state) => state.productReviews);

  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState([]);

  useEffect(() => {
    dispatch(getProductReviews(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    setSubmitting(true);
    try {
      const result = await analyzeSingleReview(newReview, productId);
      setLocalReviews((prev) => [result, ...prev]);
      setNewReview('');
    } catch (err) {
      console.error('❌ Review analyze failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📝 Reviews for Product: {productId}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          rows="4"
          placeholder="Write your review here..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          style={styles.textarea}
        />
        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? 'Analyzing...' : 'Submit Review'}
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul style={styles.reviewList}>
        {localReviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          localReviews.map((r, index) => (
            <li key={index} style={styles.reviewCard}>
              <p><strong>📝 Review:</strong> {r.original_review || r.review}</p>
              <p><strong>🧠 Sentiment:</strong> {r.sentiment?.label || r.sentiment}</p>
              <p><strong>😊 Emotion:</strong> {r.emotion?.label || r.emotion}</p>
              <p><strong>📌 Aspects:</strong></p>
              <ul>
                {r.aspect_sentiments &&
                  Object.entries(r.aspect_sentiments).map(([asp, val]) => (
                    val?.label && (
                      <li key={asp}>
                        <strong>{asp}</strong>: {val.label} ({val.score})
                      </li>
                    )
                  ))}
              </ul>
              <p>🕒 {new Date(r.timestamp).toLocaleString()}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'sans-serif',
  },
  form: {
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  reviewList: {
    listStyleType: 'none',
    padding: 0,
  },
  reviewCard: {
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '10px',
    backgroundColor: '#f0f8ff',
    border: '1px solid #ddd',
  },
};

export default ProductReviewList;
