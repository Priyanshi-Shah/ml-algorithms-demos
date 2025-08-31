// src/components/pages/KMeansPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StandardKMeans from '../algorithms/KMeans/StandardKMeans';

function KMeansPage() {
  const [activeType, setActiveType] = useState('standard');

  const clusteringTypes = [
    {
      id: 'standard',
      title: 'Standard K-Means',
      description: 'Classic K-means clustering with random centroid initialization',
      difficulty: 'Beginner',
      status: 'ready'
    },
    {
      id: 'kmeans-plus-plus',
      title: 'K-Means++',
      description: 'Improved initialization method for better clustering results',
      difficulty: 'Intermediate',
      status: 'coming-soon'
    },
    {
      id: 'mini-batch',
      title: 'Mini-Batch K-Means',
      description: 'Faster K-means using random samples for large datasets',
      difficulty: 'Intermediate',
      status: 'coming-soon'
    },
    {
      id: 'fuzzy',
      title: 'Fuzzy K-Means',
      description: 'Soft clustering where points can belong to multiple clusters',
      difficulty: 'Advanced',
      status: 'coming-soon'
    }
  ];

  const activeComponent = clusteringTypes.find(type => type.id === activeType);

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
          <div className="p-3 bg-purple-100 rounded-xl">
            <span className="text-purple-600 text-2xl">🎯</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">K-Means Clustering</h1>
            <p className="text-gray-600">Explore different variations of K-means clustering algorithms</p>
          </div>
        </div>
      </div>

      {/* Type Selection Tabs */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {clusteringTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                disabled={type.status === 'coming-soon'}
                className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeType === type.id
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
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
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
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
            <StandardKMeans />
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
              This clustering variation is coming soon! 
            </p>
            <p className="text-gray-500 text-sm mt-2">
              For now, try the Standard K-Means demo above.
            </p>
          </div>
        )}
      </div>

      {/* Algorithm Comparison Info */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">K-Means Algorithm Variations</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">Initialization Methods</h4>
            <p className="text-gray-700">
              <strong>Random:</strong> Fast but can lead to poor clusters<br/>
              <strong>K-Means++:</strong> Smarter initialization for better results
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">Processing Approaches</h4>
            <p className="text-gray-700">
              <strong>Standard:</strong> Uses all data points in each iteration<br/>
              <strong>Mini-Batch:</strong> Uses random samples for speed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KMeansPage;