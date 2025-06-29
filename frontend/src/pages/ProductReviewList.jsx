import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductReviews } from '../features/review/productReviewSlice';
import { formatDistanceToNowStrict } from 'date-fns';

const ProductReviewList = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.productReviews);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    dispatch(fetchProductReviews(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const convertUTCToLocal = (utcString) => {
    const utcDate = new Date(utcString);
    const offsetMs = utcDate.getTimezoneOffset() * 60 * 1000;
    return new Date(utcDate.getTime() - offsetMs);
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      {loading && <p>Loading reviews...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul>
        {reviews.map((r, index) => {
          const localDate = convertUTCToLocal(r.timestamp);
          const relativeTime = formatDistanceToNowStrict(localDate, { addSuffix: true });

          return (
            <li key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
              <p>📝 {r.original_review}</p>
              <p>🧠 Sentiment: {r.sentiment.label}</p>
              <p>😊 Emotion: {r.emotion.label}</p>
              <p>📌 Aspects:</p>
              <ul>
                {Object.entries(r.aspect_sentiments).map(([aspect, data], i) =>
                  data.label ? (
                    <li key={i}><strong>{aspect}</strong>: {data.label}</li>
                  ) : null
                )}
              </ul>
              <p>🕒 {relativeTime}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductReviewList;
