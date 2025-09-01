import React from 'react';
import { Link } from 'react-router-dom';
import LossFunctions from '../concepts/LossFunctions/LossFunctions';

function LossFunctionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Home
        </Link>
        
        <div className="flex items-center space-x-3 sm:space-x-4 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <span className="text-emerald-600 text-2xl">📉</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Loss Functions</h1>
            <p className="text-gray-600">Understand how algorithms measure and minimize errors</p>
          </div>
        </div>
      </div>

      {/* Concept Component */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Interactive Loss Function Explorer
            </h2>
            <p className="text-gray-600">
              Explore different loss functions and see how they affect model training in real-time.
            </p>
          </div>
          <LossFunctions />
        </div>
      </div>
    </div>
  );
}

export default LossFunctionsPage;