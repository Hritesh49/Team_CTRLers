// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const dummyProducts = [
  { id: 'p001', name: 'Wireless Earbuds' },
  { id: 'p002', name: 'Smart Watch' },
  { id: 'p003', name: 'Bluetooth Speaker' },
];

const Home = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>🛍️ Product Catalog</h1>
    <ul>
      {dummyProducts.map((product) => (
        <li key={product.id}>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Home;