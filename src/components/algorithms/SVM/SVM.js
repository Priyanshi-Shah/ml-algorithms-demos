import React, { useState, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

function SVM() {
  const [data, setData] = useState([]);
  const [newestPointId, setNewestPointId] = useState(null);
  const [currentCursorPos, setCurrentCursorPos] = useState({ x: 0, y: 0 });
  const [cursorTooltip, setCursorTooltip] = useState({ show: false, x: 0, y: 0 });
  const [C, setC] = useState(1.0);
  const [selectedClass, setSelectedClass] = useState(1);

  // Initialize with default data
  useEffect(() => {
    if (data.length === 0) {
      const defaultData = [
        { x: 25, y: 25, class: 0, id: 'default_1', timestamp: Date.now() },
        { x: 30, y: 20, class: 0, id: 'default_2', timestamp: Date.now() },
        { x: 20, y: 35, class: 0, id: 'default_3', timestamp: Date.now() },
        { x: 75, y: 75, class: 1, id: 'default_4', timestamp: Date.now() },
        { x: 70, y: 80, class: 1, id: 'default_5', timestamp: Date.now() },
        { x: 80, y: 65, class: 1, id: 'default_6', timestamp: Date.now() },
      ];
      setData(defaultData);
    }
  }, []);

  // Simple Linear SVM implementation
  const { hyperplane, margin, supportVectors, accuracy } = useMemo(() => {
    if (data.length < 4) {
      return { hyperplane: null, margin: null, supportVectors: [], accuracy: 0 };
    }

    const positivePoints = data.filter(d => d.class === 1);
    const negativePoints = data.filter(d => d.class === 0);

    if (positivePoints.length === 0 || negativePoints.length === 0) {
      return { hyperplane: null, margin: null, supportVectors: [], accuracy: 0 };
    }

    // Linear SVM using simplified approach
    const posCentroid = {
      x: positivePoints.reduce((sum, p) => sum + p.x, 0) / positivePoints.length,
      y: positivePoints.reduce((sum, p) => sum + p.y, 0) / positivePoints.length
    };
    const negCentroid = {
      x: negativePoints.reduce((sum, p) => sum + p.x, 0) / negativePoints.length,
      y: negativePoints.reduce((sum, p) => sum + p.y, 0) / negativePoints.length
    };

    // Hyperplane perpendicular to line connecting centroids
    const dx = posCentroid.x - negCentroid.x;
    const dy = posCentroid.y - negCentroid.y;
    const midpoint = {
      x: (posCentroid.x + negCentroid.x) / 2,
      y: (posCentroid.y + negCentroid.y) / 2
    };

    // Adjust midpoint based on C parameter (regularization)
    const regularizationShift = (1 - C) * 10; // C ranges from 0.1 to 10
    midpoint.x += regularizationShift * (negCentroid.x - posCentroid.x) * 0.1;
    midpoint.y += regularizationShift * (negCentroid.y - posCentroid.y) * 0.1;

    // Hyperplane equation: ax + by + c = 0
    const a = dx;
    const b = dy;
    const c = -(a * midpoint.x + b * midpoint.y);

    const hyperplane = { a, b, c };

    // Find support vectors (closest points to hyperplane)
    const distances = data.map(point => {
      const dist = Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
      return { ...point, distance: dist };
    });

    distances.sort((a, b) => a.distance - b.distance);
    const supportVectors = distances.slice(0, Math.min(4, Math.floor(data.length / 4)));

    // Calculate margin and accuracy
    const margin = supportVectors.length > 0 ? supportVectors[0].distance * 2 : 0;
    
    let correct = 0;
    data.forEach(point => {
      const prediction = hyperplane.a * point.x + hyperplane.b * point.y + hyperplane.c > 0 ? 1 : 0;
      if (prediction === point.class) correct++;
    });
    const accuracy = data.length > 0 ? correct / data.length : 0;

    return { 
      hyperplane, 
      margin, 
      supportVectors: supportVectors.map(sv => ({ x: sv.x, y: sv.y, class: sv.class, id: sv.id })),
      accuracy
    };
  }, [data, C]);

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
    
    if (type === 'linear') {
      // Linearly separable data
      for (let i = 0; i < 25; i++) {
        newData.push({
          x: Math.floor(Math.random() * 40) + 10,
          y: Math.floor(Math.random() * 40) + 10,
          class: 0,
          id: `preset_${i}_${Date.now()}`,
          timestamp: Date.now()
        });
      }
      for (let i = 0; i < 25; i++) {
        newData.push({
          x: Math.floor(Math.random() * 40) + 50,
          y: Math.floor(Math.random() * 40) + 50,
          class: 1,
          id: `preset_${i + 25}_${Date.now()}`,
          timestamp: Date.now()
        });
      }
    } else if (type === 'nonlinear') {
      // Non-linearly separable (circular pattern)
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * 2 * Math.PI;
        const radius = 20 + Math.random() * 10;
        newData.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle),
          class: 0,
          id: `preset_${i}_${Date.now()}`,
          timestamp: Date.now()
        });
      }
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 15;
        newData.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle),
          class: 1,
          id: `preset_${i + 30}_${Date.now()}`,
          timestamp: Date.now()
        });
      }
    } else if (type === 'overlapping') {
      // Overlapping classes
      for (let i = 0; i < 40; i++) {
        newData.push({
          x: Math.floor(Math.random() * 80) + 10,
          y: Math.floor(Math.random() * 80) + 10,
          class: Math.random() > 0.5 ? 1 : 0,
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
    const isSupportVector = supportVectors.some(sv => sv.id === payload.id);
    const color = payload.class === 1 ? '#10b981' : '#ef4444';
    const fillColor = isNewest ? '#fbb6ce' : color;
    const strokeWidth = isSupportVector ? 4 : 2;
    const strokeColor = isSupportVector ? '#000000' : color;
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={0.8}
        />
        {isSupportVector && (
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="none"
            stroke="#000000"
            strokeWidth={2}
            strokeDasharray="2,2"
            opacity={0.6}
          />
        )}
      </g>
    );
  };


  const class0Data = data.filter(d => d.class === 0);
  const class1Data = data.filter(d => d.class === 1);

  // Calculate hyperplane line points for display
  const { hyperplanePoints, marginLines } = useMemo(() => {
    if (!hyperplane) return { hyperplanePoints: [], marginLines: { upper: [], lower: [] } };
    
    const { a, b, c } = hyperplane;
    const points = [];
    
    // Calculate line points across the chart
    for (let x = 0; x <= 100; x += 5) {
      if (Math.abs(b) > 0.001) {
        const y = (-a * x - c) / b;
        if (y >= 0 && y <= 100) {
          points.push({ x, y });
        }
      }
    }
    
    // Calculate margin lines (parallel to hyperplane at distance = margin)
    const marginDistance = margin || 0;
    const norm = Math.sqrt(a * a + b * b);
    
    // Upper margin: (a*x + b*y + c) = +margin_distance * norm
    // Lower margin: (a*x + b*y + c) = -margin_distance * norm
    const upperMarginPoints = [];
    const lowerMarginPoints = [];
    
    if (norm > 0 && marginDistance > 0) {
      for (let x = 0; x <= 100; x += 5) {
        if (Math.abs(b) > 0.001) {
          // Upper margin line: y = (-a*x - c - margin_distance*norm) / b
          const yUpper = (-a * x - c - marginDistance * norm) / b;
          if (yUpper >= 0 && yUpper <= 100) {
            upperMarginPoints.push({ x, y: yUpper });
          }
          
          // Lower margin line: y = (-a*x - c + margin_distance*norm) / b
          const yLower = (-a * x - c + marginDistance * norm) / b;
          if (yLower >= 0 && yLower <= 100) {
            lowerMarginPoints.push({ x, y: yLower });
          }
        }
      }
    }
    
    return { 
      hyperplanePoints: points, 
      marginLines: { 
        upper: upperMarginPoints, 
        lower: lowerMarginPoints 
      } 
    };
  }, [hyperplane, margin]);

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
              <p className="font-semibold text-green-800">Add Points</p>
              <p className="text-green-700 text-xs">Click on the graph or use "Add Point" button</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
            <div>
              <p className="font-semibold text-blue-800">Watch Hyperplane</p>
              <p className="text-blue-700 text-xs">See the decision boundary automatically separate classes</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
            <div>
              <p className="font-semibold text-purple-800">Find Support Vectors</p>
              <p className="text-purple-700 text-xs">Black-circled points define the decision boundary</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
            <div>
              <p className="font-semibold text-orange-800">Try Presets</p>
              <p className="text-orange-700 text-xs">Use "Linear", "Non-linear" or "Overlapping" ✨</p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-green-200">
          <p className="text-sm text-gray-600 mb-2"><strong>💡 Pro Tip:</strong> Try the preset data first! Click:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset('linear')}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors"
            >
              Linear Separable
            </button>
            <button
              onClick={() => loadPreset('nonlinear')}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
            >
              Non-linear Pattern
            </button>
            <button
              onClick={() => loadPreset('overlapping')}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors"
            >
              Overlapping Classes
            </button>
            <span className="text-xs text-gray-500 self-center">← Perfect for beginners!</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Support Vector Machine (SVM)</h3>
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
                        const isSV = supportVectors.some(sv => sv.id === data.id);
                        return (
                          <div className="bg-white p-2 border rounded shadow-lg">
                            <p>X: {data.x}</p>
                            <p>Y: {data.y}</p>
                            <p>Class: {data.class === 1 ? 'Positive (1)' : 'Negative (0)'}</p>
                            {isSV && <p className="text-blue-600 font-semibold">Support Vector!</p>}
                          </div>
                        );
                      }
                      return <div className="bg-white p-2 border rounded shadow-lg">Click to add Class {selectedClass} point at X: {Math.round(currentCursorPos.x)}, Y: {Math.round(currentCursorPos.y)}</div>;
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
                  
                  {/* Hyperplane visualization as line */}
                  {hyperplane && hyperplanePoints.length >= 2 && (
                    <>
                      {/* Draw line segments between hyperplane points */}
                      {hyperplanePoints.map((point, index) => {
                        if (index < hyperplanePoints.length - 1) {
                          const nextPoint = hyperplanePoints[index + 1];
                          return (
                            <ReferenceLine
                              key={`hyperplane-${index}`}
                              segment={[
                                { x: point.x, y: point.y },
                                { x: nextPoint.x, y: nextPoint.y }
                              ]}
                              stroke="#2563eb"
                              strokeWidth={3}
                              strokeDasharray="none"
                            />
                          );
                        }
                        return null;
                      })}
                      
                      {/* Upper margin line */}
                      {marginLines.upper.map((point, index) => {
                        if (index < marginLines.upper.length - 1) {
                          const nextPoint = marginLines.upper[index + 1];
                          return (
                            <ReferenceLine
                              key={`upper-margin-${index}`}
                              segment={[
                                { x: point.x, y: point.y },
                                { x: nextPoint.x, y: nextPoint.y }
                              ]}
                              stroke="#64748b"
                              strokeWidth={2}
                              strokeDasharray="4 4"
                              opacity={0.7}
                            />
                          );
                        }
                        return null;
                      })}
                      
                      {/* Lower margin line */}
                      {marginLines.lower.map((point, index) => {
                        if (index < marginLines.lower.length - 1) {
                          const nextPoint = marginLines.lower[index + 1];
                          return (
                            <ReferenceLine
                              key={`lower-margin-${index}`}
                              segment={[
                                { x: point.x, y: point.y },
                                { x: nextPoint.x, y: nextPoint.y }
                              ]}
                              stroke="#64748b"
                              strokeWidth={2}
                              strokeDasharray="4 4"
                              opacity={0.7}
                            />
                          );
                        }
                        return null;
                      })}
                    </>
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
                  ➕ Add Class {selectedClass} point
                </div>
              )}
            </div>


            {/* Control buttons below chart */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => loadPreset('linear')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Linear Separable
              </button>
              <button
                onClick={() => loadPreset('nonlinear')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Non-linear Pattern
              </button>
              <button
                onClick={() => loadPreset('overlapping')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Overlapping Classes
              </button>
              <button
                onClick={clearData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                🔄 Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Hyperplane Equation */}
          {hyperplane && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">Hyperplane Equation</h4>
              <div className="text-center">
                <div className="text-lg font-mono bg-white p-3 rounded border">
                  {hyperplane.a.toFixed(2)}x + {hyperplane.b.toFixed(2)}y + {hyperplane.c.toFixed(2)} = 0
                </div>
              </div>
            </div>
          )}

          {/* Model Metrics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Model Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Data Points:</span>
                <span className="font-mono font-semibold">{data.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Support Vectors:</span>
                <span className="font-mono font-semibold text-blue-600">{supportVectors.length}</span>
              </div>
              {hyperplane && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className={`font-mono font-semibold ${accuracy > 0.8 ? 'text-green-600' : accuracy > 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {(accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Margin:</span>
                    <span className="font-mono font-semibold text-purple-600">{margin.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Regularization (C):</span>
                    <span className="font-mono font-semibold">{C.toFixed(1)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Class Selection */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Select Class to Add:</h4>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedClass(0)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedClass === 0
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                Class 0 (Negative)
              </button>
              <button
                onClick={() => setSelectedClass(1)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedClass === 1
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Class 1 (Positive)
              </button>
            </div>
            
            <button
              onClick={addPoint}
              className={`w-full py-2 px-4 rounded-lg transition-colors text-white ${
                selectedClass === 0 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              ➕ Add Class {selectedClass} Point
            </button>
          </div>

          {/* Controls */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Controls</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regularization (C): {C}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={C}
                  onChange={(e) => setC(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Soft Margin</span>
                  <span>Hard Margin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Legend</h4>
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
                <div className="w-4 h-4 border-2 border-black rounded-full bg-transparent"></div>
                <span className="text-sm">Support Vector</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-blue-600"></div>
                <span className="text-sm">Hyperplane</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-gray-500 border-dashed border-t-2" style={{borderStyle: 'dashed'}}></div>
                <span className="text-sm">Margin Lines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content - Separate section below */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎓 Understanding Support Vector Machine (SVM)</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* What is it? */}
          <div>
            <h3 className="text-xl font-semibold text-blue-800 mb-3">🤔 What is SVM?</h3>
            <p className="text-gray-700 mb-4">
              Imagine drawing the widest possible road between two neighborhoods to separate them. SVM finds the optimal 
              "hyperplane" that maximizes the margin (distance) between different classes, making it robust to new data.
            </p>
            
            <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">🔢 The Mathematics</h4>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Hyperplane:</strong> w·x + b = 0
              </p>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Decision Function:</strong> f(x) = sign(w·x + b)
              </p>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Margin:</strong> γ = 2/||w||
              </p>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">🎯 Key Concepts</h4>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              <li><strong>Support Vectors:</strong> Critical points that define the boundary</li>
              <li><strong>Margin:</strong> Distance between hyperplane and nearest points</li>
              <li><strong>Hyperplane:</strong> Decision boundary separating classes</li>
              <li><strong>Regularization (C):</strong> Controls trade-off between margin and accuracy</li>
            </ul>
          </div>

          {/* How it works */}
          <div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">⚙️ How Does SVM Work?</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">1. Find Optimal Hyperplane</h4>
                <p className="text-sm text-gray-600">Maximize margin between classes while minimizing classification errors</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">2. Identify Support Vectors</h4>
                <p className="text-sm text-gray-600">Points closest to hyperplane that define the decision boundary</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800">3. Handle Non-separable Data</h4>
                <p className="text-sm text-gray-600">Use soft margin to allow some misclassification when data overlaps</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800">4. Optimize with Parameter C</h4>
                <p className="text-sm text-gray-600">Higher C = harder margin, Lower C = softer margin</p>
              </div>
            </div>

            <div className="bg-white border border-green-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-green-800 mb-2">🌟 Real-World Applications</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-semibold text-purple-800">🖼️ Image Recognition</p>
                  <p className="text-gray-600 text-xs">Face detection, object classification</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-800">📝 Text Classification</p>
                  <p className="text-gray-600 text-xs">Spam filtering, sentiment analysis</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">🧬 Bioinformatics</p>
                  <p className="text-gray-600 text-xs">Gene classification, protein analysis</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">💰 Finance</p>
                  <p className="text-gray-600 text-xs">Credit scoring, fraud detection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advantages vs Limitations */}
        <div className="grid md:grid-cols-2 gap-8 mt-8 pt-6 border-t border-blue-200">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 mb-2">✅ Use SVM When:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• You have high-dimensional data</li>
              <li>• Dataset is relatively small to medium-sized</li>
              <li>• You need a robust, accurate classifier</li>
              <li>• Classes are clearly separable or nearly separable</li>
              <li>• You want good generalization performance</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800 mb-2">⚠️ Avoid SVM When:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Dataset is very large (training becomes slow)</li>
              <li>• Data has many overlapping classes</li>
              <li>• You need probability estimates</li>
              <li>• Data is very noisy with many outliers</li>
              <li>• Interpretability is more important than accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SVM;