import { Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products";
import ProductReviewList from "./pages/ProductReviewList";

function App() {
  return (
    <>
      <nav style={{ padding: "10px" }}>
        <Link to="/">Home</Link> | <Link to="/products">🏍️ Products</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h2>Welcome to Review Analyzer</h2>} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:productId" element={<ProductReviewList />} />
      </Routes>
    </>
  );
}

export default App;