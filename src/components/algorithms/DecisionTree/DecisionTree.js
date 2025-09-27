import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DecisionTree() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn' or 'predict'
  const [impurityMeasure, setImpurityMeasure] = useState('entropy');
  const [predictionInput, setPredictionInput] = useState({
    outlook: 'Sunny',
    temperature: 'Hot',
    humidity: 'High', 
    wind: 'Weak'
  });

  // Simplified tennis dataset
  const tennisDataset = [
    { id: 1, outlook: 'Sunny', temperature: 'Hot', humidity: 'High', wind: 'Weak', playTennis: 'No' },
    { id: 2, outlook: 'Sunny', temperature: 'Hot', humidity: 'High', wind: 'Strong', playTennis: 'No' },
    { id: 3, outlook: 'Overcast', temperature: 'Hot', humidity: 'High', wind: 'Weak', playTennis: 'Yes' },
    { id: 4, outlook: 'Rain', temperature: 'Mild', humidity: 'High', wind: 'Weak', playTennis: 'Yes' },
    { id: 5, outlook: 'Rain', temperature: 'Cool', humidity: 'Normal', wind: 'Weak', playTennis: 'Yes' },
    { id: 6, outlook: 'Rain', temperature: 'Cool', humidity: 'Normal', wind: 'Strong', playTennis: 'No' },
    { id: 7, outlook: 'Overcast', temperature: 'Cool', humidity: 'Normal', wind: 'Strong', playTennis: 'Yes' },
    { id: 8, outlook: 'Sunny', temperature: 'Mild', humidity: 'High', wind: 'Weak', playTennis: 'No' },
    { id: 9, outlook: 'Sunny', temperature: 'Cool', humidity: 'Normal', wind: 'Weak', playTennis: 'Yes' },
    { id: 10, outlook: 'Rain', temperature: 'Mild', humidity: 'Normal', wind: 'Weak', playTennis: 'Yes' },
    { id: 11, outlook: 'Sunny', temperature: 'Mild', humidity: 'Normal', wind: 'Strong', playTennis: 'Yes' },
    { id: 12, outlook: 'Overcast', temperature: 'Mild', humidity: 'High', wind: 'Strong', playTennis: 'Yes' },
    { id: 13, outlook: 'Overcast', temperature: 'Hot', humidity: 'Normal', wind: 'Weak', playTennis: 'Yes' },
    { id: 14, outlook: 'Rain', temperature: 'Mild', humidity: 'High', wind: 'Strong', playTennis: 'No' }
  ];

  // Calculate entropy
  const calculateEntropy = (data) => {
    if (data.length === 0) return 0;
    const yes = data.filter(d => d.playTennis === 'Yes').length;
    const no = data.filter(d => d.playTennis === 'No').length;
    const total = data.length;
    
    if (yes === 0 || no === 0) return 0;
    
    const pYes = yes / total;
    const pNo = no / total;
    return -(pYes * Math.log2(pYes) + pNo * Math.log2(pNo));
  };

  // Calculate information gain for a feature
  const calculateInformationGain = (data, feature) => {
    const totalEntropy = calculateEntropy(data);
    
    // Group by feature values
    const groups = {};
    data.forEach(item => {
      const value = item[feature];
      if (!groups[value]) groups[value] = [];
      groups[value].push(item);
    });
    
    // Calculate weighted entropy after split
    let weightedEntropy = 0;
    Object.values(groups).forEach(group => {
      const weight = group.length / data.length;
      weightedEntropy += weight * calculateEntropy(group);
    });
    
    return {
      feature,
      totalEntropy,
      weightedEntropy,
      gain: totalEntropy - weightedEntropy,
      groups
    };
  };

  // Pre-defined step-by-step tree building process for better visualization
  const buildingSteps = [
    {
      step: 0,
      title: "Start with All Data",
      description: "We begin with all 14 examples. Our goal is to predict 'Play Tennis' based on weather conditions.",
      data: tennisDataset,
      currentNode: { type: 'root', samples: 14, yesCount: 9, noCount: 5 },
      explanation: "Look at our dataset: 9 examples say 'Yes' and 5 say 'No'. The data is mixed, so we need to split it.",
      tree: { type: 'root', samples: 14, yesCount: 9, noCount: 5, entropy: calculateEntropy(tennisDataset) }
    },
    {
      step: 1,
      title: "Calculate All Possible Splits",
      description: "We test splitting on each feature (Outlook, Temperature, Humidity, Wind) to see which gives the best separation.",
      data: tennisDataset,
      allGains: ['outlook', 'temperature', 'humidity', 'wind'].map(f => calculateInformationGain(tennisDataset, f)),
      explanation: "We calculate Information Gain for each feature. Higher gain means better separation of Yes/No examples.",
      tree: { 
        type: 'root', 
        samples: 14, 
        yesCount: 9, 
        noCount: 5, 
        entropy: calculateEntropy(tennisDataset),
        feature: 'Analyzing...'
      }
    },
    {
      step: 2,
      title: "Choose Best Split: Outlook",
      description: "Outlook has the highest Information Gain, so we split on it first.",
      data: tennisDataset,
      bestSplit: calculateInformationGain(tennisDataset, 'outlook'),
      explanation: "Outlook separates our data best. Now we have 3 branches: Sunny, Overcast, and Rain.",
      tree: {
        type: 'internal',
        feature: 'outlook',
        samples: 14,
        children: {
          'Sunny': { type: 'branch', samples: 5, yesCount: 2, noCount: 3, data: tennisDataset.filter(d => d.outlook === 'Sunny') },
          'Overcast': { type: 'branch', samples: 4, yesCount: 4, noCount: 0, data: tennisDataset.filter(d => d.outlook === 'Overcast') },
          'Rain': { type: 'branch', samples: 5, yesCount: 3, noCount: 2, data: tennisDataset.filter(d => d.outlook === 'Rain') }
        }
      }
    },
    {
      step: 3,
      title: "Check Overcast Branch",
      description: "The Overcast branch has all 'Yes' examples - it's pure! This becomes a leaf node.",
      data: tennisDataset.filter(d => d.outlook === 'Overcast'),
      explanation: "When a branch has only one class (all 'Yes' or all 'No'), we stop and make it a leaf. Overcast → Always Yes!",
      tree: {
        type: 'internal',
        feature: 'outlook',
        samples: 14,
        children: {
          'Sunny': { type: 'branch', samples: 5, yesCount: 2, noCount: 3, data: tennisDataset.filter(d => d.outlook === 'Sunny') },
          'Overcast': { type: 'leaf', class: 'Yes', samples: 4, yesCount: 4, noCount: 0 },
          'Rain': { type: 'branch', samples: 5, yesCount: 3, noCount: 2, data: tennisDataset.filter(d => d.outlook === 'Rain') }
        }
      }
    },
    {
      step: 4,
      title: "Split Sunny Branch on Humidity",
      description: "Sunny branch is mixed (2 Yes, 3 No), so we need to split it further. Humidity gives the best separation.",
      data: tennisDataset.filter(d => d.outlook === 'Sunny'),
      explanation: "For Sunny days, we check remaining features. Humidity splits best: High humidity → No, Normal humidity → Yes",
      tree: {
        type: 'internal',
        feature: 'outlook',
        samples: 14,
        children: {
          'Sunny': {
            type: 'internal',
            feature: 'humidity',
            samples: 5,
            children: {
              'High': { type: 'leaf', class: 'No', samples: 3, yesCount: 0, noCount: 3 },
              'Normal': { type: 'leaf', class: 'Yes', samples: 2, yesCount: 2, noCount: 0 }
            }
          },
          'Overcast': { type: 'leaf', class: 'Yes', samples: 4, yesCount: 4, noCount: 0 },
          'Rain': { type: 'branch', samples: 5, yesCount: 3, noCount: 2, data: tennisDataset.filter(d => d.outlook === 'Rain') }
        }
      }
    },
    {
      step: 5,
      title: "Split Rain Branch on Wind",
      description: "Rain branch is mixed (3 Yes, 2 No), so we split on Wind, which perfectly separates the remaining examples.",
      data: tennisDataset.filter(d => d.outlook === 'Rain'),
      explanation: "For Rainy days: Weak wind → Yes (play), Strong wind → No (don't play). Our tree is complete!",
      tree: {
        type: 'internal',
        feature: 'outlook',
        samples: 14,
        children: {
          'Sunny': {
            type: 'internal',
            feature: 'humidity',
            samples: 5,
            children: {
              'High': { type: 'leaf', class: 'No', samples: 3, yesCount: 0, noCount: 3 },
              'Normal': { type: 'leaf', class: 'Yes', samples: 2, yesCount: 2, noCount: 0 }
            }
          },
          'Overcast': { type: 'leaf', class: 'Yes', samples: 4, yesCount: 4, noCount: 0 },
          'Rain': {
            type: 'internal',
            feature: 'wind',
            samples: 5,
            children: {
              'Weak': { type: 'leaf', class: 'Yes', samples: 3, yesCount: 3, noCount: 0 },
              'Strong': { type: 'leaf', class: 'No', samples: 2, yesCount: 0, noCount: 2 }
            }
          }
        }
      }
    }
  ];

  const currentStepData = buildingSteps[currentStep];
  const finalTree = buildingSteps[buildingSteps.length - 1].tree;

  // Prediction function
  const predictWithTree = (tree, input) => {
    const path = [];
    let current = tree;
    
    while (current.type === 'internal') {
      const featureValue = input[current.feature];
      path.push(`${current.feature}: ${featureValue}`);
      current = current.children[featureValue];
      if (!current) return { prediction: 'Unknown', path, confidence: 0 };
    }
    
    return {
      prediction: current.class,
      path,
      confidence: Math.max(current.yesCount || 0, current.noCount || 0) / current.samples
    };
  };

  const prediction = mode === 'predict' ? predictWithTree(finalTree, predictionInput) : null;

  // Enhanced Tree Visualization Component
  const TreeVisualization = ({ tree, highlightPath = [] }) => {
    const nodeWidth = 120;
    const nodeHeight = 80;
    const levelHeight = 120;

    const renderNode = (node, x, y, level = 0, path = '', isHighlighted = false) => {
      if (!node) return null;

      const isLeaf = node.type === 'leaf';
      const isCurrent = currentStep < buildingSteps.length && 
        ((currentStep <= 2 && level === 0) ||
         (currentStep === 3 && path.includes('Overcast')) ||
         (currentStep === 4 && path.includes('Sunny')) ||
         (currentStep === 5 && path.includes('Rain')));

      // Determine node color and style
      let nodeColor = '#e5e7eb'; // default gray
      let borderColor = '#9ca3af';
      let textColor = '#374151';

      if (isLeaf) {
        nodeColor = node.class === 'Yes' ? '#10b981' : '#ef4444';
        textColor = 'white';
        borderColor = node.class === 'Yes' ? '#059669' : '#dc2626';
      } else if (node.type === 'internal') {
        nodeColor = '#3b82f6';
        textColor = 'white';
        borderColor = '#2563eb';
      }

      // Highlight current step
      if (isCurrent) {
        borderColor = '#fbbf24';
        nodeColor = isLeaf ? nodeColor : '#1d4ed8';
      }

      const elements = [];

      // Node rectangle
      elements.push(
        <g key={`node-${x}-${y}`}>
          <rect
            x={x - nodeWidth/2}
            y={y - nodeHeight/2}
            width={nodeWidth}
            height={nodeHeight}
            fill={nodeColor}
            stroke={borderColor}
            strokeWidth={isCurrent ? 4 : 2}
            rx="8"
            className={isCurrent ? 'animate-pulse' : ''}
          />
          
          {/* Node content */}
          <text
            x={x}
            y={y - 10}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill={textColor}
          >
            {isLeaf ? `${node.class}!` : 
             node.feature && node.feature !== 'Analyzing...' ? node.feature : 
             node.type === 'root' ? 'All Data' : 'Node'}
          </text>
          
          <text
            x={x}
            y={y + 10}
            textAnchor="middle"
            fontSize="12"
            fill={textColor}
            opacity="0.8"
          >
            {isLeaf ? `(${node.samples} samples)` : 
             node.feature ? `Split on ${node.feature}` : 
             `(${node.samples} samples)`}
          </text>
          
          {/* Show Yes/No counts */}
          {(node.yesCount !== undefined || node.noCount !== undefined) && (
            <text
              x={x}
              y={y + 25}
              textAnchor="middle"
              fontSize="10"
              fill={textColor}
              opacity="0.7"
            >
              Yes: {node.yesCount || 0}, No: {node.noCount || 0}
            </text>
          )}
        </g>
      );

      // Render children
      if (node.children) {
        const childKeys = Object.keys(node.children);
        const childSpacing = Math.max(200, 800 / childKeys.length);
        const startX = x - (childSpacing * (childKeys.length - 1)) / 2;

        childKeys.forEach((key, index) => {
          const childX = startX + index * childSpacing;
          const childY = y + levelHeight;
          const child = node.children[key];

          // Draw edge
          elements.push(
            <g key={`edge-${x}-${y}-${childX}-${childY}`}>
              <line
                x1={x}
                y1={y + nodeHeight/2}
                x2={childX}
                y2={childY - nodeHeight/2}
                stroke="#6b7280"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
              <text
                x={(x + childX) / 2}
                y={(y + childY) / 2 - 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#1f2937"
                className="bg-white"
              >
                {key}
              </text>
            </g>
          );

          // Recursively render child
          elements.push(...renderNode(child, childX, childY, level + 1, `${path}-${key}`, isHighlighted));
        });
      }

      return elements;
    };

    return (
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
        <div className="mb-4 text-center">
          <h4 className="text-lg font-bold text-gray-800">
            {currentStep < buildingSteps.length ? `Step ${currentStep + 1}: ${currentStepData.title}` : 'Complete Decision Tree'}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {currentStep < buildingSteps.length ? currentStepData.explanation : 'Tree construction finished! Use predict mode to test it.'}
          </p>
        </div>
        
        <svg width="1000" height="400" viewBox="0 0 1000 400" className="w-full h-auto">
          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          
          {renderNode(currentStepData.tree, 500, 60)}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">🌳 Decision Tree Builder</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('learn')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'learn' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📚 Learn How It Works
            </button>
            <button
              onClick={() => setMode('predict')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'predict' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔮 Make Predictions
            </button>
          </div>
        </div>

        {mode === 'learn' && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-700">
                Building Progress: Step {currentStep + 1} of {buildingSteps.length}
              </span>
              <div className="text-sm text-blue-600">
                {Math.round(((currentStep + 1) / buildingSteps.length) * 100)}% Complete
              </div>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / buildingSteps.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                ← Previous Step
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(buildingSteps.length - 1, currentStep + 1))}
                disabled={currentStep === buildingSteps.length - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                Next Step →
              </button>
              <button
                onClick={() => setCurrentStep(buildingSteps.length - 1)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                See Final Tree
              </button>
            </div>
          </div>
        )}
      </div>

      {mode === 'learn' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tree Visualization - Main Area */}
          <div className="lg:col-span-2">
            <TreeVisualization tree={currentStepData.tree} />
            
            {/* Current Step Explanation */}
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-yellow-800">
                    What's happening in this step?
                  </h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    {currentStepData.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step Details - Sidebar */}
          <div className="space-y-4">
            {/* Current Data */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3">📋 Data in This Step</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Total Examples:</span>
                  <span className="font-bold">{currentStepData.data?.length || currentStepData.currentNode?.samples || 0}</span>
                </div>
                {currentStepData.currentNode && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-green-600">Play Tennis (Yes):</span>
                      <span className="font-bold text-green-600">{currentStepData.currentNode.yesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Don't Play (No):</span>
                      <span className="font-bold text-red-600">{currentStepData.currentNode.noCount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Information Gain Comparison */}
            {currentStepData.allGains && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3">📊 Feature Comparison</h4>
                <div className="space-y-2">
                  {currentStepData.allGains
                    .sort((a, b) => b.gain - a.gain)
                    .map((gain, index) => (
                      <div key={gain.feature} className="flex items-center justify-between">
                        <span className={`text-sm ${index === 0 ? 'font-bold text-green-600' : 'text-gray-600'}`}>
                          {gain.feature} {index === 0 ? '🏆' : ''}
                        </span>
                        <span className={`text-sm font-mono ${index === 0 ? 'font-bold text-green-600' : 'text-gray-600'}`}>
                          {gain.gain.toFixed(3)}
                        </span>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Higher Information Gain = Better split
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3">🎯 What's Next?</h4>
              <div className="text-sm text-gray-600">
                {currentStep < buildingSteps.length - 1 ? (
                  <p>Click "Next Step" to see: <span className="font-semibold">{buildingSteps[currentStep + 1].title}</span></p>
                ) : (
                  <p>Tree is complete! Switch to "Make Predictions" to test it with new weather conditions.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Prediction Mode
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TreeVisualization tree={finalTree} />
            
            {prediction && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${
                prediction.prediction === 'Yes' 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold">
                      Prediction: <span className={
                        prediction.prediction === 'Yes' ? 'text-green-600' : 'text-red-600'
                      }>
                        {prediction.prediction === 'Yes' ? '✅ Play Tennis!' : '❌ Don\'t Play Tennis'}
                      </span>
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Decision Path: {prediction.path.join(' → ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-4">🌤️ Enter Weather Conditions</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outlook</label>
                <select
                  value={predictionInput.outlook}
                  onChange={(e) => setPredictionInput({...predictionInput, outlook: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Sunny">☀️ Sunny</option>
                  <option value="Overcast">☁️ Overcast</option>
                  <option value="Rain">🌧️ Rain</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                <select
                  value={predictionInput.temperature}
                  onChange={(e) => setPredictionInput({...predictionInput, temperature: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Hot">🔥 Hot</option>
                  <option value="Mild">🌡️ Mild</option>
                  <option value="Cool">❄️ Cool</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Humidity</label>
                <select
                  value={predictionInput.humidity}
                  onChange={(e) => setPredictionInput({...predictionInput, humidity: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">💧 High</option>
                  <option value="Normal">🌿 Normal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wind</label>
                <select
                  value={predictionInput.wind}
                  onChange={(e) => setPredictionInput({...predictionInput, wind: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Weak">🍃 Weak</option>
                  <option value="Strong">💨 Strong</option>
                </select>
              </div>

              <div className="pt-4 border-t">
                <h5 className="font-semibold text-gray-700 mb-2">Quick Tests:</h5>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setPredictionInput({outlook: 'Overcast', temperature: 'Hot', humidity: 'High', wind: 'Weak'})}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                  >
                    Perfect Day (Overcast)
                  </button>
                  <button
                    onClick={() => setPredictionInput({outlook: 'Sunny', temperature: 'Hot', humidity: 'High', wind: 'Strong'})}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                  >
                    Too Hot & Humid
                  </button>
                  <button
                    onClick={() => setPredictionInput({outlook: 'Rain', temperature: 'Mild', humidity: 'Normal', wind: 'Weak'})}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                  >
                    Light Rain Day
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Table */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">📊 Training Dataset - Tennis Weather History</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Day</th>
                <th className="p-3 text-left">☀️ Outlook</th>
                <th className="p-3 text-left">🌡️ Temperature</th>
                <th className="p-3 text-left">💧 Humidity</th>
                <th className="p-3 text-left">💨 Wind</th>
                <th className="p-3 text-left">🎾 Play Tennis?</th>
              </tr>
            </thead>
            <tbody>
              {tennisDataset.map((row, index) => {
                const isHighlighted = mode === 'learn' && currentStepData.data && 
                  currentStepData.data.some(d => d.id === row.id);
                
                return (
                  <tr 
                    key={row.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      isHighlighted ? 'bg-blue-100 border-blue-300' : ''
                    }`}
                  >
                    <td className="p-3 font-medium">{index + 1}</td>
                    <td className="p-3">{row.outlook}</td>
                    <td className="p-3">{row.temperature}</td>
                    <td className="p-3">{row.humidity}</td>
                    <td className="p-3">{row.wind}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        row.playTennis === 'Yes' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {row.playTennis === 'Yes' ? '✅ Yes' : '❌ No'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {mode === 'learn' && (
          <p className="text-sm text-blue-600 mt-3">
            💡 Blue highlighted rows show the data being used in the current step
          </p>
        )}
      </div>

      {/* Educational Content */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎓 Understanding Decision Trees</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">🤔 What are Decision Trees?</h3>
            <p className="text-gray-700 mb-4">
              Decision trees are like a flowchart of questions. They help us make decisions by asking
              simple yes/no questions about the data, just like playing "20 Questions"!
            </p>

            <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">🎯 Key Ideas</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>Root:</strong> The first question (top of tree)</li>
                <li><strong>Branches:</strong> Different answers to questions</li>
                <li><strong>Leaves:</strong> Final decisions (Yes/No)</li>
                <li><strong>Information Gain:</strong> How good a question is</li>
              </ul>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">📝 How We Build It</h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Start with all data mixed together</li>
              <li>Find the best question to separate Yes/No</li>
              <li>Split data based on answers</li>
              <li>Repeat for each branch until pure</li>
              <li>Stop when all leaves have one answer</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-800 mb-3">🧮 Why This Works</h3>

            <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">🔍 Information Gain</h4>
              <p className="text-sm text-blue-700 mb-2">
                We choose questions that give us the most information. The best question
                separates Yes and No examples as cleanly as possible.
              </p>
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                High Gain = Good separation<br/>
                Low Gain = Poor separation
              </div>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">🎾 Why Tennis Weather?</h4>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              <li>• Everyone understands weather conditions</li>
              <li>• Small dataset (14 examples) - easy to follow</li>
              <li>• Clear patterns emerge naturally</li>
              <li>• Perfect for learning the algorithm</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-yellow-700">
                Notice how "Overcast" always means "Yes"? That's a perfect split!
                The algorithm finds these patterns automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-green-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🌟 Real-World Uses</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🏥 Medical Diagnosis</h4>
              <p className="text-sm text-gray-700">Symptoms → Disease diagnosis with clear reasoning path</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💳 Credit Approval</h4>
              <p className="text-sm text-gray-700">Income, history, age → Approve or deny loan</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">🎯 Marketing</h4>
              <p className="text-sm text-gray-700">Customer data → Will they buy this product?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Terminology Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Decision Tree Terminology & Key Concepts</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Core Concepts */}
            <div>
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">🔑 Core Concepts</h3>

              <div className="space-y-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-800 mb-2">Entropy</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Measures how "mixed up" or impure a dataset is. Pure sets (all same class) have entropy = 0.
                  </p>
                  <div className="text-xs bg-white p-2 rounded border font-mono">
                    Entropy = -Σ(p_i × log₂(p_i))
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">Information Gain</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Reduction in entropy after splitting. Higher gain = better feature for splitting.
                  </p>
                  <div className="text-xs bg-white p-2 rounded border font-mono">
                    Gain = Entropy(parent) - Weighted_Avg(Entropy(children))
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">Gini Impurity</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Alternative to entropy. Measures probability of misclassifying a randomly chosen element.
                  </p>
                  <div className="text-xs bg-white p-2 rounded border font-mono">
                    Gini = 1 - Σ(p_i)²
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Pruning</h4>
                  <p className="text-sm text-gray-700">
                    Removing parts of the tree that don't provide additional predictive power to prevent overfitting.
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Concepts */}
            <div>
              <h3 className="text-xl font-semibold text-orange-800 mb-4">⚡ Advanced Concepts</h3>

              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-2">Overfitting</h4>
                  <p className="text-sm text-gray-700">
                    When a tree is too complex and memorizes training data rather than learning patterns.
                    Results in poor performance on new data.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-2">Stopping Criteria</h4>
                  <p className="text-sm text-gray-700 mb-2">Rules to prevent overfitting:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Min samples per leaf (e.g., ≥5)</li>
                    <li>• Max tree depth (e.g., ≤10)</li>
                    <li>• Min information gain threshold</li>
                    <li>• Max number of leaf nodes</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">Feature Selection</h4>
                  <p className="text-sm text-gray-700">
                    Process of choosing the best attribute to split on at each node. Uses measures like
                    information gain or Gini impurity.
                  </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h4 className="font-bold text-teal-800 mb-2">Bias-Variance Tradeoff</h4>
                  <p className="text-sm text-gray-700">
                    Deep trees have low bias but high variance. Shallow trees have high bias but low variance.
                    Need to find the right balance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Variations */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔄 Algorithm Variations & Extensions</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">ID3 Algorithm</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Original algorithm using information gain. Works only with categorical features.
                </p>
                <div className="text-xs text-blue-600">
                  • Uses entropy<br/>
                  • Categorical only<br/>
                  • Prone to overfitting
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">C4.5 Algorithm</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Enhancement of ID3 that handles continuous features and missing values.
                </p>
                <div className="text-xs text-green-600">
                  • Gain ratio (normalized)<br/>
                  • Handles continuous data<br/>
                  • Built-in pruning
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2">CART Algorithm</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Uses Gini impurity, creates binary trees, handles both classification and regression.
                </p>
                <div className="text-xs text-purple-600">
                  • Gini impurity<br/>
                  • Binary splits only<br/>
                  • Regression trees
                </div>
              </div>
            </div>
          </div>

          {/* Complexity Analysis */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Complexity & Performance</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3">Time Complexity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Training:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">O(n × m × log n)</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Prediction:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">O(log n)</code>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    n = samples, m = features
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3">Space Complexity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tree Storage:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">O(nodes)</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Case:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">O(log n)</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Worst Case:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">O(n)</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl shadow-sm border">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Q: When should I use Decision Trees over other algorithms?</h3>
              <p className="text-gray-700 text-sm mb-3">
                <strong>A:</strong> Decision trees are excellent when you need:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• <strong>Interpretability:</strong> Easy to explain decisions to stakeholders</li>
                <li>• <strong>Mixed data types:</strong> Handles both categorical and numerical features</li>
                <li>• <strong>No preprocessing:</strong> Works with raw data (no scaling/normalization needed)</li>
                <li>• <strong>Feature selection:</strong> Automatically identifies important features</li>
                <li>• <strong>Non-linear relationships:</strong> Captures complex patterns without assumptions</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-green-800 mb-2">Q: What are the main advantages and disadvantages?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">✅ Advantages:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Easy to understand and interpret</li>
                    <li>• Requires little data preparation</li>
                    <li>• Handles both numerical and categorical data</li>
                    <li>• Can model non-linear relationships</li>
                    <li>• Automatic feature selection</li>
                    <li>• Fast prediction time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">❌ Disadvantages:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Prone to overfitting</li>
                    <li>• Unstable (small data changes = different tree)</li>
                    <li>• Biased toward features with more levels</li>
                    <li>• Difficulty with linear relationships</li>
                    <li>• Can create overly complex trees</li>
                    <li>• Not optimal for continuous numerical output</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-purple-800 mb-2">Q: How do I prevent overfitting in Decision Trees?</h3>
              <p className="text-gray-700 text-sm mb-3">
                <strong>A:</strong> Several techniques can help:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-purple-700 mb-2">Pre-pruning (Early Stopping):</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Set maximum tree depth</li>
                    <li>• Minimum samples per leaf</li>
                    <li>• Minimum samples to split</li>
                    <li>• Maximum number of leaf nodes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 mb-2">Post-pruning:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Build full tree, then remove branches</li>
                    <li>• Use validation set to guide pruning</li>
                    <li>• Cost complexity pruning (α parameter)</li>
                    <li>• Cross-validation for optimal tree size</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-orange-800 mb-2">Q: What's the difference between ID3, C4.5, and CART?</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Algorithm</th>
                      <th className="border border-gray-300 p-2 text-left">Splitting Criterion</th>
                      <th className="border border-gray-300 p-2 text-left">Data Types</th>
                      <th className="border border-gray-300 p-2 text-left">Missing Values</th>
                      <th className="border border-gray-300 p-2 text-left">Pruning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">ID3</td>
                      <td className="border border-gray-300 p-2">Information Gain</td>
                      <td className="border border-gray-300 p-2">Categorical only</td>
                      <td className="border border-gray-300 p-2">❌ No</td>
                      <td className="border border-gray-300 p-2">❌ No</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">C4.5</td>
                      <td className="border border-gray-300 p-2">Gain Ratio</td>
                      <td className="border border-gray-300 p-2">Both</td>
                      <td className="border border-gray-300 p-2">✅ Yes</td>
                      <td className="border border-gray-300 p-2">✅ Yes</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">CART</td>
                      <td className="border border-gray-300 p-2">Gini Impurity</td>
                      <td className="border border-gray-300 p-2">Both</td>
                      <td className="border border-gray-300 p-2">✅ Yes</td>
                      <td className="border border-gray-300 p-2">✅ Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-teal-800 mb-2">Q: How do Decision Trees handle continuous/numerical features?</h3>
              <p className="text-gray-700 text-sm mb-3">
                <strong>A:</strong> Trees create binary splits for continuous features:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 ml-4">
                <li>• <strong>Sort values:</strong> Order all unique values of the feature</li>
                <li>• <strong>Test thresholds:</strong> Try splits between each pair of adjacent values</li>
                <li>• <strong>Choose best split:</strong> Select threshold that maximizes information gain</li>
                <li>• <strong>Example:</strong> Age feature might split as "Age ≤ 25" vs "Age > 25"</li>
              </ul>
              <div className="bg-teal-50 p-3 rounded border border-teal-200 mt-3">
                <p className="text-xs text-teal-700">
                  <strong>Pro tip:</strong> For a feature with n unique values, there are n-1 possible thresholds to evaluate.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-red-800 mb-2">Q: What are ensemble methods and how do they improve Decision Trees?</h3>
              <p className="text-gray-700 text-sm mb-3">
                <strong>A:</strong> Ensemble methods combine multiple trees to create stronger predictors:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Random Forest</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Trains many trees on bootstrap samples</li>
                    <li>• Each tree uses random subset of features</li>
                    <li>• Final prediction = majority vote</li>
                    <li>• Reduces overfitting and variance</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Gradient Boosting</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Trains trees sequentially</li>
                    <li>• Each tree corrects previous errors</li>
                    <li>• Examples: XGBoost, LightGBM</li>
                    <li>• Often achieves highest accuracy</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-indigo-800 mb-2">Q: How do I evaluate Decision Tree performance?</h3>
              <p className="text-gray-700 text-sm mb-3">
                <strong>A:</strong> Use multiple metrics depending on your problem:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-indigo-700 mb-2">Classification Metrics:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• <strong>Accuracy:</strong> Overall correct predictions</li>
                    <li>• <strong>Precision:</strong> True positives / (True + False positives)</li>
                    <li>• <strong>Recall:</strong> True positives / (True positives + False negatives)</li>
                    <li>• <strong>F1-Score:</strong> Harmonic mean of precision & recall</li>
                    <li>• <strong>AUC-ROC:</strong> Area under ROC curve</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-700 mb-2">Validation Techniques:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• <strong>Train/Validation/Test split:</strong> 60/20/20</li>
                    <li>• <strong>K-Fold Cross-validation:</strong> Usually k=5 or k=10</li>
                    <li>• <strong>Stratified sampling:</strong> Preserve class distribution</li>
                    <li>• <strong>Time series split:</strong> For temporal data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecisionTree;