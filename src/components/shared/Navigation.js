// src/components/shared/Navigation.js
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const algorithms = [
    { path: '/linear-regression', label: 'Linear Regression' },
    { path: '/kmeans', label: 'K-Means Clustering' }
  ];

  const isHomepage = location.pathname === '/';

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-900">
            ML Algorithms
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Home link (always show) */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isHomepage
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>

            {/* Algorithms dropdown (only show when not on homepage) */}
            {!isHomepage && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center space-x-1"
                >
                  <span>Algorithms</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    {algorithms.map((algorithm) => {
                      const isActive = location.pathname === algorithm.path;
                      return (
                        <Link
                          key={algorithm.path}
                          to={algorithm.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`block px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {algorithm.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navigation;