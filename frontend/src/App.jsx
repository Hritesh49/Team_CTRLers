//src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/Products';
import AddProductForm from './components/AddProductForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <nav style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
        <Link to="/" style={{ marginRight: '10px' }}>🏠 Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/add-product" element={<AddProductForm />} />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;