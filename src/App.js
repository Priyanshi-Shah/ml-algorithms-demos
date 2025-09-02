// src/App.js - Add KMeansPage
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/shared/Navigation';
import ScrollToTop from './components/shared/ScrollToTop';
import HomePage from './components/pages/HomePage';
import LinearRegressionPage from './components/pages/LinearRegressionPage';
import KMeansPage from './components/pages/KMeansPage';
import LogisticRegressionPage from './components/pages/LogisticRegressionPage';
import SVMPage from './components/pages/SVMPage';
import LossFunctionsPage from './components/pages/LossFunctionsPage';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <ScrollToTop />
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/linear-regression" element={<LinearRegressionPage />} />
          <Route path="/kmeans" element={<KMeansPage />} />
          <Route path="/logistic-regression" element={<LogisticRegressionPage />} />
          <Route path="/svm" element={<SVMPage />} />
          <Route path="/loss-functions" element={<LossFunctionsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;