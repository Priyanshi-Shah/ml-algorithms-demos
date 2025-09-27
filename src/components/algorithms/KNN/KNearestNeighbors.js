import React, { useState, useCallback, useEffect, useRef } from 'react';

function KNearestNeighbors() {
  const [points, setPoints] = useState([
    { id: 1, x: 150, y: 100, class: 'A', color: '#3b82f6' },
    { id: 2, x: 200, y: 120, class: 'A', color: '#3b82f6' },
    { id: 3, x: 180, y: 80, class: 'A', color: '#3b82f6' },
    { id: 4, x: 350, y: 150, class: 'B', color: '#ef4444' },
    { id: 5, x: 320, y: 180, class: 'B', color: '#ef4444' },
    { id: 6, x: 380, y: 140, class: 'B', color: '#ef4444' },
    { id: 7, x: 250, y: 250, class: 'C', color: '#10b981' },
    { id: 8, x: 280, y: 220, class: 'C', color: '#10b981' },
    { id: 9, x: 220, y: 280, class: 'C', color: '#10b981' }
  ]);

  const [queryPoint, setQueryPoint] = useState({ x: 250, y: 150 });
  const [k, setK] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeClass, setActiveClass] = useState('A');
  const [distances, setDistances] = useState([]);
  const [nearestNeighbors, setNearestNeighbors] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [showDistances, setShowDistances] = useState(false);
  const [distanceMetric, setDistanceMetric] = useState('euclidean');
  const svgRef = useRef(null);

  const classes = [
    { name: 'A', color: '#3b82f6', label: 'Class A' },
    { name: 'B', color: '#ef4444', label: 'Class B' },
    { name: 'C', color: '#10b981', label: 'Class C' }
  ];

  // Calculate distance between two points
  const calculateDistance = useCallback((p1, p2, metric = 'euclidean') => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;

    switch (metric) {
      case 'euclidean':
        return Math.sqrt(dx * dx + dy * dy);
      case 'manhattan':
        return Math.abs(dx) + Math.abs(dy);
      case 'chebyshev':
        return Math.max(Math.abs(dx), Math.abs(dy));
      default:
        return Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  // Calculate all distances and find nearest neighbors
  const calculateDistances = useCallback(() => {
    const calculatedDistances = points.map(point => ({
      ...point,
      distance: calculateDistance(point, queryPoint, distanceMetric)
    })).sort((a, b) => a.distance - b.distance);

    setDistances(calculatedDistances);

    const nearest = calculatedDistances.slice(0, k);
    setNearestNeighbors(nearest);

    // Make prediction based on majority vote
    const classCounts = {};
    nearest.forEach(neighbor => {
      classCounts[neighbor.class] = (classCounts[neighbor.class] || 0) + 1;
    });

    const predictedClass = Object.entries(classCounts).reduce((a, b) =>
      classCounts[a[0]] > classCounts[b[0]] ? a : b
    )[0];

    const confidence = classCounts[predictedClass] / k;

    setPrediction({
      class: predictedClass,
      confidence: confidence,
      votes: classCounts
    });
  }, [points, queryPoint, k, calculateDistance, distanceMetric]);

  // Recalculate when dependencies change
  useEffect(() => {
    calculateDistances();
  }, [calculateDistances]);

  // Animation steps for the algorithm
  const algorithmSteps = React.useMemo(() => [
    {
      step: 0,
      title: "Select Query Point",
      description: "Choose the point we want to classify (yellow point with '?')",
      visualCues: "Query point is highlighted",
      highlight: 'query'
    },
    {
      step: 1,
      title: "Calculate Distances",
      description: `Calculate ${distanceMetric} distance from query point to all training points`,
      visualCues: "Yellow lines appear, points pulse with golden borders",
      highlight: 'distances'
    },
    {
      step: 2,
      title: "Sort & Rank by Distance",
      description: "Sort all points by distance. Green borders = top K, Red borders = others",
      visualCues: "Points show rank numbers (#1, #2, etc.), green/red color coding",
      highlight: 'sorted'
    },
    {
      step: 3,
      title: `Select K=${k} Nearest`,
      description: `Select only the ${k} closest neighbors (thick black borders, pulse animation)`,
      visualCues: "Only K nearest neighbors highlighted, others fade out",
      highlight: 'neighbors'
    },
    {
      step: 4,
      title: "Majority Vote",
      description: "Each neighbor votes for their class. Majority class wins!",
      visualCues: "Blue borders on voters, 'VOTE' labels, prediction circle appears",
      highlight: 'prediction'
    }
  ], [k, distanceMetric]);

  // Start step-by-step animation
  const startAnimation = useCallback(() => {
    if (points.length === 0) return;
    setCurrentStep(0);
    setIsAnimating(true);
    setShowDistances(false);
  }, [points.length]);

  const nextStep = useCallback(() => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(prev => {
        const newStep = prev + 1;
        if (newStep === 1) setShowDistances(true);
        return newStep;
      });
    } else {
      setIsAnimating(false);
      setCurrentStep(0);
    }
  }, [currentStep, algorithmSteps.length]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    setCurrentStep(0);
    setShowDistances(false);
  }, []);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => {
        const newStep = prev - 1;
        // Hide distances when going back to step 0
        if (newStep === 0) setShowDistances(false);
        return newStep;
      });
    }
  }, [currentStep]);

  const toggleDistances = useCallback(() => {
    setShowDistances(prev => !prev);
  }, []);

  // Handle SVG clicks to add points or move query point
  const handleSvgClick = (event) => {
    if (isAnimating) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (event.shiftKey) {
      // Shift+click to move query point
      setQueryPoint({ x, y });
    } else {
      // Regular click to add training point
      const newPoint = {
        id: Date.now(),
        x,
        y,
        class: activeClass,
        color: classes.find(c => c.name === activeClass).color
      };
      setPoints([...points, newPoint]);
    }
  };

  // Remove a point
  const removePoint = (pointId) => {
    if (isAnimating) return;
    setPoints(points.filter(p => p.id !== pointId));
  };

  // Clear all points
  const clearPoints = () => {
    if (isAnimating) return;
    setPoints([]);
  };

  // Reset to default points
  const resetPoints = () => {
    if (isAnimating) return;
    setPoints([
      { id: 1, x: 150, y: 100, class: 'A', color: '#3b82f6' },
      { id: 2, x: 200, y: 120, class: 'A', color: '#3b82f6' },
      { id: 3, x: 180, y: 80, class: 'A', color: '#3b82f6' },
      { id: 4, x: 350, y: 150, class: 'B', color: '#ef4444' },
      { id: 5, x: 320, y: 180, class: 'B', color: '#ef4444' },
      { id: 6, x: 380, y: 140, class: 'B', color: '#ef4444' },
      { id: 7, x: 250, y: 250, class: 'C', color: '#10b981' },
      { id: 8, x: 280, y: 220, class: 'C', color: '#10b981' },
      { id: 9, x: 220, y: 280, class: 'C', color: '#10b981' }
    ]);
    setQueryPoint({ x: 250, y: 150 });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white border rounded-lg p-4">
        <div className="grid md:grid-cols-4 gap-4">
          {/* K Value Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              K Value: {k}
            </label>
            <input
              type="range"
              min="1"
              max={Math.min(15, points.length)}
              value={k}
              onChange={(e) => setK(parseInt(e.target.value))}
              disabled={isAnimating}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">1 to {Math.min(15, points.length)}</div>
          </div>

          {/* Distance Metric */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance Metric
            </label>
            <select
              value={distanceMetric}
              onChange={(e) => setDistanceMetric(e.target.value)}
              disabled={isAnimating}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="euclidean">Euclidean</option>
              <option value="manhattan">Manhattan</option>
              <option value="chebyshev">Chebyshev</option>
            </select>
          </div>

          {/* Active Class for Adding Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Points (Class)
            </label>
            <div className="flex space-x-2">
              {classes.map(cls => (
                <button
                  key={cls.name}
                  onClick={() => setActiveClass(cls.name)}
                  disabled={isAnimating}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    activeClass === cls.name
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: cls.color }}
                  title={`Add ${cls.label} points`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions
            </label>
            <div className="flex space-x-2">
              <button
                onClick={resetPoints}
                disabled={isAnimating}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={clearPoints}
                disabled={isAnimating || points.length === 0}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-step Animation Controls */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-indigo-800">KNN Algorithm Steps</h3>
          <div className="flex space-x-2">
            {!isAnimating ? (
              <button
                onClick={startAnimation}
                disabled={points.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Start Demo
              </button>
            ) : (
              <button
                onClick={stopAnimation}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Stop Demo
              </button>
            )}
            <button
              onClick={toggleDistances}
              disabled={points.length === 0}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {showDistances ? 'Hide' : 'Show'} Distances
            </button>
          </div>
        </div>

        {isAnimating && algorithmSteps.length > 0 && (
          <div>
            <div className="flex justify-between mb-4">
              {algorithmSteps.map((step, idx) => (
                <div key={idx} className={`text-center flex-1 ${idx <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold ${
                    idx <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              ))}
            </div>

            {algorithmSteps[currentStep] && (
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-2">
                  Step {currentStep + 1}: {algorithmSteps[currentStep].title}
                </h5>
                <p className="text-sm text-indigo-700 mb-2">{algorithmSteps[currentStep].description}</p>

                <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                  <h6 className="text-xs font-semibold text-indigo-800 mb-1">Visual Cues:</h6>
                  <p className="text-xs text-indigo-600">{algorithmSteps[currentStep].visualCues}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 hover:bg-gray-600"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStep >= algorithmSteps.length}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {currentStep < algorithmSteps.length - 1 ? 'Next →' : 'Finish'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-4">Interactive Visualization</h4>
            <div className="mb-4 text-sm text-gray-600">
              <p>• <strong>Click:</strong> Add training point (current class: <span style={{ color: classes.find(c => c.name === activeClass).color }}>{activeClass}</span>)</p>
              <p>• <strong>Shift+Click:</strong> Move query point</p>
              <p>• <strong>Double-click point:</strong> Remove it</p>
            </div>

            <svg
              ref={svgRef}
              width="500"
              height="350"
              viewBox="0 0 500 350"
              className="border border-gray-300 rounded cursor-crosshair"
              onClick={handleSvgClick}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Distance circles for query point */}
              {showDistances && nearestNeighbors && nearestNeighbors.length > 0 && nearestNeighbors.map((neighbor, idx) => {
                if (!neighbor || typeof neighbor.distance !== 'number' || neighbor.distance <= 0) return null;
                return (
                  <circle
                    key={`circle-${neighbor.id}-${idx}`}
                    cx={queryPoint.x}
                    cy={queryPoint.y}
                    r={Math.min(neighbor.distance, 300)} // Limit circle size
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    opacity="0.3"
                  />
                );
              })}

              {/* Distance lines - Step 1: Show all distances, Step 3+: Show only K nearest */}
              {(showDistances || (isAnimating && currentStep >= 1)) && distances && distances.length > 0 && (() => {
                let linesToShow;
                if (isAnimating) {
                  if (currentStep === 1 || currentStep === 2) {
                    // Step 1-2: Show all distances
                    linesToShow = distances;
                  } else {
                    // Step 3+: Show only K nearest
                    linesToShow = distances.slice(0, k);
                  }
                } else {
                  linesToShow = distances.slice(0, k);
                }

                return linesToShow.map((point, idx) => {
                  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') return null;

                  // Different styling based on step
                  let strokeColor = "#6b7280";
                  let strokeWidth = "1";
                  let opacity = 0.6;

                  if (isAnimating) {
                    if (currentStep === 1) {
                      // Step 1: All lines same style (calculating distances)
                      strokeColor = "#fbbf24";
                      opacity = 0.8;
                    } else if (currentStep === 2) {
                      // Step 2: Color code by distance rank
                      if (idx < k) {
                        strokeColor = "#10b981"; // Green for top K
                        strokeWidth = "2";
                        opacity = 0.9;
                      } else {
                        strokeColor = "#ef4444"; // Red for others
                        opacity = 0.4;
                      }
                    } else if (currentStep >= 3) {
                      // Step 3+: Only K nearest, bold
                      strokeColor = "#3b82f6";
                      strokeWidth = "3";
                      opacity = 1;
                    }
                  }

                  return (
                    <line
                      key={`line-${point.id}-${idx}`}
                      x1={queryPoint.x}
                      y1={queryPoint.y}
                      x2={point.x}
                      y2={point.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray="3,3"
                      opacity={opacity}
                    />
                  );
                });
              })()}

              {/* Training points */}
              {points && points.length > 0 && points.map((point, pointIdx) => {
                if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') return null;

                const isNeighbor = nearestNeighbors && nearestNeighbors.some(n => n && n.id === point.id);
                const distanceRank = distances.findIndex(d => d.id === point.id);
                const isInTopK = distanceRank < k;

                // Determine visual style based on current step
                let pointRadius = 6;
                let strokeColor = "#fff";
                let strokeWidth = 2;
                let pointOpacity = 1;
                let pulseAnimation = false;

                if (isAnimating) {
                  switch (currentStep) {
                    case 0:
                      // Step 0: Normal state
                      pointOpacity = 0.8;
                      break;
                    case 1:
                      // Step 1: Calculating distances - slight glow
                      strokeColor = "#fbbf24";
                      strokeWidth = 2;
                      pulseAnimation = true;
                      break;
                    case 2:
                      // Step 2: Sorting - color code by rank
                      if (isInTopK) {
                        strokeColor = "#10b981"; // Green border for top K
                        strokeWidth = 3;
                        pointRadius = 7;
                      } else {
                        strokeColor = "#ef4444"; // Red border for others
                        pointOpacity = 0.5;
                      }
                      break;
                    case 3:
                      // Step 3: Select K nearest - highlight only neighbors
                      if (isNeighbor) {
                        strokeColor = "#000";
                        strokeWidth = 4;
                        pointRadius = 9;
                        pulseAnimation = true;
                      } else {
                        pointOpacity = 0.3;
                      }
                      break;
                    case 4:
                      // Step 4: Voting - show voting visualization
                      if (isNeighbor) {
                        strokeColor = "#3b82f6";
                        strokeWidth = 3;
                        pointRadius = 8;
                      } else {
                        pointOpacity = 0.2;
                      }
                      break;
                  }
                } else {
                  // Not animating - show final state
                  if (isNeighbor) {
                    strokeColor = "#000";
                    strokeWidth = 3;
                    pointRadius = 8;
                  }
                }

                return (
                  <g key={`point-${point.id}`}>
                    {/* Pulse animation for certain steps */}
                    {pulseAnimation && (
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={pointRadius + 5}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="1"
                        opacity="0.3"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={pointRadius}
                      fill={point.color || '#6b7280'}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      opacity={pointOpacity}
                      className="cursor-pointer hover:stroke-black hover:stroke-2 transition-all duration-300"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        removePoint(point.id);
                      }}
                    />

                    <text
                      x={point.x}
                      y={point.y + 4}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill="white"
                      className="pointer-events-none"
                      opacity={pointOpacity}
                    >
                      {point.class || '?'}
                    </text>

                    {/* Distance labels */}
                    {(showDistances || (isAnimating && currentStep >= 1)) && point.distance && (
                      <text
                        x={point.x + 15}
                        y={point.y - 10}
                        fontSize="10"
                        fill="#374151"
                        className="pointer-events-none"
                        opacity={pointOpacity}
                      >
                        {point.distance.toFixed(1)}
                      </text>
                    )}

                    {/* Rank numbers for step 2 */}
                    {isAnimating && currentStep === 2 && distanceRank >= 0 && (
                      <text
                        x={point.x - 15}
                        y={point.y - 10}
                        fontSize="12"
                        fontWeight="bold"
                        fill={isInTopK ? "#10b981" : "#ef4444"}
                        className="pointer-events-none"
                      >
                        #{distanceRank + 1}
                      </text>
                    )}

                    {/* Vote indicators for step 4 */}
                    {isAnimating && currentStep === 4 && isNeighbor && (
                      <text
                        x={point.x}
                        y={point.y - 15}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#3b82f6"
                        className="pointer-events-none"
                      >
                        VOTE
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Query point */}
              <g>
                <circle
                  cx={queryPoint.x}
                  cy={queryPoint.y}
                  r="10"
                  fill="#fbbf24"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  className="cursor-move"
                />
                <text
                  x={queryPoint.x}
                  y={queryPoint.y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="white"
                  className="pointer-events-none"
                >
                  ?
                </text>
              </g>

              {/* Prediction result */}
              {prediction && (isAnimating && currentStep >= 4 || !isAnimating) && (
                <g>
                  <circle
                    cx={queryPoint.x}
                    cy={queryPoint.y}
                    r="15"
                    fill="none"
                    stroke={classes.find(c => c.name === prediction.class)?.color}
                    strokeWidth="4"
                    strokeDasharray="8,4"
                    className={isAnimating && currentStep === 4 ? 'animate-pulse' : ''}
                  />
                  <text
                    x={queryPoint.x + 20}
                    y={queryPoint.y - 15}
                    fontSize="14"
                    fontWeight="bold"
                    fill={classes.find(c => c.name === prediction.class)?.color}
                    className="pointer-events-none"
                  >
                    Predicted: {prediction.class}
                  </text>

                  {/* Vote summary for step 4 */}
                  {isAnimating && currentStep === 4 && (
                    <text
                      x={queryPoint.x + 20}
                      y={queryPoint.y + 5}
                      fontSize="12"
                      fill="#374151"
                      className="pointer-events-none"
                    >
                      ({prediction.votes[prediction.class]}/{k} votes)
                    </text>
                  )}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Current Parameters */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-3">Current Setup</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>K Value:</span>
                <span className="font-bold">{k}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="font-bold capitalize">{distanceMetric}</span>
              </div>
              <div className="flex justify-between">
                <span>Training Points:</span>
                <span className="font-bold">{points.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Query Point:</span>
                <span className="font-bold">({queryPoint.x.toFixed(0)}, {queryPoint.y.toFixed(0)})</span>
              </div>
            </div>
          </div>

          {/* Distance Rankings */}
          {points.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3">Distance Rankings</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {distances.slice(0, 10).map((point, idx) => {
                  const isNeighbor = idx < k;
                  return (
                    <div
                      key={point.id}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        isNeighbor ? 'bg-indigo-100 border border-indigo-300' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-600">#{idx + 1}</span>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: point.color }}
                        />
                        <span className="font-medium">Class {point.class}</span>
                      </div>
                      <span className="font-mono text-gray-700">
                        {point.distance.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prediction Results */}
          {prediction && points.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3">Prediction Results</h4>

              <div className="mb-4">
                <div className="text-center p-3 rounded-lg" style={{
                  backgroundColor: `${classes.find(c => c.name === prediction.class)?.color}20`,
                  border: `2px solid ${classes.find(c => c.name === prediction.class)?.color}`
                }}>
                  <div className="text-lg font-bold" style={{
                    color: classes.find(c => c.name === prediction.class)?.color
                  }}>
                    Class {prediction.class}
                  </div>
                  <div className="text-sm text-gray-600">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold mb-2">Vote Breakdown:</h5>
                {Object.entries(prediction.votes).map(([cls, votes]) => (
                  <div key={cls} className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: classes.find(c => c.name === cls)?.color }}
                      />
                      <span className="text-sm">Class {cls}</span>
                    </div>
                    <span className="text-sm font-bold">{votes}/{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-3">Legend</h4>
            <div className="space-y-2">
              {classes.map(cls => (
                <div key={cls.name} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: cls.color }}
                  />
                  <span className="text-sm">{cls.label}</span>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-500" />
                <span className="text-sm">Query Point</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border-2 border-black" />
                <span className="text-sm">Selected Neighbors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Documentation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Understanding K-Nearest Neighbors</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">🔑 Core Algorithm</h3>

              <div className="space-y-4">
                <div className="bg-white border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-800 mb-2">How KNN Works</h4>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Given a query point to classify</li>
                    <li>Calculate distance to all training points</li>
                    <li>Sort points by distance (ascending)</li>
                    <li>Select the K nearest neighbors</li>
                    <li>Vote: majority class wins</li>
                  </ol>
                </div>

                <div className="bg-white border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-800 mb-2">Distance Metrics</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div>
                      <strong>Euclidean:</strong> √[(x₂-x₁)² + (y₂-y₁)²]
                      <div className="text-xs text-gray-500">Standard "straight line" distance</div>
                    </div>
                    <div>
                      <strong>Manhattan:</strong> |x₂-x₁| + |y₂-y₁|
                      <div className="text-xs text-gray-500">Sum of absolute differences</div>
                    </div>
                    <div>
                      <strong>Chebyshev:</strong> max(|x₂-x₁|, |y₂-y₁|)
                      <div className="text-xs text-gray-500">Maximum difference in any dimension</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-800 mb-2">Choosing K</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>K=1:</strong> Sensitive to noise</li>
                    <li>• <strong>Small K:</strong> More complex decision boundary</li>
                    <li>• <strong>Large K:</strong> Smoother, more general</li>
                    <li>• <strong>Odd K:</strong> Avoids ties in binary classification</li>
                    <li>• <strong>Rule of thumb:</strong> K = √n (n = training samples)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">📊 Algorithm Analysis</h3>

              <div className="space-y-4">
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Time Complexity</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><strong>Training:</strong> O(1) - no explicit training phase</div>
                    <div><strong>Prediction:</strong> O(n × d) per query</div>
                    <div className="text-xs text-gray-500">
                      n = training samples, d = dimensions
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Space Complexity</h4>
                  <div className="text-sm text-gray-700">
                    <div><strong>Storage:</strong> O(n × d)</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Must store all training data
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Pros & Cons</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <h5 className="font-semibold text-green-700 mb-1">✅ Advantages</h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Simple to understand</li>
                        <li>• No training required</li>
                        <li>• Works with any distance metric</li>
                        <li>• Naturally handles multi-class</li>
                        <li>• Non-parametric</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-700 mb-1">❌ Disadvantages</h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Computationally expensive</li>
                        <li>• Sensitive to irrelevant features</li>
                        <li>• Requires feature scaling</li>
                        <li>• Poor with high dimensions</li>
                        <li>• Sensitive to local structure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Considerations */}
          <div className="mt-8 pt-6 border-t border-indigo-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🛠️ Practical Considerations</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Feature Scaling</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Always normalize features to same scale
                </p>
                <div className="text-xs bg-gray-50 p-2 rounded">
                  <strong>Why?</strong> Distance dominated by large-scale features
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Curse of Dimensionality</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Performance degrades in high dimensions
                </p>
                <div className="text-xs bg-gray-50 p-2 rounded">
                  <strong>Solution:</strong> Dimensionality reduction (PCA, etc.)
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Efficiency</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Use approximate methods for large datasets
                </p>
                <div className="text-xs bg-gray-50 p-2 rounded">
                  <strong>Examples:</strong> KD-trees, LSH, Approximate NN
                </div>
              </div>
            </div>
          </div>

          {/* Real-world Applications */}
          <div className="mt-8 pt-6 border-t border-indigo-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🌍 Real-World Applications</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🛒 Recommendation Systems</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Product recommendations</li>
                  <li>• Content-based filtering</li>
                  <li>• "Customers who bought X also bought Y"</li>
                  <li>• Similar user preferences</li>
                </ul>
              </div>

              <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🏥 Medical Diagnosis</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Disease classification</li>
                  <li>• Drug discovery</li>
                  <li>• Patient similarity analysis</li>
                  <li>• Genomic data analysis</li>
                </ul>
              </div>

              <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">🖼️ Image & Text</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Image classification</li>
                  <li>• Handwriting recognition</li>
                  <li>• Spam detection</li>
                  <li>• Document similarity</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="mt-8 pt-6 border-t border-indigo-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Best Practices</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-indigo-700 mb-3">✅ Do's</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Use cross-validation to find optimal K</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Normalize/standardize all features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Remove irrelevant features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Use odd K for binary classification</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Consider weighted voting by distance</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-red-700 mb-3">❌ Don'ts</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Don't use raw features with different scales</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Don't use K=n (all points as neighbors)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Don't ignore computational complexity</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Don't use with high-dimensional sparse data</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Don't assume Euclidean distance is always best</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KNearestNeighbors;