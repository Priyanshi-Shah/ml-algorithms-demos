// src/App.js - Add LinearRegressionPage
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/shared/Navigation';
import HomePage from './components/pages/HomePage';
import LinearRegressionPage from './components/pages/LinearRegressionPage';  // Add this line

// Keep KMeans placeholder for now
function KMeansDemo() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">K-Means Clustering</h1>
      <p>K-means demo will go here...</p>
      <a href="#/" className="text-blue-500">← Back to Home</a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/linear-regression" element={<LinearRegressionPage />} />  {/* Updated this line */}
          <Route path="/kmeans" element={<KMeansDemo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;