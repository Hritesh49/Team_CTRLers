// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/Products';

function App() {
  return (
    <>
      <nav style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
        <Link to="/" style={{ marginRight: '10px' }}>🏠 Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:productId" element={<ProductPage />} />
      </Routes>
    </>
  );
}

export default App;
