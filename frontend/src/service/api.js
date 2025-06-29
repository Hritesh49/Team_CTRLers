// src/service/api.js
const BASE_URL = 'http://localhost:5000';

export const getReviewsByProductId = async (productId) => {
  const response = await fetch(`${BASE_URL}/reviews/${productId}`);
  if (!response.ok) throw new Error('Failed to fetch product reviews');
  return await response.json();
};

export const analyzeSingleReview = async ({ review, product_id }) => {
  const response = await fetch(`${BASE_URL}/analyze-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review, product_id }),
  });
  if (!response.ok) throw new Error('Failed to analyze review');
  return await response.json();
};