// src/components/AddProductForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/products', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
      });
      toast.success('✅ Product added successfully!');
      setFormData({ name: '', description: '', price: '' });
      onProductAdded(); // Refresh product list
    } catch (error) {
      const msg = error.response?.data?.error || 'Something went wrong';
      toast.error('❌ Failed to add product: ' + msg);
    }
  };

  return (
    <Paper style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button variant="contained" type="submit" color="primary" style={{ marginTop: 20 }}>
          Add Product
        </Button>
      </form>
    </Paper>
  );
};

export default AddProductForm;
