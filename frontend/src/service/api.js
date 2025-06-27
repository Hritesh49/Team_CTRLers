// src/service/api.js
const BASE_URL = 'http://localhost:5000';  // Or 127.0.0.1:5000

export const analyzeSingleReview = async (reviewText) => {
  const response = await fetch(`${BASE_URL}/analyze-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review: reviewText }),
  });
  if (!response.ok) throw new Error('Failed to analyze review');
  return await response.json();
};