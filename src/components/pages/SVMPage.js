import React from 'react';
import { Link } from 'react-router-dom';
import SVM from '../algorithms/SVM/SVM';

function SVMPage() {

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
          <div className="p-3 bg-red-100 rounded-xl">
            <span className="text-red-600 text-2xl">🎯</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Support Vector Machine</h1>
            <p className="text-gray-600">Explore different types of SVM for maximum margin classification</p>
          </div>
        </div>
      </div>

      {/* Algorithm Component */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Linear SVM
            </h2>
            <p className="text-gray-600">Linear decision boundary for maximum margin classification</p>
          </div>
          <SVM />
        </div>
      </div>
    </div>
  );
}

export default SVMPage;