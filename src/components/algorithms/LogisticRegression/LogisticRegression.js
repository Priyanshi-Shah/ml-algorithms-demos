import React, { useState, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LineChart, Line } from 'recharts';

function LogisticRegression() {
  const [data, setData] = useState([]);
  const [newestPointId, setNewestPointId] = useState(null);
  const [currentCursorPos, setCurrentCursorPos] = useState({ x: 0, y: 0 });
  const [cursorTooltip, setCursorTooltip] = useState({ show: false, x: 0, y: 0 });
  const [selectedClass, setSelectedClass] = useState(1);

  // Initialize with default data
  useEffect(() => {
    if (data.length === 0) {
      const defaultData = [
        { x: 20, y: 30, class: 0, id: 'default_1', timestamp: Date.now() },
        { x: 25, y: 25, class: 0, id: 'default_2', timestamp: Date.now() },
        { x: 30, y: 35, class: 0, id: 'default_3', timestamp: Date.now() },
        { x: 70, y: 65, class: 1, id: 'default_4', timestamp: Date.now() },
        { x: 75, y: 70, class: 1, id: 'default_5', timestamp: Date.now() },
        { x: 80, y: 75, class: 1, id: 'default_6', timestamp: Date.now() },
      ];
      setData(defaultData);
    }
  }, []);

  const sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x));
  };

  const { coefficients, accuracy, logLoss, sigmoidCurve, decisionBoundary } = useMemo(() => {
    if (data.length < 2) {
      return { coefficients: null, accuracy: 0, logLoss: 0, sigmoidCurve: [], decisionBoundary: [] };
    }

    // Use both X and Y coordinates for classification
    const X = data.map(d => [1, d.x, d.y]);
    const y = data.map(d => d.class);

    let weights = [0, 0.01, 0.01];
    const learningRate = 0.1;
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const predictions = X.map(x => sigmoid(weights[0] + weights[1] * x[1] + weights[2] * x[2]));
      
      const gradient0 = predictions.reduce((sum, pred, idx) => sum + (pred - y[idx]), 0) / data.length;
      const gradient1 = predictions.reduce((sum, pred, idx) => sum + (pred - y[idx]) * X[idx][1], 0) / data.length;
      const gradient2 = predictions.reduce((sum, pred, idx) => sum + (pred - y[idx]) * X[idx][2], 0) / data.length;
      
      weights[0] -= learningRate * gradient0;
      weights[1] -= learningRate * gradient1;
      weights[2] -= learningRate * gradient2;
    }

    const finalPredictions = X.map(x => sigmoid(weights[0] + weights[1] * x[1] + weights[2] * x[2]));
    const binaryPredictions = finalPredictions.map(p => p >= 0.5 ? 1 : 0);
    const accuracy = binaryPredictions.reduce((sum, pred, idx) => sum + (pred === y[idx] ? 1 : 0), 0) / data.length;
    
    const logLoss = -y.reduce((sum, actual, idx) => {
      const pred = Math.max(Math.min(finalPredictions[idx], 0.999), 0.001);
      return sum + actual * Math.log(pred) + (1 - actual) * Math.log(1 - pred);
    }, 0) / data.length;

    // Create sigmoid curve for X axis (keeping Y constant at 50)
    const sigmoidCurve = [];
    for (let x = 0; x <= 100; x += 2) {
      const prob = sigmoid(weights[0] + weights[1] * x + weights[2] * 50);
      sigmoidCurve.push({ x, probability: prob });
    }

    // Create decision boundary line (where probability = 0.5)
    // weights[0] + weights[1] * x + weights[2] * y = 0
    // y = -(weights[0] + weights[1] * x) / weights[2]
    const decisionBoundary = [];
    if (Math.abs(weights[2]) > 0.001) {
      for (let x = 0; x <= 100; x += 5) {
        const y = -(weights[0] + weights[1] * x) / weights[2];
        if (y >= 0 && y <= 100) {
          decisionBoundary.push({ x, y });
        }
      }
    }

    return { coefficients: weights, accuracy, logLoss, sigmoidCurve, decisionBoundary };
  }, [data]);

  const addRandomPoint = () => {
    const newPoint = {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      class: Math.random() > 0.5 ? 1 : 0,
      id: Date.now(),
      timestamp: Date.now()
    };
    setData(prev => [...prev, newPoint]);
    setNewestPointId(newPoint.id);
  };

  const addPoint = () => {
    const newPoint = {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      class: selectedClass,
      id: Date.now(),
      timestamp: Date.now()
    };
    setData(prev => [...prev, newPoint]);
    setNewestPointId(newPoint.id);
  };

  const handleChartClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left - 20) / (rect.width - 40)) * 100;
    const y = 100 - ((e.clientY - rect.top - 20) / (rect.height - 40)) * 100;
    
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      const newPoint = {
        x: Math.round(x),
        y: Math.round(y),
        class: selectedClass,
        id: Date.now(),
        timestamp: Date.now()
      };
      setData(prev => [...prev, newPoint]);
      setNewestPointId(newPoint.id);
    }
  };

  const clearData = () => {
    setData([]);
    setNewestPointId(null);
  };

  const loadPreset = (type) => {
    let newData = [];
    setNewestPointId(null);
    
    if (type === 'binary') {
      for (let i = 0; i < 30; i++) {
        newData.push({
          x: Math.floor(Math.random() * 50),
          y: Math.floor(Math.random() * 100),
          class: 0,
          id: `preset_${i}_${Date.now()}`,
          timestamp: Date.now()
        });
      }
      for (let i = 0; i < 30; i++) {
        newData.push({
          x: 50 + Math.floor(Math.random() * 50),
          y: Math.floor(Math.random() * 100),
          class: 1,
          id: `preset_${i + 30}_${Date.now()}`,
          timestamp: Date.now()
        });
      }
    } else if (type === 'sigmoid') {
      for (let i = 0; i < 60; i++) {
        const x = Math.floor(Math.random() * 100);
        const prob = sigmoid((x - 50) * 0.1);
        const noiseClass = Math.random() < prob ? 1 : 0;
        newData.push({
          x,
          y: Math.floor(Math.random() * 100),
          class: noiseClass,
          id: `preset_${i}_${Date.now()}`,
          timestamp: Date.now()
        });
      }
    }
    setData(newData);
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const isNewest = payload.id === newestPointId;
    const color = payload.class === 1 ? '#10b981' : '#ef4444';
    const fillColor = isNewest ? '#fbb6ce' : color;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={fillColor}
        stroke={color}
        strokeWidth={2}
        opacity={0.8}
      />
    );
  };

  const handleMouseMove = (event) => {
    if (event && event.activeLabel !== undefined) {
      setCurrentCursorPos({ x: event.activeLabel, y: event.activePayload?.[0]?.payload?.y || 0 });
    }
  };

  const class0Data = data.filter(d => d.class === 0);
  const class1Data = data.filter(d => d.class === 1);

  return (
    <div className="space-y-6">
      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🚀 Quick Start Guide</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
            <div>
              <p className="font-semibold text-green-800">Select Class</p>
              <p className="text-green-700 text-xs">Choose Class 0 or Class 1, then click to add points</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
            <div>
              <p className="font-semibold text-blue-800">Watch S-Curve</p>
              <p className="text-blue-700 text-xs">See the blue sigmoid curve fit your classification data</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
            <div>
              <p className="font-semibold text-purple-800">Check Accuracy</p>
              <p className="text-purple-700 text-xs">Higher accuracy means better classification (right panel)</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
            <div>
              <p className="font-semibold text-orange-800">Monitor Progress</p>
              <p className="text-orange-700 text-xs">Watch accuracy and log loss improve in real-time ✨</p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-green-200">
          <p className="text-sm text-gray-600 mb-2"><strong>💡 Pro Tip:</strong> Try the preset data first! Click:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset('binary')}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors"
            >
              Binary Split
            </button>
            <button
              onClick={() => loadPreset('sigmoid')}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
            >
              Sigmoid Pattern
            </button>
            <span className="text-xs text-gray-500 self-center">← Perfect for beginners!</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Logistic Regression</h3>
            </div>
            

            <div className="relative">
              <div 
                onClick={handleChartClick}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left - 20) / (rect.width - 40)) * 100;
                  const y = 100 - ((e.clientY - rect.top - 20) / (rect.height - 40)) * 100;
                  setCurrentCursorPos({ x: Math.round(x), y: Math.round(y) });
                  setCursorTooltip({
                    show: true,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }}
                onMouseLeave={() => {
                  setCursorTooltip({ show: false, x: 0, y: 0 });
                }}
                className="cursor-crosshair"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Feature X" 
                    domain={[0, 100]}
                    label={{ value: 'Feature X', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Feature Y" 
                    domain={[0, 100]}
                    label={{ value: 'Feature Y', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow-lg">
                            <p>X: {data.x}</p>
                            <p>Y: {data.y}</p>
                            <p>Class: {data.class === 1 ? 'Positive (1)' : 'Negative (0)'}</p>
                          </div>
                        );
                      }
                      return <div className="bg-white p-2 border rounded shadow-lg">Click to add Class {selectedClass} point at X: {Math.round(currentCursorPos.x)}</div>;
                    }}
                  />
                  <Legend />
                  
                  <Scatter 
                    name="Class 0 (Negative)" 
                    data={class0Data} 
                    fill="#ef4444"
                    shape={<CustomDot />}
                  />
                  <Scatter 
                    name="Class 1 (Positive)" 
                    data={class1Data} 
                    fill="#10b981"
                    shape={<CustomDot />}
                  />
                  
                  {/* Decision Boundary Line */}
                  {decisionBoundary.length > 0 && (
                    <Scatter 
                      name="Decision Boundary" 
                      data={decisionBoundary} 
                      fill="none"
                      line={{ stroke: '#2563eb', strokeWidth: 3, strokeDasharray: '5 5' }}
                      shape={() => null}
                    />
                  )}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Cursor Tooltip */}
              {cursorTooltip.show && (
                <div
                  className="absolute bg-black text-white px-2 py-1 rounded text-xs pointer-events-none z-10"
                  style={{
                    left: cursorTooltip.x + 10,
                    top: cursorTooltip.y - 30,
                  }}
                >
                  Click to add Class {selectedClass} point
                </div>
              )}
              
              {coefficients && sigmoidCurve.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Sigmoid Probability Curve</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={sigmoidCurve}
                      margin={{ top: 10, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        domain={[0, 100]}
                        label={{ value: 'Feature X', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="probability" 
                        domain={[0, 1]}
                        label={{ value: 'P(Class = 1)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length > 0) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-2 border rounded shadow-lg">
                                <p>X: {data.x}</p>
                                <p>Probability: {(data.probability * 100).toFixed(1)}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="probability" 
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                        name="Sigmoid Curve"
                      />
                      <ReferenceLine 
                        y={0.5} 
                        stroke="#ef4444" 
                        strokeDasharray="5 5"
                        label="Decision Threshold"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Controls</h4>
            
            <div className="space-y-3">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Class to Add:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedClass(0)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedClass === 0
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    Class 0
                  </button>
                  <button
                    onClick={() => setSelectedClass(1)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedClass === 1
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    Class 1
                  </button>
                </div>
              </div>

              <button
                onClick={addPoint}
                className={`w-full py-2 px-4 rounded-lg transition-colors text-white ${
                  selectedClass === 0 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Add Class {selectedClass} Point
              </button>
              
              <button
                onClick={clearData}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Model Metrics</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Data Points:</span>
                <span className="font-semibold text-gray-800">{data.length}</span>
              </div>
              
              {coefficients && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <span className="font-semibold text-green-600">{(accuracy * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Log Loss:</span>
                    <span className="font-semibold text-orange-600">{logLoss.toFixed(3)}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-1">Model Equation:</p>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                      σ({coefficients[0].toFixed(3)} + {coefficients[1].toFixed(3)}x + {coefficients[2].toFixed(3)}y)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm">Class 0 (Negative)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">Class 1 (Positive)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-pink-300 rounded-full"></div>
                <span className="text-sm">Newest Point</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-blue-600" style={{borderStyle: 'dashed'}}></div>
                <span className="text-sm">Decision Boundary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-blue-600"></div>
                <span className="text-sm">Sigmoid Curve</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎓 Understanding Logistic Regression</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* What is it? */}
          <div>
            <h3 className="text-xl font-semibold text-blue-800 mb-3">🤔 What is Logistic Regression?</h3>
            <p className="text-gray-700 mb-4">
              Think of logistic regression as a smart bouncer at a club who decides "yes" or "no" for entry based on multiple factors. 
              Unlike linear regression that predicts exact numbers, logistic regression predicts probabilities between 0 and 1.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">🔢 The Mathematics</h4>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Sigmoid Function:</strong> σ(z) = 1/(1 + e^(-z))
              </p>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Linear Combination:</strong> z = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ
              </p>
              <p className="text-sm text-blue-700">
                <strong>Final Equation:</strong> P(y=1|x) = σ(β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ)
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-yellow-800 mb-2">🧠 Why Sigmoid?</h4>
              <p className="text-sm text-yellow-700 mb-2">
                Unlike linear regression, we need outputs between 0 and 1 (probabilities). The sigmoid function:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>S-shaped curve:</strong> Smooth transition from 0 to 1</li>
                <li>• <strong>Never exceeds bounds:</strong> Always between 0 and 1</li>
                <li>• <strong>Interpretable:</strong> Output is actual probability</li>
                <li>• <strong>Differentiable:</strong> Allows gradient descent optimization</li>
              </ul>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">📊 Key Metrics</h4>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              <li><strong>Accuracy:</strong> Percentage of correct predictions</li>
              <li><strong>Log Loss:</strong> Penalizes wrong confident predictions (lower is better)</li>
              <li><strong>Precision/Recall:</strong> Important for imbalanced datasets</li>
              <li><strong>AUC-ROC:</strong> Area under ROC curve (discrimination ability)</li>
            </ul>
          </div>

          {/* How it works */}
          <div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">⚙️ How Does It Work?</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">1. Linear Transformation</h4>
                <p className="text-sm text-gray-600">Combines input features: z = β₀ + β₁x₁ + β₂x₂ + ...</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">2. Sigmoid Squashing</h4>
                <p className="text-sm text-gray-600">Maps z to probability (0,1): P = 1/(1 + e^(-z))</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800">3. Decision Making</h4>
                <p className="text-sm text-gray-600">If P ≥ 0.5 → Class 1, else → Class 0</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800">4. Parameter Learning</h4>
                <p className="text-sm text-gray-600">Uses Maximum Likelihood Estimation (MLE) via gradient descent</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-green-800 mb-2">🎯 Real-World Applications</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-semibold text-purple-800">🏥 Healthcare</p>
                  <p className="text-gray-600 text-xs">Disease diagnosis, treatment response</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-800">💰 Finance</p>
                  <p className="text-gray-600 text-xs">Credit approval, fraud detection</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">📧 Tech</p>
                  <p className="text-gray-600 text-xs">Spam detection, click prediction</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">📈 Marketing</p>
                  <p className="text-gray-600 text-xs">Customer conversion, churn prediction</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-purple-800 mb-2">🔍 Advanced Concepts</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• <strong>Regularization:</strong> L1 (Lasso) and L2 (Ridge) prevent overfitting</li>
                <li>• <strong>Feature Engineering:</strong> Polynomial features for non-linear relationships</li>
                <li>• <strong>Class Imbalance:</strong> Use SMOTE, cost-sensitive learning, or threshold tuning</li>
                <li>• <strong>Multinomial Extension:</strong> Softmax for multi-class classification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* When to use and limitations */}
        <div className="grid md:grid-cols-2 gap-8 mt-8 pt-6 border-t border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-purple-800 mb-3">✅ When to Use Logistic Regression</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>Binary Classification:</strong> Two-class problems (yes/no, spam/ham)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>Probability Needed:</strong> When you need probability estimates, not just predictions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>Interpretability:</strong> Need to understand feature importance</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>Linearly Separable:</strong> Classes can be separated by linear boundary</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>Fast Training:</strong> Need quick model training and prediction</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-red-800 mb-3">⚠️ Limitations & Considerations</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-red-600 mt-1">⚠</span>
                <span><strong>Linear Decision Boundary:</strong> Assumes linear relationship in logit space</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-600 mt-1">⚠</span>
                <span><strong>Outlier Sensitivity:</strong> Can be influenced by extreme values</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-600 mt-1">⚠</span>
                <span><strong>Feature Independence:</strong> Assumes features are independent</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-600 mt-1">⚠</span>
                <span><strong>Large Sample Size:</strong> Needs sufficient data for stable results</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-600 mt-1">⚠</span>
                <span><strong>Perfect Separation:</strong> Problems when classes are perfectly separable</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Learning Path - moved to end */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-indigo-800 mb-2">Wanna learn more? Here is what you should know.</h3>
          <p className="text-gray-600 mb-4 text-sm">Learning path: Beginner to Advanced</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">🌱 Beginner Level</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Understanding binary classification</li>
                <li>✓ Interpreting probabilities (0 to 1)</li>
                <li>✓ Sigmoid curve behavior</li>
                <li>✓ Basic accuracy interpretation</li>
                <li>✓ When to use vs linear regression</li>
              </ul>
            </div>
            
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">⚡ Intermediate Level</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Log-likelihood & cost function</li>
                <li>✓ Coefficient interpretation (odds ratios)</li>
                <li>✓ Cross-validation techniques</li>
                <li>✓ Precision, Recall, F1-score</li>
                <li>✓ ROC curves and AUC</li>
              </ul>
            </div>
            
            <div className="bg-white border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-3">🎯 Advanced Level</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ L1/L2 regularization techniques</li>
                <li>✓ Handling severe class imbalance</li>
                <li>✓ Feature selection & engineering</li>
                <li>✓ Multinomial & ordinal extensions</li>
                <li>✓ Bayesian logistic regression</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogisticRegression;