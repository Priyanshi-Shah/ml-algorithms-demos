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
    },
    {
      id: 'naive-bayes',
      title: 'Naive Bayes Classifier',
      description: 'Experience probabilistic classification with Bayes\' theorem. Interactive spam detection with step-by-step calculations.',
      path: '/naive-bayes',
      color: 'from-purple-500 to-indigo-600',
      features: [
        'Text classification demo',
        'Probability visualization',
        'Bayes theorem breakdown',
        'Laplace smoothing control'
      ],
      difficulty: 'Intermediate',
      status: 'ready'
    }
  ];

  const upcomingAlgorithms = [
    { title: 'K-Nearest Neighbors', status: 'coming-soon' },
    { title: 'Decision Trees', status: 'coming-soon' },
    { title: 'Random Forest', status: 'coming-soon' },
    { title: 'Neural Networks', status: 'coming-soon' }
  ];

  const essentialConcepts = [
    {
      id: 'loss-functions',
      title: 'Loss Functions',
      description: 'Understand how algorithms measure and minimize errors. Explore different loss functions for various ML problems.',
      path: '/loss-functions',
      color: 'from-emerald-500 to-teal-600',
      features: [
        'Interactive loss function visualization',
        'Comparison of different loss types',
        'Real-time error calculation',
        'Gradient descent visualization'
      ],
      difficulty: 'Intermediate',
      status: 'ready'
    },
    {
      id: 'gradient-descent',
      title: 'Gradient Descent',
      description: 'Master the optimization algorithm that powers most machine learning. See how it finds optimal parameters.',
      path: '/gradient-descent',
      color: 'from-orange-500 to-red-600',
      features: [
        'Step-by-step optimization',
        'Learning rate effects',
        'Local vs global minima',
        'Different variants comparison'
      ],
      difficulty: 'Intermediate',
      status: 'coming-soon'
    },
    {
      id: 'bias-variance',
      title: 'Bias-Variance Tradeoff',
      description: 'Understand the fundamental tradeoff in machine learning. Balance between underfitting and overfitting.',
      path: '/bias-variance',
      color: 'from-violet-500 to-purple-600',
      features: [
        'Interactive bias-variance decomposition',
        'Model complexity effects',
        'Overfitting visualization',
        'Cross-validation insights'
      ],
      difficulty: 'Advanced',
      status: 'coming-soon'
    },
    {
      id: 'regularization',
      title: 'Regularization Techniques',
      description: 'Learn how to prevent overfitting with L1, L2, and other regularization methods.',
      path: '/regularization',
      color: 'from-pink-500 to-rose-600',
      features: [
        'L1 vs L2 regularization',
        'Ridge and Lasso regression',
        'Regularization strength effects',
        'Feature selection visualization'
      ],
      difficulty: 'Advanced',
      status: 'coming-soon'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Tech Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-4">
            {/* Main Heading with Tech Styling */}
            <div className="mb-8">
              <div className="inline-block px-4 py-2 mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-black font-mono text-sm font-semibold">
                <span className="mr-2">🤖</span>AI with Pri
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent leading-tight">
                Interactive ML
                <br />
                <span className="flex items-center justify-center gap-4">
                  Algorithms
                  <span className="text-5xl">👩‍💻</span>
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed px-4">
                  Master machine learning through <span className="text-cyan-400 font-semibold">interactive visualizations</span>. 
                  Watch algorithms work step-by-step, adjust parameters in real-time, and decode the math behind AI.
                </p>
              </div>
            </div>
            
            {/* Tech Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-cyan-400 font-bold mb-2">Real-time Execution</h3>
                <p className="text-gray-400 text-sm">Watch algorithms execute live with instant parameter updates</p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="text-blue-400 font-bold mb-2">Interactive Learning</h3>
                <p className="text-gray-400 text-sm">Click, drag, and manipulate data to understand concepts deeply</p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-500/40 transition-all duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-indigo-400 font-bold mb-2">Visual Mathematics</h3>
                <p className="text-gray-400 text-sm">See equations come alive with dynamic visualizations</p>
              </div>
            </div>
            
            {/* Enhanced Social Media Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
              <a 
                href="https://www.instagram.com/ai_with_pri?igsh=MTl2MG5wYzBreDdicA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-4 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span className="text-2xl">📱</span>
                <span>ML Series on Instagram</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/priyanshishah-184/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 px-8 py-4 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                <span className="text-2xl">💼</span>
                <span>Connect on LinkedIn</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithms Section */}
      <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your Algorithm</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Dive into interactive machine learning algorithms. Each demo includes real-time visualizations, 
              parameter controls, and comprehensive explanations.
            </p>
          </div>

          {/* Main Algorithms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {algorithms.map((algorithm) => (
              <Link
                key={algorithm.id}
                to={algorithm.path}
                className="group block bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200 overflow-hidden"
              >
                <div className="p-6 sm:p-8">
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

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {algorithm.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {algorithm.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {algorithm.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

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

        {/* Essential ML Concepts Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Essential ML Concepts</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Master the fundamental concepts that every ML practitioner should know. 
              Interactive explanations of core principles and techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {essentialConcepts.map((concept) => {
              const isReady = concept.status === 'ready';
              const Component = isReady ? Link : 'div';
              const props = isReady 
                ? {
                    to: concept.path,
                    className: "group block bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200 overflow-hidden cursor-pointer"
                  }
                : {
                    className: "group block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-default opacity-75"
                  };
              
              return (
                <Component key={concept.id} {...props}>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${concept.color} text-white ${isReady ? 'group-hover:scale-110' : ''} transition-transform`}>
                      <div className="w-8 h-8 flex items-center justify-center text-2xl">
                        {concept.id === 'loss-functions' ? '📉' : 
                         concept.id === 'gradient-descent' ? '⚡' : 
                         concept.id === 'bias-variance' ? '⚖️' : '🎯'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        concept.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : concept.difficulty === 'Intermediate'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {concept.difficulty}
                      </span>
                      {concept.status === 'ready' && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          READY
                        </span>
                      )}
                      {concept.status === 'coming-soon' && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                          SOON
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className={`text-2xl font-bold text-gray-900 mb-3 ${isReady ? 'group-hover:text-blue-600' : ''} transition-colors`}>
                    {concept.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {concept.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {concept.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isReady ? 'text-blue-600 group-hover:text-blue-700' : 'text-gray-500'}`}>
                      {concept.status === 'ready' ? 'Explore Concept' : 'Coming Soon'}
                    </span>
                    <span className={`${isReady ? 'text-blue-600 group-hover:translate-x-1' : 'text-gray-400'} transition-transform`}>
                      →
                    </span>
                  </div>
                </div>
              </Component>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gray-100 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">More Algorithms Coming Soon</h2>
            <p className="text-gray-600">Additional algorithms being developed for interactive learning</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
    </div>
  </div>
  );
}

export default HomePage;