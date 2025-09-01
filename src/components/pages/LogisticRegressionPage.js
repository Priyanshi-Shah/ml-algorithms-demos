import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogisticRegression from '../algorithms/LogisticRegression/LogisticRegression';

function LogisticRegressionPage() {
  const [activeType, setActiveType] = useState('binary');

  const regressionTypes = [
    {
      id: 'binary',
      title: 'Binary Logistic Regression',
      description: 'Classic binary classification with sigmoid function',
      difficulty: 'Intermediate',
      status: 'ready'
    },
    {
      id: 'multinomial',
      title: 'Multinomial Logistic Regression',
      description: 'Multi-class classification with softmax function',
      difficulty: 'Advanced',
      status: 'coming-soon'
    },
    {
      id: 'ordinal',
      title: 'Ordinal Logistic Regression',
      description: 'Ordered categorical outcomes with proportional odds',
      difficulty: 'Advanced',
      status: 'coming-soon'
    },
    {
      id: 'regularized',
      title: 'Regularized Logistic Regression',
      description: 'L1/L2 regularization to prevent overfitting',
      difficulty: 'Advanced',
      status: 'coming-soon'
    }
  ];

  const activeComponent = regressionTypes.find(type => type.id === activeType);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Home
        </Link>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-green-100 rounded-xl">
            <span className="text-green-600 text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Logistic Regression</h1>
            <p className="text-gray-600">Explore different types of logistic regression for classification</p>
          </div>
        </div>
      </div>

      {/* Type Selection Tabs */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {regressionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                disabled={type.status === 'coming-soon'}
                className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeType === type.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : type.status === 'coming-soon'
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{type.title}</div>
                  <div className="text-xs opacity-75">{type.description}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    type.difficulty === 'Beginner' 
                      ? 'bg-green-100 text-green-700'
                      : type.difficulty === 'Intermediate'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {type.difficulty}
                  </span>
                  {type.status === 'ready' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      READY
                    </span>
                  )}
                  {type.status === 'coming-soon' && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      SOON
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Component */}
      <div className="bg-white rounded-xl shadow-sm border">
        {activeComponent.status === 'ready' ? (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {activeComponent.title}
              </h2>
              <p className="text-gray-600">{activeComponent.description}</p>
            </div>
            <LogisticRegression />
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="mb-6">
              <div className="p-4 bg-yellow-100 rounded-full inline-block">
                <span className="text-4xl">🚧</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeComponent.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeComponent.description}
            </p>
            <p className="text-yellow-600 font-medium">
              🚧 This algorithm demo is coming soon! 
            </p>
            <p className="text-gray-500 text-sm mt-2">
              For now, try the Binary Logistic Regression demo above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogisticRegressionPage;