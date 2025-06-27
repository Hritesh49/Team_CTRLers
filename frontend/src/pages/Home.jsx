import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Welcome to Review Analyzer</h1>
    <nav>
      <Link to="/single-review">Single Review</Link> |{' '}
    </nav>
  </div>
);

export default Home;
