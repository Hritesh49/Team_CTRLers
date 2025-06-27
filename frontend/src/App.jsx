import { Routes, Route, Link } from 'react-router-dom';
import SingleReview from './pages/SingleReview';

function App() {
  return (
    <>
      <nav>
        <Link to="/">Single Review</Link>
      </nav>

      <Routes>
        <Route path="/" element={<SingleReview />} />
      </Routes>
    </>
  );
}

export default App;
