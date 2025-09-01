// src/components/algorithms/LinearRegression/SimpleLinearRegression.js - OPTIMIZED
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function SimpleLinearRegression() {
  const [points, setPoints] = useState([
    { x: 2, y: 3 },
    { x: 4, y: 5 },
    { x: 6, y: 7 },
    { x: 8, y: 9 }
  ]);
  
  const [showTooltip, setShowTooltip] = useState(false);

  // Memoize regression calculation for better performance
  const regressionLine = useMemo(() => {
    const n = points.length;
    if (n < 2) return { slope: 0, intercept: 0, rSquared: 0 };
    
    const sumX = points.reduce((sum, point) => sum + point.x, 0);
    const sumY = points.reduce((sum, point) => sum + point.y, 0);
    const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = points.reduce((sum, point) => sum + point.x * point.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const yMean = sumY / n;
    const ssTotal = points.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0);
    const ssResidual = points.reduce((sum, point) => {
      const predicted = slope * point.x + intercept;
      return sum + Math.pow(point.y - predicted, 2);
    }, 0);
    const rSquared = ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;
    
    return { slope, intercept, rSquared };
  }, [points]);

  // Optimized chart data generation - MUCH fewer points
  const chartData = useMemo(() => {
    if (points.length < 2) {
      return points.map(point => ({
        x: point.x,
        actualY: point.y,
        regressionY: null
      }));
    }

    // Create a combined dataset with just data points + minimal regression line points
    const allData = [...points.map(point => ({
      x: point.x,
      actualY: point.y,
      regressionY: regressionLine.slope * point.x + regressionLine.intercept
    }))];

    // Add ONLY start and end points for regression line (no intermediate points)
    const minX = 0;
    const maxX = 15;
    
    // Only add start/end points if they're not already data points
    if (!points.some(p => Math.abs(p.x - minX) < 0.1)) {
      allData.push({
        x: minX,
        actualY: null,
        regressionY: regressionLine.slope * minX + regressionLine.intercept
      });
    }
    
    if (!points.some(p => Math.abs(p.x - maxX) < 0.1)) {
      allData.push({
        x: maxX,
        actualY: null,
        regressionY: regressionLine.slope * maxX + regressionLine.intercept
      });
    }

    return allData.sort((a, b) => a.x - b.x);
  }, [points, regressionLine]);

  function addRandomPoint() {
    const newX = Math.round((Math.random() * 12 + 1) * 2) / 2;
    const newY = Math.round((Math.random() * 12 + 1) * 2) / 2;
    setPoints(prev => [...prev, { x: newX, y: newY }]);
  }

  function addPointAtPosition(x, y) {
    const newPoint = {
      x: Math.max(0, Math.min(15, Math.round(x * 2) / 2)),
      y: Math.max(0, Math.min(15, Math.round(y * 2) / 2))
    };
    setPoints(prev => [...prev, newPoint]);
  }

  function loadPreset(preset) {
    const presets = {
      linear: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 5, y: 6 },
        { x: 7, y: 8 },
        { x: 9, y: 10 }
      ],
      scattered: [
        { x: 2, y: 3 },
        { x: 4, y: 7 },
        { x: 6, y: 5 },
        { x: 8, y: 11 },
        { x: 10, y: 9 }
      ],
      noCorrelation: [
        { x: 2, y: 8 },
        { x: 4, y: 3 },
        { x: 6, y: 12 },
        { x: 8, y: 5 },
        { x: 10, y: 9 }
      ]
    };
    setPoints(presets[preset]);
  }

  function clearPoints() {
    setPoints([]);
  }

  function removePoint(index) {
    setPoints(prev => prev.filter((_, i) => i !== index));
  }

  // Simple dot component for data points
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload && payload.actualY !== null && payload.actualY !== undefined) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="#3b82f6"
          stroke="#1d4ed8"
          strokeWidth={2}
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Interactive Visualization</h3>
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-blue-600 hover:text-blue-800 text-lg"
              >
                ℹ️
              </button>
            </div>
            
            {showTooltip && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                💡 <strong>How to use:</strong> Add data points using the controls below. 
                Watch how the red regression line automatically adjusts to best fit your data!
              </div>
            )}

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  domain={[0, 15]} 
                  label={{ value: 'X Values', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  domain={[0, 15]}
                  label={{ value: 'Y Values', angle: -90, position: 'insideLeft' }}
                />
                
                {/* Regression line - simple and fast */}
                {points.length >= 2 && (
                  <Line 
                    type="linear" 
                    dataKey="regressionY" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={false}
                    connectNulls={false}
                    strokeDasharray="0"
                  />
                )}
                
                {/* Data points - only actual points */}
                <Line 
                  type="monotone" 
                  dataKey="actualY" 
                  stroke="transparent"
                  dot={<CustomDot />}
                  line={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={addRandomPoint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              ➕ Add Random Point
            </button>
            <button
              onClick={() => loadPreset('linear')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Perfect Linear
            </button>
            <button
              onClick={() => loadPreset('scattered')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Some Scatter
            </button>
            <button
              onClick={() => loadPreset('noCorrelation')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              No Correlation
            </button>
            <button
              onClick={clearPoints}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              🔄 Clear All
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              🖱️ Add Custom Point
            </h4>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">X:</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  className="w-20 px-2 py-1 border rounded text-center"
                  placeholder="X"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const x = parseFloat(e.target.value);
                      const y = parseFloat(e.target.parentElement.nextElementSibling.querySelector('input').value);
                      if (!isNaN(x) && !isNaN(y)) {
                        addPointAtPosition(x, y);
                        e.target.value = '';
                        e.target.parentElement.nextElementSibling.querySelector('input').value = '';
                      }
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Y:</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  className="w-20 px-2 py-1 border rounded text-center"
                  placeholder="Y"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const y = parseFloat(e.target.value);
                      const x = parseFloat(e.target.parentElement.previousElementSibling.querySelector('input').value);
                      if (!isNaN(x) && !isNaN(y)) {
                        addPointAtPosition(x, y);
                        e.target.value = '';
                        e.target.parentElement.previousElementSibling.querySelector('input').value = '';
                      }
                    }
                  }}
                />
              </div>
              <button
                onClick={() => {
                  const xInput = document.querySelector('input[placeholder="X"]');
                  const yInput = document.querySelector('input[placeholder="Y"]');
                  const x = parseFloat(xInput.value);
                  const y = parseFloat(yInput.value);
                  if (!isNaN(x) && !isNaN(y)) {
                    addPointAtPosition(x, y);
                    xInput.value = '';
                    yInput.value = '';
                  }
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">Regression Equation</h4>
            <div className="text-center">
              <div className="text-2xl font-mono bg-white p-3 rounded border">
                y = {regressionLine.slope.toFixed(2)}x + {regressionLine.intercept.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Slope (m):</span>
                <span className="font-mono font-semibold">{regressionLine.slope.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Y-intercept (b):</span>
                <span className="font-mono font-semibold">{regressionLine.intercept.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">R² (correlation):</span>
                <span className={`font-mono font-semibold ${regressionLine.rSquared > 0.8 ? 'text-green-600' : regressionLine.rSquared > 0.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {regressionLine.rSquared.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Data points:</span>
                <span className="font-semibold">{points.length}</span>
              </div>
            </div>
          </div>

          {points.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Data Points</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {points.map((point, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center bg-white p-2 rounded border text-sm"
                  >
                    <span className="font-mono">({point.x.toFixed(1)}, {point.y.toFixed(1)})</span>
                    <button
                      onClick={() => removePoint(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">How Simple Linear Regression Works</h4>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">The Goal</h5>
            <p>Find the best-fit line y = mx + b that minimizes the sum of squared errors between predicted and actual values.</p>
          </div>
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">Key Metrics</h5>
            <p><strong>Slope (m):</strong> How much Y changes for each unit increase in X<br/>
            <strong>R²:</strong> Proportion of variance explained (0-1, higher is better)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleLinearRegression;