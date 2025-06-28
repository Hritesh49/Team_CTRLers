import React from "react";
import { Link } from "react-router-dom";

const dummyProducts = [
  { id: "p001", name: "Wireless Headphones" },
  { id: "p002", name: "Smartphone X200" },
  { id: "p003", name: "Coffee Maker Pro" },
];

const Products = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>🛍️ Our Products</h2>
      <ul>
        {dummyProducts.map((product) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
