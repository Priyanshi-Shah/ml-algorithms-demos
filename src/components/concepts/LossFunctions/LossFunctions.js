import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

function LossFunctions() {
  const [selectedFunction, setSelectedFunction] = useState('mse');
  const [actualValue, setActualValue] = useState(3);
  const [predictedValue, setPredictedValue] = useState(2);

  const lossFunctions = {
    mse: {
      name: 'Mean Squared Error (MSE)',
      formula: 'L = (y - ŷ)²',
      description: 'Penalizes large errors more than small ones. Commonly used for regression.',
      calculate: (actual, predicted) => Math.pow(actual - predicted, 2),
      color: '#3B82F6',
      useCase: 'Regression problems'
    },
    mae: {
      name: 'Mean Absolute Error (MAE)',
      formula: 'L = |y - ŷ|',
      description: 'Linear penalty for errors. Less sensitive to outliers than MSE.',
      calculate: (actual, predicted) => Math.abs(actual - predicted),
      color: '#10B981',
      useCase: 'Regression with outliers'
    },
    huber: {
      name: 'Huber Loss',
      formula: 'L = ½(y-ŷ)² if |y-ŷ| ≤ δ, else δ|y-ŷ| - ½δ²',
      description: 'Combines MSE and MAE. Quadratic for small errors, linear for large ones.',
      calculate: (actual, predicted, delta = 1) => {
        const error = Math.abs(actual - predicted);
        return error <= delta ? 0.5 * Math.pow(actual - predicted, 2) : delta * error - 0.5 * Math.pow(delta, 2);
      },
      color: '#8B5CF6',
      useCase: 'Robust regression'
    },
    logistic: {
      name: 'Logistic Loss (Log Loss)',
      formula: 'L = -[y log(p) + (1-y) log(1-p)]',
      description: 'Used for binary classification. Penalizes confident wrong predictions heavily.',
      calculate: (actual, predicted) => {
        // Convert to probability space (0-1)
        const p = Math.max(0.0001, Math.min(0.9999, (predicted + 5) / 10));
        const y = actual > 0 ? 1 : 0;
        return -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
      },
      color: '#F59E0B',
      useCase: 'Binary classification'
    },
    hinge: {
      name: 'Hinge Loss',
      formula: 'L = max(0, 1 - y × ŷ)',
      description: 'Used in SVMs. Only penalizes predictions on wrong side of margin.',
      calculate: (actual, predicted) => {
        const y = actual > 0 ? 1 : -1;
        return Math.max(0, 1 - y * predicted);
      },
      color: '#EF4444',
      useCase: 'Support Vector Machines'
    }
  };

  // Generate data for loss function visualization
  const lossData = useMemo(() => {
    const data = [];
    const current = lossFunctions[selectedFunction];
    
    for (let pred = -5; pred <= 5; pred += 0.1) {
      data.push({
        predicted: pred,
        loss: current.calculate(actualValue, pred),
        isCurrentPoint: Math.abs(pred - predictedValue) < 0.1
      });
    }
    return data;
  }, [selectedFunction, actualValue, predictedValue]);

  // Calculate current loss
  const currentLoss = lossFunctions[selectedFunction].calculate(actualValue, predictedValue);

  // Generate comparison data
  const comparisonData = useMemo(() => {
    const data = [];
    for (let pred = -5; pred <= 5; pred += 0.2) {
      const point = { predicted: pred };
      Object.keys(lossFunctions).forEach(key => {
        point[key] = lossFunctions[key].calculate(actualValue, pred);
      });
      data.push(point);
    }
    return data;
  }, [actualValue]);

  const handleFunctionChange = (functionKey) => {
    setSelectedFunction(functionKey);
  };

  return (
    <div className="space-y-6">
      {/* Getting Started Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">🎯</span>
          Getting Started Guide
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">📊 How to Use:</h4>
            <ol className="space-y-1 text-gray-600 list-decimal list-inside">
              <li>Adjust the <strong>actual value (y)</strong> - the true target</li>
              <li>Move the <strong>predicted value (ŷ)</strong> - what your model predicts</li>
              <li>Watch how different loss functions penalize the error</li>
              <li>Compare functions by selecting different types below</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">💡 Key Concepts:</h4>
            <ul className="space-y-1 text-gray-600 list-disc list-inside">
              <li><strong>Loss = 0</strong> when prediction equals actual value</li>
              <li><strong>Higher loss</strong> means worse prediction</li>
              <li><strong>Different shapes</strong> show how errors are penalized</li>
              <li><strong>Red dot</strong> shows your current prediction on the curve</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Improved Controls Layout */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">🎛️</span>
          Interactive Controls
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Actual Value (y)
                </label>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                  {actualValue}
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={actualValue}
                onChange={(e) => setActualValue(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">
                The true target value your model should predict
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Predicted Value (ŷ)
                </label>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">
                  {predictedValue}
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={predictedValue}
                onChange={(e) => setPredictedValue(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">
                What your model actually predicts
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">Current Loss</div>
              <div className="text-3xl font-bold mb-2" style={{ color: lossFunctions[selectedFunction].color }}>
                {currentLoss.toFixed(4)}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Error: <span className="font-mono">{(actualValue - predictedValue).toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500">
                {Math.abs(actualValue - predictedValue) < 0.1 ? 
                  "🎯 Perfect prediction!" : 
                  Math.abs(actualValue - predictedValue) < 1 ? 
                  "👍 Good prediction" : 
                  Math.abs(actualValue - predictedValue) < 2 ? 
                  "⚠️ Fair prediction" : 
                  "❌ Poor prediction"
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loss Function Visualization - Moved to top */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loss vs Prediction</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="predicted" 
                domain={[-5, 5]}
                type="number"
                scale="linear"
                label={{ value: 'Predicted Value', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Loss', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [value.toFixed(4), 'Loss']}
                labelFormatter={(value) => `Predicted: ${value.toFixed(2)}`}
              />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke={lossFunctions[selectedFunction].color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="loss"
                stroke={lossFunctions[selectedFunction].color}
                strokeWidth={0}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.isCurrentPoint) {
                    return <circle cx={cx} cy={cy} r={6} fill="#EF4444" stroke="#fff" strokeWidth={2} />;
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Current Prediction</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-gray-400"></div>
              <span>Actual Value: {actualValue}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compare All Loss Functions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="predicted" 
                domain={[-5, 5]}
                type="number"
                scale="linear"
                label={{ value: 'Predicted Value', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Loss', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              {Object.entries(lossFunctions).map(([key, func]) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={func.color}
                  strokeWidth={selectedFunction === key ? 3 : 1}
                  strokeOpacity={selectedFunction === key ? 1 : 0.6}
                  dot={false}
                  name={func.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compact Loss Function Selector */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Loss Function</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(lossFunctions).map(([key, func]) => (
            <button
              key={key}
              onClick={() => handleFunctionChange(key)}
              className={`text-left p-3 rounded-lg border-2 transition-all ${
                selectedFunction === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: func.color }}
                ></div>
                <h4 className="font-medium text-gray-900 text-sm">{func.name}</h4>
              </div>
              <p className="text-xs text-gray-500">{func.useCase}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Compact Current Function Details */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-3 md:mb-0">
            <h3 className="text-lg font-bold text-gray-900">
              {lossFunctions[selectedFunction].name}
            </h3>
            <p className="text-sm text-gray-600">{lossFunctions[selectedFunction].description}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="font-mono text-sm text-gray-800">
              <strong>Formula:</strong> {lossFunctions[selectedFunction].formula}
            </p>
          </div>
        </div>
      </div>

      {/* Compact Key Insights */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 Key Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">When to Use Each Loss Function:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><strong>MSE:</strong> Regression, penalizes large errors heavily</li>
              <li><strong>MAE:</strong> Regression with outliers, more robust</li>
              <li><strong>Huber:</strong> Best of both - MSE for small, MAE for large errors</li>
              <li><strong>Log Loss:</strong> Binary classification, probability-based</li>
              <li><strong>Hinge Loss:</strong> SVMs, classification margin focus</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Properties:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• <strong>Convex functions</strong> guarantee global minimum</li>
              <li>• <strong>Differentiability</strong> enables gradient optimization</li>
              <li>• <strong>Loss magnitude</strong> affects learning rate</li>
              <li>• <strong>Outlier sensitivity</strong> varies between functions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Guide Section */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-2xl mr-3">📚</span>
          Comprehensive Loss Functions Guide
        </h2>
        
        <div className="space-y-8">
          {/* Mean Squared Error (MSE) */}
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              Mean Squared Error (MSE)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📐 Mathematical Definition</h4>
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <p className="font-mono text-lg text-center">L(y, ŷ) = (y - ŷ)²</p>
                  <p className="text-sm text-gray-600 mt-2">
                    For multiple predictions: MSE = (1/n) Σ(yᵢ - ŷᵢ)²
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  MSE squares the error, which has several important implications for how it penalizes predictions.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-blue-700"><strong>In Simple Words:</strong> If your prediction is off by 2, you get penalized by 4 (2²). If off by 10, you get penalized by 100 (10²) - big mistakes hurt a lot more!</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🔍 Key Characteristics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Quadratic penalty:</strong> Large errors are penalized much more heavily than small ones</li>
                  <li>• <strong>Always positive:</strong> Loss is always ≥ 0, with 0 being perfect prediction</li>
                  <li>• <strong>Differentiable everywhere:</strong> Smooth gradient for optimization</li>
                  <li>• <strong>Units squared:</strong> If predicting price in dollars, loss is in dollars²</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">✅ When to Use MSE</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Regression problems</strong> where you want to minimize large errors</li>
                  <li>• When your data has <strong>few outliers</strong></li>
                  <li>• When <strong>large errors are much worse</strong> than small errors</li>
                  <li>• <strong>Gaussian noise</strong> assumption (normal distribution of errors)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Limitations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Sensitive to outliers:</strong> One bad prediction can dominate the loss</li>
                  <li>• <strong>Units are squared:</strong> Harder to interpret than original units</li>
                  <li>• <strong>Assumes equal cost:</strong> All types of errors have same relative importance</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mean Absolute Error (MAE) */}
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              Mean Absolute Error (MAE)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📐 Mathematical Definition</h4>
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <p className="font-mono text-lg text-center">L(y, ŷ) = |y - ŷ|</p>
                  <p className="text-sm text-gray-600 mt-2">
                    For multiple predictions: MAE = (1/n) Σ|yᵢ - ŷᵢ|
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  MAE takes the absolute value of the error, creating a linear penalty for deviations.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-green-700"><strong>In Simple Words:</strong> Whether your prediction is off by 2 or 10, you get penalized by exactly that amount. All mistakes are treated equally!</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🔍 Key Characteristics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Linear penalty:</strong> Error increases proportionally with deviation</li>
                  <li>• <strong>Robust to outliers:</strong> Large errors don't dominate the loss</li>
                  <li>• <strong>Same units:</strong> Loss is in same units as the target variable</li>
                  <li>• <strong>Not differentiable at 0:</strong> Can cause optimization issues</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">✅ When to Use MAE</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Datasets with outliers</strong> that you don't want to dominate training</li>
                  <li>• When <strong>all errors are equally bad</strong> regardless of magnitude</li>
                  <li>• <strong>Interpretability matters:</strong> Loss is in original units</li>
                  <li>• <strong>Laplace noise</strong> assumption (double exponential distribution)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Limitations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Not differentiable at zero:</strong> Can slow convergence</li>
                  <li>• <strong>Equal penalty:</strong> Doesn't distinguish between small and large errors</li>
                  <li>• <strong>May underfit:</strong> Less sensitive to getting close to the target</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Huber Loss */}
          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
              Huber Loss
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📐 Mathematical Definition</h4>
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <p className="font-mono text-sm text-center mb-2">
                    L(y, ŷ) = ½(y-ŷ)² if |y-ŷ| ≤ δ
                  </p>
                  <p className="font-mono text-sm text-center">
                    L(y, ŷ) = δ|y-ŷ| - ½δ² otherwise
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    δ (delta) is a threshold parameter, typically δ = 1
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Huber loss combines the best of MSE (smooth, quadratic for small errors) and MAE (robust for large errors).
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-purple-700"><strong>In Simple Words:</strong> For small mistakes (like being off by 1), it acts like MSE and squares the error. For big mistakes (like being off by 10), it acts like MAE and treats them linearly - best of both worlds!</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🔍 Key Characteristics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Hybrid approach:</strong> Quadratic for small errors, linear for large ones</li>
                  <li>• <strong>Differentiable everywhere:</strong> Smooth optimization</li>
                  <li>• <strong>Tunable threshold:</strong> δ parameter controls the transition point</li>
                  <li>• <strong>Robust to outliers:</strong> But still sensitive to small errors</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">✅ When to Use Huber Loss</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Mixed data quality:</strong> Some outliers but mostly clean data</li>
                  <li>• <strong>Robust regression:</strong> Want outlier resistance with smooth gradients</li>
                  <li>• <strong>Best of both worlds:</strong> MSE precision + MAE robustness</li>
                  <li>• <strong>Reinforcement learning:</strong> Common in value function approximation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Considerations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Parameter tuning:</strong> Need to choose appropriate δ value</li>
                  <li>• <strong>More complex:</strong> Not as intuitive as MSE or MAE</li>
                  <li>• <strong>Computational overhead:</strong> Requires conditional logic</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Logistic Loss (Log Loss) */}
          <div className="border-l-4 border-yellow-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
              Logistic Loss (Log Loss)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📐 Mathematical Definition</h4>
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <p className="font-mono text-sm text-center mb-2">
                    L(y, p) = -[y log(p) + (1-y) log(1-p)]
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Where y ∈ {0,1} is the true label and p ∈ [0,1] is predicted probability
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Log loss measures the performance of classification models that output probabilities between 0 and 1.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-yellow-700"><strong>In Simple Words:</strong> If you're 90% confident it's a cat but it's actually a dog, you get heavily punished. The more confident you are about the wrong answer, the bigger the penalty!</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🔍 Key Characteristics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Probability-based:</strong> Works with predicted probabilities, not raw scores</li>
                  <li>• <strong>Heavily penalizes wrong confident predictions:</strong> Loss → ∞ as p → 0 for y=1</li>
                  <li>• <strong>Smooth and differentiable:</strong> Good for gradient-based optimization</li>
                  <li>• <strong>Encourages calibrated probabilities:</strong> Not just correct classifications</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">✅ When to Use Log Loss</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Binary classification:</strong> Standard loss for logistic regression</li>
                  <li>• <strong>Probability calibration matters:</strong> Need well-calibrated probabilities</li>
                  <li>• <strong>Maximum likelihood estimation:</strong> Assumes Bernoulli distribution</li>
                  <li>• <strong>Neural networks:</strong> Common final layer activation with sigmoid</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Considerations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Requires probabilities:</strong> Predictions must be in [0,1] range</li>
                  <li>• <strong>Sensitive to outliers:</strong> Very confident wrong predictions are heavily penalized</li>
                  <li>• <strong>Class imbalance:</strong> May need weighting for imbalanced datasets</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hinge Loss */}
          <div className="border-l-4 border-red-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              Hinge Loss
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📐 Mathematical Definition</h4>
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <p className="font-mono text-sm text-center mb-2">
                    L(y, ŷ) = max(0, 1 - y × ŷ)
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Where y ∈ {-1, +1} is the true label and ŷ is the raw model output (not probability)
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Hinge loss is designed for maximum-margin classification, focusing on the decision boundary.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-red-700"><strong>In Simple Words:</strong> You only get punished if your prediction is wrong OR too close to the decision boundary. Being confidently correct gets no penalty at all!</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🔍 Key Characteristics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Margin-based:</strong> Only cares about classification margin, not probabilities</li>
                  <li>• <strong>Zero loss for correct confident predictions:</strong> No penalty if y×ŷ ≥ 1</li>
                  <li>• <strong>Linear penalty:</strong> Loss increases linearly with violation of margin</li>
                  <li>• <strong>Not differentiable at hinge point:</strong> Subgradient methods needed</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">✅ When to Use Hinge Loss</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Support Vector Machines (SVMs):</strong> Standard loss function</li>
                  <li>• <strong>Maximum margin classification:</strong> Want to maximize decision boundary margin</li>
                  <li>• <strong>Binary classification:</strong> Only care about correct side of boundary</li>
                  <li>• <strong>Sparse solutions:</strong> Encourages sparsity in support vectors</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Considerations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>No probabilistic interpretation:</strong> Outputs are not calibrated probabilities</li>
                  <li>• <strong>Requires {-1, +1} labels:</strong> Different convention than {0, 1}</li>
                  <li>• <strong>Not differentiable:</strong> Requires subgradient optimization methods</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">⚖️</span>
              Quick Comparison Guide
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">For Regression:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>Clean data, penalize large errors:</strong> MSE</li>
                  <li>• <strong>Outliers present:</strong> MAE or Huber</li>
                  <li>• <strong>Best balance:</strong> Huber Loss</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">For Classification:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>Need probabilities:</strong> Log Loss</li>
                  <li>• <strong>Maximum margin:</strong> Hinge Loss</li>
                  <li>• <strong>Neural networks:</strong> Log Loss + Sigmoid</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Optimization:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>Smooth gradients:</strong> MSE, Log Loss</li>
                  <li>• <strong>Robust to outliers:</strong> MAE, Huber</li>
                  <li>• <strong>Margin maximization:</strong> Hinge Loss</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LossFunctions;