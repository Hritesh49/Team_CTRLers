import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductReviewForm from '../components/ProductReviewForm';
import ProductReviewList from './ProductReviewList';
import axios from 'axios';
import { CircularProgress, Typography } from '@mui/material';

const ProductPage = () => {
  const { productId } = useParams();
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5000/products');
        const found = res.data.find((p) => p.id === productId);
        setProductName(found?.name || 'Unknown Product');
      } catch (err) {
        setProductName('Unknown Product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            🛒 Product Page: {productName}
          </Typography>
          <ProductReviewForm productId={productId} />
          <hr />
          <ProductReviewList productId={productId} />
        </>
      )}
    </div>
  );
};

export default ProductPage;
