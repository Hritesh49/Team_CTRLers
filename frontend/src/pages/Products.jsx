// src/pages/Products.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductReviewForm from '../components/ProductReviewForm';
import ProductReviewList from './ProductReviewList';

const ProductPage = () => {
  const { productId } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛒 Product Page: {productId}</h2>
      <ProductReviewForm productId={productId} />
      <hr />
      <ProductReviewList productId={productId} />
    </div>
  );
};

export default ProductPage;