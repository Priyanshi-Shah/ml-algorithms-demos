// src/components/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const algorithms = [
    {
      id: 'linear-regression',
      title: 'Linear Regression',
      description: 'Learn how to find the best-fit line through data points. Interactive visualization of slope, intercept, and R² correlation.',
      path: '/linear-regression',
      color: 'from-blue-500 to-blue-600',
      features: [
        'Interactive data point manipulation',
        'Real-time equation updates',
        'Multiple regression types',
        'Statistical analysis'
      ],
      difficulty: 'Beginner',
      status: 'ready'
    },
    {
      id: 'kmeans',
      title: 'K-Means Clustering',
      description: 'Discover how unsupervised learning groups similar data points. Watch centroids move and clusters form in real-time.',
      path: '/kmeans',
      color: 'from-purple-500 to-purple-600',
      features: [
        'Animated clustering process',
        'Adjustable K parameter',
        'Multiple data patterns',
        'Convergence visualization'
      ],
      difficulty: 'Intermediate',
      status: 'ready'
    },
    {
      id: 'logistic-regression',
      title: 'Logistic Regression',
      description: 'Master binary classification with sigmoid curves. See how probabilities map to decisions in real-time.',
      path: '/logistic-regression',
      color: 'from-green-500 to-green-600',
      features: [
        'Sigmoid curve visualization',
        'Binary classification',
        'Probability estimation',
        'Maximum likelihood learning'
      ],
      difficulty: 'Intermediate',
      status: 'ready'
    },
    {
      id: 'svm',
      title: 'Support Vector Machine',
      description: 'Explore optimal decision boundaries and margin maximization. Understand kernels and support vectors.',
      path: '/svm',
      color: 'from-red-500 to-red-600',
      features: [
        'Hyperplane visualization',
        'Support vector identification',
        'Kernel trick demonstration',
        'Margin maximization'
      ],
      difficulty: 'Advanced',
      status: 'ready'
    }
  ];

  const upcomingAlgorithms = [
    { title: 'K-Nearest Neighbors', status: 'coming-soon' },
    { title: 'Decision Trees', status: 'coming-soon' },
    { title: 'Random Forest', status: 'coming-soon' },
    { title: 'Neural Networks', status: 'coming-soon' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Interactive ML Algorithms
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Learn machine learning through interactive visualizations. Watch algorithms work step-by-step, 
          adjust parameters, and understand the math behind the magic.
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>▶️</span>
            <span>Interactive Demos</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📚</span>
            <span>Learn by Doing</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⚡</span>
            <span>Real-time Updates</span>
          </div>
        </div>
      </div>

      {/* Main Algorithms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 mb-16">
        {algorithms.map((algorithm) => (
          <Link
            key={algorithm.id}
            to={algorithm.path}
            className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${algorithm.color} text-white group-hover:scale-110 transition-transform`}>
                  <div className="w-8 h-8 flex items-center justify-center text-2xl">
                    {algorithm.id === 'linear-regression' ? '📈' : 
                     algorithm.id === 'kmeans' ? '🎯' : 
                     algorithm.id === 'logistic-regression' ? '📊' : '🎯'}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    algorithm.difficulty === 'Beginner' 
                      ? 'bg-green-100 text-green-800' 
                      : algorithm.difficulty === 'Intermediate'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {algorithm.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {algorithm.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {algorithm.description}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {algorithm.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-semibold group-hover:text-blue-700">
                  Try Interactive Demo
                </span>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gray-100 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">More algorithms being developed for interactive learning</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {upcomingAlgorithms.map((algorithm, index) => (
            <div key={index} className="bg-white rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-700 mb-2">{algorithm.title}</h4>
              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t">
        <p className="text-gray-500">
          Built with React, Recharts, and modern web technologies • 
          <span className="text-blue-600 hover:text-blue-700 ml-1 cursor-pointer">View on GitHub</span>
        </p>
      </div>
    </div>
  );
}

export default HomePage;