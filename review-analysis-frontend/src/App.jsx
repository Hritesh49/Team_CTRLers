import { Routes, Route, Link } from 'react-router-dom';
import SingleReview from './pages/SingleReview';
import BatchReview from './pages/BatchReview';

function App() {
  return (
    <>
      <nav>
        <Link to="/">Single Review</Link> | <Link to="/batch">Batch Review</Link>
      </nav>

      <Routes>
        <Route path="/" element={<SingleReview />} />
        <Route path="/batch" element={<BatchReview />} />
      </Routes>
    </>
  );
}

export default App;
