// src/components/ProductReviewForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { analyzeSingleReview } from '../service/api';
import { appendNewReview, fetchProductReviews } from '../features/review/productReviewSlice';

const ProductReviewForm = () => {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { productId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeSingleReview({ review, product_id: productId });
      dispatch(appendNewReview(result));
      setReview('');
      setTimeout(() => {
        dispatch(fetchProductReviews(productId));
      }, 3000);
    } catch (err) {
      console.error('❌ Review submission failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <textarea
        rows="4"
        placeholder="Write a review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
      />
      <br />
      <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ProductReviewForm;
