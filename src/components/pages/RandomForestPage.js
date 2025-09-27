import React from 'react';
import { Link } from 'react-router-dom';
import RandomForest from '../algorithms/RandomForest/RandomForest';

function RandomForestPage() {
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
          <div className="p-3 bg-emerald-100 rounded-xl">
            <span className="text-emerald-600 text-2xl">🌲</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Random Forest</h1>
            <p className="text-gray-600">From single trees to forests: Interactive ensemble learning with bagging vs boosting comparison</p>
          </div>
        </div>
      </div>

      {/* Algorithm Component */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Forest Builder: Decision Trees → Random Forest
            </h2>
            <p className="text-gray-600">Learn how combining multiple decision trees creates a more powerful and robust predictor</p>
          </div>
          <RandomForest />
        </div>
      </div>
    </div>
  );
}

export default RandomForestPage;