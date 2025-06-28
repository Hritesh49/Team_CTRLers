const BASE_URL = 'http://localhost:5000';

export const analyzeSingleReview = async (reviewText, productId) => {
  const response = await fetch(`${BASE_URL}/analyze-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review: reviewText, product_id: productId }),
  });
  if (!response.ok) throw new Error('Failed to analyze review');
  return await response.json();
};

export const fetchProductReviews = async (productId) => {
  const res = await fetch(`${BASE_URL}/reviews/${productId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return await res.json();
};