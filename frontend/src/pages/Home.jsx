import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Paper, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddProductForm from '../components/AddProductForm';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // 👈 toggle form

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/products');
      setProducts(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      toast.success('🗑️ Product deleted!');
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      toast.error('❌ Deletion failed.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🛍️ Product Catalog</h1>

      <Button
        variant="contained"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '20px' }}
      >
        {showForm ? 'Close Form' : '➕ Add Product'}
      </Button>

      {showForm && (
        <AddProductForm
          onProductAdded={() => {
            fetchProducts();
            setShowForm(false); // auto-close after submission
          }}
        />
      )}

      {loading ? (
        <CircularProgress />
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {products.map((product) => (
            <Paper
              key={product.id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: '#f5f5f5',
              }}
            >
              <Link
                to={`/products/${product.id}`}
                style={{ textDecoration: 'none', color: '#333' }}
              >
                <strong>{product.name}</strong> — ₹{product.price}
              </Link>

              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(product.id)}
                style={{ float: 'right', marginTop: '5px' }}
              >
                Delete
              </Button>
            </Paper>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
