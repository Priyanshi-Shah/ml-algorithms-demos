// src/components/algorithms/KMeans/StandardKMeans.js
import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function StandardKMeans() {
  const [points, setPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [k, setK] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [converged, setConverged] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [cursorTooltip, setCursorTooltip] = useState({ show: false, x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [newestPointId, setNewestPointId] = useState(null);

  // Colors for different clusters
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  // Initialize random points
  const generateRandomPoints = (count = 50) => {
    const newPoints = [];
    for (let i = 0; i < count; i++) {
      // Create some natural clusters
      const cluster = Math.floor(Math.random() * 3);
      const baseX = cluster === 0 ? 3 : cluster === 1 ? 7 : 11;
      const baseY = cluster === 0 ? 8 : cluster === 1 ? 3 : 9;
      
      newPoints.push({
        x: Math.max(1, Math.min(14, baseX + (Math.random() - 0.5) * 4)),
        y: Math.max(1, Math.min(14, baseY + (Math.random() - 0.5) * 4)),
        cluster: -1,
        id: i
      });
    }
    setPoints(newPoints);
    setNewestPointId(null); // Clear newest point tracking when generating new dataset
  };

  // Initialize random centroids
  const initializeCentroids = () => {
    const newCentroids = [];
    for (let i = 0; i < k; i++) {
      newCentroids.push({
        x: Math.random() * 12 + 1,
        y: Math.random() * 12 + 1,
        id: i,
        color: colors[i % colors.length]
      });
    }
    setCentroids(newCentroids);
    setIteration(0);
    setConverged(false);
  };

  // Calculate distance between two points
  const distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  // Assign points to nearest centroids
  const assignPointsToClusters = () => {
    return points.map(point => {
      let minDistance = Infinity;
      let nearestCluster = -1;

      centroids.forEach((centroid, index) => {
        const dist = distance(point, centroid);
        if (dist < minDistance) {
          minDistance = dist;
          nearestCluster = index;
        }
      });

      return { ...point, cluster: nearestCluster };
    });
  };

  // Update centroids based on assigned points
  const updateCentroids = (assignedPoints) => {
    return centroids.map((centroid, index) => {
      const clusterPoints = assignedPoints.filter(point => point.cluster === index);
      
      if (clusterPoints.length === 0) {
        return centroid; // Keep centroid if no points assigned
      }

      const newX = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
      const newY = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;

      return { ...centroid, x: newX, y: newY };
    });
  };

  // Check if centroids have converged
  const checkConvergence = (oldCentroids, newCentroids) => {
    const threshold = 0.01;
    return oldCentroids.every((oldCentroid, index) => {
      const newCentroid = newCentroids[index];
      return distance(oldCentroid, newCentroid) < threshold;
    });
  };

  // One step of K-means algorithm
  const stepKMeans = () => {
    if (converged) return;

    const assignedPoints = assignPointsToClusters();
    const newCentroids = updateCentroids(assignedPoints);
    
    const hasConverged = checkConvergence(centroids, newCentroids);
    
    setPoints(assignedPoints);
    setCentroids(newCentroids);
    setIteration(prev => prev + 1);
    setConverged(hasConverged);
    setNewestPointId(null); // Clear newest point tracking when algorithm runs

    if (hasConverged) {
      setIsRunning(false);
    }
  };

  // Auto-run K-means
  useEffect(() => {
    if (isRunning && !converged && centroids.length > 0) {
      const timer = setTimeout(stepKMeans, speed);
      return () => clearTimeout(timer);
    }
  }, [isRunning, converged, points, centroids, speed]);

  // Generate chart data
  const generateChartData = () => {
    const allData = [];

    // Add points
    points.forEach(point => {
      let fillColor;
      if (point.id === newestPointId) {
        // Newest point is always baby pink until algorithm runs
        fillColor = '#FFB6C1';
      } else if (point.cluster >= 0) {
        // Assigned points use cluster colors
        fillColor = colors[point.cluster % colors.length];
      } else {
        // Other unassigned points use gray
        fillColor = '#6B7280';
      }
      
      allData.push({
        x: point.x,
        y: point.y,
        type: 'point',
        cluster: point.cluster,
        fill: fillColor
      });
    });

    // Add centroids
    centroids.forEach(centroid => {
      allData.push({
        x: centroid.x,
        y: centroid.y,
        type: 'centroid',
        cluster: centroid.id,
        fill: centroid.color
      });
    });

    return allData;
  };

  const chartData = generateChartData();
  const pointData = chartData.filter(d => d.type === 'point');
  const centroidData = chartData.filter(d => d.type === 'centroid');

  // Add point at position
  const addPointAtPosition = (x, y) => {
    const newPointId = Date.now(); // Use timestamp as unique ID
    const newPoint = {
      x: Math.max(1, Math.min(14, Math.round(x * 2) / 2)),
      y: Math.max(1, Math.min(14, Math.round(y * 2) / 2)),
      cluster: -1,
      id: newPointId
    };
    setPoints(prev => [...prev, newPoint]);
    setNewestPointId(newPointId); // Track the newest point
    setConverged(false); // Reset convergence when adding new points
  };

  // Add random point
  const addRandomPoint = () => {
    const newX = Math.round((Math.random() * 12 + 1) * 2) / 2;
    const newY = Math.round((Math.random() * 12 + 1) * 2) / 2;
    addPointAtPosition(newX, newY);
  };

  // Preset datasets
  const loadPreset = (preset) => {
    let newPoints = [];
    
    switch(preset) {
      case 'circles':
        // Three circular clusters
        for (let cluster = 0; cluster < 3; cluster++) {
          const centerX = cluster === 0 ? 4 : cluster === 1 ? 10 : 7;
          const centerY = cluster === 0 ? 4 : cluster === 1 ? 4 : 10;
          
          for (let i = 0; i < 15; i++) {
            const angle = (Math.random() * 2 * Math.PI);
            const radius = Math.random() * 2;
            newPoints.push({
              x: Math.max(1, Math.min(13, centerX + Math.cos(angle) * radius)),
              y: Math.max(1, Math.min(13, centerY + Math.sin(angle) * radius)),
              cluster: -1,
              id: newPoints.length
            });
          }
        }
        break;
      
      case 'elongated':
        // Two elongated clusters
        for (let i = 0; i < 25; i++) {
          newPoints.push({
            x: Math.random() * 6 + 1,
            y: Math.random() * 2 + 6,
            cluster: -1,
            id: i
          });
        }
        for (let i = 0; i < 25; i++) {
          newPoints.push({
            x: Math.random() * 6 + 7,
            y: Math.random() * 2 + 3,
            cluster: -1,
            id: i + 25
          });
        }
        break;
      
      default:
        generateRandomPoints(50);
        return;
    }
    
    setPoints(newPoints);
    setNewestPointId(null); // Clear newest point tracking when loading presets
  };

  // Custom dot components
  const CustomPointDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={payload.fill}
        stroke="#fff"
        strokeWidth={1}
        opacity={0.8}
      />
    );
  };

  const CustomCentroidDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill={payload.fill}
          stroke="#000"
          strokeWidth={2}
        />
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="#fff"
        />
      </g>
    );
  };

  // Initialize on mount
  useEffect(() => {
    generateRandomPoints(50);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800">Clustering Visualization</h3>
                <button
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="text-blue-600 hover:text-blue-800 text-lg"
                >
                  ℹ️
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Iteration: {iteration}</span>
                {converged && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    CONVERGED
                  </span>
                )}
              </div>
            </div>
            
            {showTooltip && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                💡 <strong>How to use:</strong> Click anywhere on the graph to add data points! 
                Watch how the K-means algorithm groups your points into clusters.
              </div>
            )}

            <div 
              className="relative cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left - 20) / (rect.width - 40)) * 15;
                const y = 15 - ((e.clientY - rect.top - 20) / (rect.height - 40)) * 15;
                if (x >= 0 && x <= 15 && y >= 0 && y <= 15) {
                  addPointAtPosition(x, y);
                }
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCursorTooltip({
                  show: true,
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top
                });
              }}
              onMouseLeave={() => {
                setCursorTooltip({ show: false, x: 0, y: 0 });
              }}
            >
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    domain={[0, 15]} 
                    label={{ value: 'X Coordinate', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y"
                    domain={[0, 15]}
                    label={{ value: 'Y Coordinate', angle: -90, position: 'insideLeft' }}
                  />
                  
                  {/* Data Points */}
                  <Scatter 
                    data={pointData} 
                    dot={<CustomPointDot />}
                  />
                  
                  {/* Centroids */}
                  <Scatter 
                    data={centroidData} 
                    dot={<CustomCentroidDot />}
                  />
                </ScatterChart>
              </ResponsiveContainer>
              
              {/* Cursor tooltip */}
              {cursorTooltip.show && (
                <div 
                  className="absolute pointer-events-none bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
                  style={{
                    left: cursorTooltip.x + 10,
                    top: cursorTooltip.y - 30,
                    transform: cursorTooltip.x > 400 ? 'translateX(-100%)' : 'none'
                  }}
                >
                  ➕ Add data point
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={converged || centroids.length === 0}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  isRunning 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRunning ? '⏸️ Pause' : '▶️ Run Algorithm'}
              </button>

              <button
                onClick={stepKMeans}
                disabled={converged || centroids.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                ⚡ Step Once
              </button>

              <button
                onClick={initializeCentroids}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                🔄 Reset Centroids
              </button>

              <button
                onClick={addRandomPoint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                ➕ Add Point
              </button>

              <button
                onClick={() => generateRandomPoints(50)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                🔄 New Dataset
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => loadPreset('circles')}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Circular Clusters
              </button>
              <button
                onClick={() => loadPreset('elongated')}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Elongated Clusters
              </button>
              <button
                onClick={() => generateRandomPoints(50)}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Random Data
              </button>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              ⚙️ Settings
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Clusters (K): {k}
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={k}
                  onChange={(e) => {
                    setK(parseInt(e.target.value));
                    setIsRunning(false);
                    setConverged(false);
                  }}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animation Speed: {speed}ms
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-purple-800 mb-3">Algorithm Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-700">Iterations:</span>
                <span className="font-semibold">{iteration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Data Points:</span>
                <span className="font-semibold">{points.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Clusters (K):</span>
                <span className="font-semibold">{k}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Status:</span>
                <span className={`font-semibold ${converged ? 'text-green-600' : isRunning ? 'text-orange-600' : 'text-gray-600'}`}>
                  {converged ? 'Converged' : isRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: '#FFB6C1' }}></div>
                <span className="text-sm">Newest Point</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500 border border-white"></div>
                <span className="text-sm">Unassigned Points</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border border-white"></div>
                <span className="text-sm">Clustered Points</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-black flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span className="text-sm">Centroids</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                The newest point stays baby pink until the algorithm runs. Colors represent different clusters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive K-Means Explanation */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h4 className="text-2xl font-bold text-gray-800 mb-6">Understanding K-Means Clustering</h4>
        
        {/* What is K-Means */}
        <div className="mb-6">
          <h5 className="text-lg font-semibold text-purple-800 mb-3">🎯 What is K-Means Clustering?</h5>
          <p className="text-gray-700 mb-3">
            Imagine walking into a vegetable shop where all vegetables are scattered randomly. K-means clustering is like <strong>organizing these vegetables into groups</strong> - 
            carrots with carrots, potatoes with potatoes. It automatically finds natural groupings in your data without being told what to look for.
          </p>
          <p className="text-gray-700">
            It's an <strong>unsupervised learning</strong> algorithm, meaning it discovers hidden patterns in data without needing examples of "correct" answers.
          </p>
        </div>

        {/* The Algorithm Steps */}
        <div className="mb-6">
          <h5 className="text-lg font-semibold text-purple-800 mb-3">⚙️ How Does K-Means Work?</h5>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
              <div className="text-center mb-2">
                <span className="inline-block w-8 h-8 bg-purple-500 text-white rounded-full text-sm font-bold leading-8">1</span>
              </div>
              <h6 className="font-semibold text-gray-800 mb-2">Choose K</h6>
              <p className="text-sm text-gray-600">Decide how many groups (clusters) you want. This is the "K" in K-means.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
              <div className="text-center mb-2">
                <span className="inline-block w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold leading-8">2</span>
              </div>
              <h6 className="font-semibold text-gray-800 mb-2">Place Centers</h6>
              <p className="text-sm text-gray-600">Randomly place K "centroids" (cluster centers) in your data space.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
              <div className="text-center mb-2">
                <span className="inline-block w-8 h-8 bg-green-500 text-white rounded-full text-sm font-bold leading-8">3</span>
              </div>
              <h6 className="font-semibold text-gray-800 mb-2">Assign Points</h6>
              <p className="text-sm text-gray-600">Each data point joins the nearest centroid's group (shortest distance).</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400">
              <div className="text-center mb-2">
                <span className="inline-block w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold leading-8">4</span>
              </div>
              <h6 className="font-semibold text-gray-800 mb-2">Move Centers</h6>
              <p className="text-sm text-gray-600">Move each centroid to the middle (average) of its assigned points.</p>
            </div>
          </div>
          <div className="mt-4 bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>🔄 Repeat steps 3-4</strong> until centroids stop moving much. This means the algorithm has found stable, natural groupings!
            </p>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mb-6">
          <h5 className="text-lg font-semibold text-purple-800 mb-3">📊 Key Concepts</h5>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <h6 className="font-semibold text-gray-800 text-sm mb-1">Centroids</h6>
              <p className="text-xs text-gray-600">The "center" of each cluster. Think of it as the group's representative point.</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <h6 className="font-semibold text-gray-800 text-sm mb-1">Distance</h6>
              <p className="text-xs text-gray-600">Usually Euclidean (straight-line) distance. Points join the closest centroid.</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <h6 className="font-semibold text-gray-800 text-sm mb-1">Convergence</h6>
              <p className="text-xs text-gray-600">When centroids barely move between iterations - clusters are stable.</p>
            </div>
          </div>
        </div>

        {/* Real World Applications */}
        <div className="mb-6">
          <h5 className="text-lg font-semibold text-purple-800 mb-3">🌍 Real-World Applications</h5>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>🛒 Customer Segmentation:</strong> Group customers by buying behavior</li>
                <li><strong>🧬 Biology:</strong> Classify gene sequences, species grouping</li>
                <li><strong>🖼️ Image Processing:</strong> Color quantization, image compression</li>
                <li><strong>📊 Market Research:</strong> Survey response patterns</li>
              </ul>
            </div>
            <div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>🌐 Social Networks:</strong> Community detection, friend groups</li>
                <li><strong>🏥 Healthcare:</strong> Patient risk groups, treatment responses</li>
                <li><strong>📍 Geography:</strong> City planning, delivery route optimization</li>
                <li><strong>🎵 Music:</strong> Song recommendation, genre classification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Choosing K */}
        <div className="mb-6">
          <h5 className="text-lg font-semibold text-purple-800 mb-3">🤔 How to Choose K (Number of Clusters)?</h5>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <h6 className="font-semibold text-gray-800 text-sm mb-1">Domain Knowledge</h6>
              <p className="text-xs text-gray-600">Know your data! If segmenting customers, you might want 3-5 groups.</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <h6 className="font-semibold text-gray-800 text-sm mb-1">Elbow Method</h6>
              <p className="text-xs text-gray-600">Plot error vs K. Choose where the "elbow" bends (error stops improving much).</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <h6 className="font-semibold text-gray-800 text-sm mb-1">Trial & Error</h6>
              <p className="text-xs text-gray-600">Try different K values and see which gives the most meaningful groups.</p>
            </div>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h6 className="font-semibold text-green-800 mb-2">✅ Strengths of K-Means:</h6>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Simple to understand and implement</li>
              <li>• Very fast, works well with large datasets</li>
              <li>• Guaranteed to converge (find a solution)</li>
              <li>• Works great with spherical (round) clusters</li>
            </ul>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
            <h6 className="font-semibold text-orange-800 mb-2">⚠️ Limitations:</h6>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Must choose K beforehand</li>
              <li>• Struggles with non-spherical clusters</li>
              <li>• Sensitive to initial centroid placement</li>
              <li>• Affected by outliers and different scales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandardKMeans;