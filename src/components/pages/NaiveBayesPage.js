import React from 'react';
import { Link } from 'react-router-dom';
import NaiveBayes from '../algorithms/NaiveBayes/NaiveBayes';

function NaiveBayesPage() {

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
            <span className="text-purple-600 text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Naive Bayes Classifier</h1>
            <p className="text-gray-600">Interactive text classification with probabilistic reasoning</p>
          </div>
        </div>
      </div>

      {/* Algorithm Component */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Spam Detection
            </h2>
            <p className="text-gray-600">Experience how Naive Bayes classifies text using probabilistic reasoning and Bayes' theorem</p>
          </div>
          <NaiveBayes />
        </div>
      </div>
    </div>
  );
}

export default NaiveBayesPage;