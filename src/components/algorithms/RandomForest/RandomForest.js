import React, { useState, useEffect } from 'react';

function RandomForest() {
  const [currentView, setCurrentView] = useState('comparison');
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample dataset for visualization
  const sampleData = [
    { id: 1, outlook: 'Sunny', temperature: 'Hot', humidity: 'High', wind: 'Weak', play: 'No' },
    { id: 2, outlook: 'Sunny', temperature: 'Hot', humidity: 'High', wind: 'Strong', play: 'No' },
    { id: 3, outlook: 'Overcast', temperature: 'Hot', humidity: 'High', wind: 'Weak', play: 'Yes' },
    { id: 4, outlook: 'Rain', temperature: 'Mild', humidity: 'High', wind: 'Weak', play: 'Yes' },
    { id: 5, outlook: 'Rain', temperature: 'Cool', humidity: 'Normal', wind: 'Weak', play: 'Yes' },
    { id: 6, outlook: 'Rain', temperature: 'Cool', humidity: 'Normal', wind: 'Strong', play: 'No' },
    { id: 7, outlook: 'Overcast', temperature: 'Cool', humidity: 'Normal', wind: 'Strong', play: 'Yes' },
    { id: 8, outlook: 'Sunny', temperature: 'Mild', humidity: 'High', wind: 'Weak', play: 'No' }
  ];

  // Forest animation steps
  const forestSteps = [
    { step: 0, title: "Original Dataset", description: "We start with our complete training dataset" },
    { step: 1, title: "Bootstrap Sampling", description: "Create multiple random samples with replacement" },
    { step: 2, title: "Feature Selection", description: "Each tree uses a random subset of features" },
    { step: 3, title: "Train Trees", description: "Train multiple decision trees independently" },
    { step: 4, title: "Make Predictions", description: "Each tree votes, majority wins" }
  ];

  useEffect(() => {
    if (isAnimating) {
      const timer = setInterval(() => {
        setAnimationStep(prev => {
          if (prev >= forestSteps.length - 1) {
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [isAnimating, forestSteps.length]);

  const startAnimation = () => {
    setAnimationStep(0);
    setIsAnimating(true);
  };

  const DecisionTreeVisualization = ({ title, isHighlighted = false, features = [], data = [] }) => (
    <div className={`bg-white border-2 rounded-lg p-4 transition-all duration-300 ${
      isHighlighted ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'
    }`}>
      <h4 className="font-bold text-center mb-3 text-sm">{title}</h4>
      <svg width="200" height="120" viewBox="0 0 200 120" className="w-full">
        {/* Root node */}
        <rect x="85" y="10" width="30" height="20" fill="#3b82f6" stroke="#2563eb" rx="4"/>
        <text x="100" y="24" textAnchor="middle" fontSize="10" fill="white">Root</text>

        {/* Level 1 nodes */}
        <line x1="100" y1="30" x2="60" y2="50" stroke="#6b7280" strokeWidth="1"/>
        <line x1="100" y1="30" x2="140" y2="50" stroke="#6b7280" strokeWidth="1"/>

        <rect x="45" y="50" width="30" height="20" fill="#10b981" stroke="#059669" rx="4"/>
        <text x="60" y="64" textAnchor="middle" fontSize="8" fill="white">Yes</text>

        <rect x="125" y="50" width="30" height="20" fill="#6b7280" stroke="#4b5563" rx="4"/>
        <text x="140" y="64" textAnchor="middle" fontSize="8" fill="white">Split</text>

        {/* Level 2 nodes */}
        <line x1="140" y1="70" x2="120" y2="90" stroke="#6b7280" strokeWidth="1"/>
        <line x1="140" y1="70" x2="160" y2="90" stroke="#6b7280" strokeWidth="1"/>

        <rect x="105" y="90" width="30" height="20" fill="#10b981" stroke="#059669" rx="4"/>
        <text x="120" y="104" textAnchor="middle" fontSize="8" fill="white">Yes</text>

        <rect x="145" y="90" width="30" height="20" fill="#ef4444" stroke="#dc2626" rx="4"/>
        <text x="160" y="104" textAnchor="middle" fontSize="8" fill="white">No</text>
      </svg>

      {features.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-1">Features used:</p>
          <div className="flex flex-wrap gap-1">
            {features.map((feature, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-600">Data: {data.length} samples</p>
        </div>
      )}
    </div>
  );

  const ForestVisualization = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6 border border-green-200">
      <h4 className="text-lg font-bold text-center mb-6 text-green-800">Random Forest (5 Trees)</h4>
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((treeNum) => (
          <DecisionTreeVisualization
            key={treeNum}
            title={`Tree ${treeNum}`}
            isHighlighted={isAnimating && animationStep >= 3}
            features={['Outlook', 'Humidity'].slice(0, Math.random() > 0.5 ? 2 : 1)}
            data={sampleData.slice(0, Math.floor(Math.random() * 3) + 5)}
          />
        ))}
      </div>

      {/* Voting mechanism */}
      <div className="bg-white rounded-lg p-4 border border-green-300">
        <h5 className="font-bold text-center mb-4">Voting Mechanism</h5>
        <div className="flex justify-center space-x-4 mb-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🌳 🌳 🌳</div>
            <div className="text-sm font-medium text-green-600">3 votes: "Yes"</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🌳 🌳</div>
            <div className="text-sm font-medium text-red-600">2 votes: "No"</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">Final Prediction: Play Tennis! ✅</div>
          <div className="text-sm text-gray-600">Majority vote wins</div>
        </div>
      </div>
    </div>
  );

  const BootstrapSamplingVisualization = () => (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <h4 className="text-lg font-bold mb-4 text-blue-800">Bootstrap Sampling Process</h4>

      <div className="mb-6">
        <h5 className="font-semibold mb-2">Original Dataset (8 samples)</h5>
        <div className="grid grid-cols-8 gap-2">
          {sampleData.map((sample, idx) => (
            <div key={idx} className="bg-white border rounded p-2 text-center text-xs">
              <div className="font-bold">#{sample.id}</div>
              <div className="text-gray-600">{sample.outlook}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((sampleNum) => {
          const bootstrapSample = Array.from({length: 8}, () =>
            sampleData[Math.floor(Math.random() * sampleData.length)]
          );

          return (
            <div key={sampleNum} className="bg-white rounded-lg p-4 border">
              <h6 className="font-semibold mb-2">Bootstrap Sample {sampleNum}</h6>
              <div className="grid grid-cols-4 gap-1">
                {bootstrapSample.map((sample, idx) => (
                  <div key={idx} className="bg-blue-100 border rounded p-1 text-center text-xs">
                    <div className="font-bold">#{sample.id}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Some samples appear multiple times, others not at all
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const BaggingVsBoostingVisualization = () => (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Bagging */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h4 className="text-xl font-bold mb-4 text-green-800">🎒 Bagging (Bootstrap Aggregating)</h4>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold mb-2">Step 1: Parallel Training</h5>
            <div className="flex justify-center space-x-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="text-center">
                  <div className="bg-green-100 rounded-lg p-3 mb-2">
                    <span className="text-2xl">🌳</span>
                    <div className="text-xs mt-1">Tree {num}</div>
                  </div>
                  <div className="text-xs text-gray-600">Independent</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold mb-2">Step 2: Bootstrap Samples</h5>
            <div className="space-y-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center space-x-2">
                  <span className="w-12 text-sm">Tree {num}:</span>
                  <div className="flex space-x-1">
                    {Array.from({length: 6}, (_, i) => (
                      <div key={i} className="w-6 h-6 bg-green-200 rounded text-xs flex items-center justify-center">
                        {Math.floor(Math.random() * 8) + 1}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold mb-2">Step 3: Vote & Aggregate</h5>
            <div className="text-center">
              <div className="text-lg mb-2">🗳️ Majority Vote</div>
              <div className="text-sm text-gray-600">Each tree contributes equally</div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-green-100 rounded-lg p-3">
          <h6 className="font-semibold text-green-800 mb-1">Key Characteristics:</h6>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Trees trained in parallel</li>
            <li>• Reduces overfitting</li>
            <li>• Lower variance</li>
            <li>• Example: Random Forest</li>
          </ul>
        </div>
      </div>

      {/* Boosting */}
      <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
        <h4 className="text-xl font-bold mb-4 text-orange-800">🚀 Boosting</h4>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold mb-2">Step 1: Sequential Training</h5>
            <div className="flex justify-center items-center space-x-2">
              {[1, 2, 3].map((num, idx) => (
                <React.Fragment key={num}>
                  <div className="text-center">
                    <div className={`rounded-lg p-3 mb-2 ${idx === 0 ? 'bg-orange-100' : idx === 1 ? 'bg-orange-200' : 'bg-orange-300'}`}>
                      <span className="text-2xl">🌳</span>
                      <div className="text-xs mt-1">Tree {num}</div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {idx === 0 ? 'Base' : `Fix Tree ${idx}`}
                    </div>
                  </div>
                  {idx < 2 && <span className="text-2xl">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold mb-2">Step 2: Error Focus</h5>
            <div className="space-y-2">
              {[
                { tree: 1, errors: '20%', focus: 'All data equally' },
                { tree: 2, errors: '12%', focus: 'Misclassified samples' },
                { tree: 3, errors: '8%', focus: 'Remaining errors' }
              ].map((item) => (
                <div key={item.tree} className="flex items-center justify-between bg-orange-100 rounded p-2">
                  <span className="text-sm font-medium">Tree {item.tree}</span>
                  <span className="text-sm">{item.focus}</span>
                  <span className="text-sm font-bold text-orange-700">{item.errors}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold mb-2">Step 3: Weighted Combination</h5>
            <div className="text-center">
              <div className="text-lg mb-2">⚖️ Weighted Vote</div>
              <div className="text-sm text-gray-600">Better trees get more weight</div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-orange-100 rounded-lg p-3">
          <h6 className="font-semibold text-orange-800 mb-1">Key Characteristics:</h6>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Trees trained sequentially</li>
            <li>• Focuses on errors</li>
            <li>• Lower bias</li>
            <li>• Example: AdaBoost, XGBoost</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Mode Selection */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setCurrentView('comparison')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'comparison'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🌳 vs 🌲 Tree vs Forest
          </button>
          <button
            onClick={() => setCurrentView('forest')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'forest'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🌲 Random Forest
          </button>
          <button
            onClick={() => setCurrentView('bagging-boosting')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'bagging-boosting'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🎒 vs 🚀 Bagging vs Boosting
          </button>
        </div>
      </div>

      {/* Visual Comparison: Decision Tree vs Random Forest */}
      {currentView === 'comparison' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Decision Tree vs Random Forest</h3>
            <p className="text-gray-600">See how multiple trees work together to make better predictions</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Single Decision Tree */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="text-xl font-bold mb-4 text-blue-800">🌳 Single Decision Tree</h4>

              <div className="bg-white rounded-lg p-4 border mb-4">
                <DecisionTreeVisualization
                  title="Tennis Decision Tree"
                  features={['Outlook', 'Humidity', 'Wind', 'Temperature']}
                  data={sampleData}
                />
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3 border">
                  <h5 className="font-semibold text-blue-700 mb-2">Characteristics:</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>✅ Easy to interpret</li>
                    <li>✅ Fast to train</li>
                    <li>❌ Prone to overfitting</li>
                    <li>❌ High variance</li>
                    <li>❌ Sensitive to data changes</li>
                  </ul>
                </div>

                <div className="bg-red-100 rounded-lg p-3 border border-red-200">
                  <h5 className="font-semibold text-red-700 mb-1">Problems:</h5>
                  <p className="text-sm text-red-600">
                    Small changes in training data can create completely different trees
                  </p>
                </div>
              </div>
            </div>

            {/* Random Forest */}
            <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
              <h4 className="text-xl font-bold mb-4 text-emerald-800">🌲 Random Forest</h4>

              <ForestVisualization />

              <div className="mt-4 space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3 border">
                  <h5 className="font-semibold text-emerald-700 mb-2">Advantages:</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>✅ Reduces overfitting</li>
                    <li>✅ Lower variance</li>
                    <li>✅ More robust predictions</li>
                    <li>✅ Feature importance ranking</li>
                    <li>✅ Handles missing values</li>
                  </ul>
                </div>

                <div className="bg-emerald-100 rounded-lg p-3 border border-emerald-200">
                  <h5 className="font-semibold text-emerald-700 mb-1">Solution:</h5>
                  <p className="text-sm text-emerald-600">
                    Multiple trees voting together provide stable, reliable predictions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Random Forest Deep Dive */}
      {currentView === 'forest' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">How Random Forest Works</h3>
            <p className="text-gray-600">Step-by-step construction of a forest</p>
          </div>

          {/* Animation Controls */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Forest Building Process</h4>
              <button
                onClick={startAnimation}
                disabled={isAnimating}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {isAnimating ? 'Building Forest...' : '▶️ Start Animation'}
              </button>
            </div>

            <div className="flex justify-between mb-4">
              {forestSteps.map((step, idx) => (
                <div key={idx} className={`text-center flex-1 ${idx <= animationStep ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold ${
                    idx <= animationStep ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <h5 className="font-semibold text-emerald-800 mb-2">
                Current Step: {forestSteps[animationStep]?.title}
              </h5>
              <p className="text-sm text-emerald-700">{forestSteps[animationStep]?.description}</p>
            </div>
          </div>

          {/* Step-specific visualizations */}
          {animationStep === 1 && <BootstrapSamplingVisualization />}
          {animationStep >= 3 && <ForestVisualization />}
        </div>
      )}

      {/* Bagging vs Boosting */}
      {currentView === 'bagging-boosting' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ensemble Methods: Bagging vs Boosting</h3>
            <p className="text-gray-600">Two different approaches to combining multiple models</p>
          </div>

          <BaggingVsBoostingVisualization />

          {/* Comparison Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <h4 className="text-xl font-bold p-6 bg-gray-50 border-b">Detailed Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4 font-semibold">Aspect</th>
                    <th className="text-left p-4 font-semibold text-green-700">Bagging</th>
                    <th className="text-left p-4 font-semibold text-orange-700">Boosting</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Training</td>
                    <td className="p-4">Parallel (independent)</td>
                    <td className="p-4">Sequential (dependent)</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Focus</td>
                    <td className="p-4">Reduce variance</td>
                    <td className="p-4">Reduce bias</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Data Sampling</td>
                    <td className="p-4">Bootstrap sampling</td>
                    <td className="p-4">Weighted sampling</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Voting</td>
                    <td className="p-4">Equal weight</td>
                    <td className="p-4">Weighted by performance</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Overfitting</td>
                    <td className="p-4">Reduces overfitting</td>
                    <td className="p-4">Can overfit if not careful</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Speed</td>
                    <td className="p-4">Faster (parallel)</td>
                    <td className="p-4">Slower (sequential)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Examples</td>
                    <td className="p-4">Random Forest, Extra Trees</td>
                    <td className="p-4">AdaBoost, XGBoost, LightGBM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Explanation Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🌲 Understanding Random Forest</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-4">🔑 Core Concepts</h3>

              <div className="space-y-4">
                <div className="bg-white border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-bold text-emerald-800 mb-2">Bootstrap Aggregating (Bagging)</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Creates multiple training sets by sampling with replacement from the original dataset.
                  </p>
                  <div className="text-xs bg-emerald-50 p-2 rounded border">
                    Each bootstrap sample ≈ 63.2% unique data + 36.8% duplicates
                  </div>
                </div>

                <div className="bg-white border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-bold text-emerald-800 mb-2">Random Feature Selection</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    At each split, only consider a random subset of features (√p for classification).
                  </p>
                  <div className="text-xs bg-emerald-50 p-2 rounded border">
                    For 16 features → each split considers only √16 = 4 random features
                  </div>
                </div>

                <div className="bg-white border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-bold text-emerald-800 mb-2">Majority Voting</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Each tree votes for a class, final prediction is the majority vote.
                  </p>
                  <div className="text-xs bg-emerald-50 p-2 rounded border">
                    100 trees: 60 vote "Yes", 40 vote "No" → Prediction: "Yes"
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-4">🎯 Key Advantages</h3>

              <div className="space-y-4">
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">Variance Reduction</h4>
                  <p className="text-sm text-gray-700">
                    Individual trees may overfit, but averaging many trees reduces overall variance
                    without increasing bias.
                  </p>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">Out-of-Bag (OOB) Estimation</h4>
                  <p className="text-sm text-gray-700">
                    Each bootstrap sample leaves out ~37% of data. These "out-of-bag" samples
                    provide a built-in validation set.
                  </p>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">Feature Importance</h4>
                  <p className="text-sm text-gray-700">
                    Measures how much each feature contributes to decreasing impurity across all trees.
                  </p>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">Robustness</h4>
                  <p className="text-sm text-gray-700">
                    Naturally handles missing values, doesn't require feature scaling,
                    and is resistant to outliers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hyperparameters */}
          <div className="mt-8 pt-6 border-t border-emerald-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Key Hyperparameters</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">n_estimators</h4>
                <p className="text-sm text-gray-700 mb-2">Number of trees in the forest</p>
                <div className="text-xs bg-gray-50 p-2 rounded">
                  <strong>Typical range:</strong> 100-1000<br/>
                  <strong>More trees:</strong> Better performance, longer training
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">max_features</h4>
                <p className="text-sm text-gray-700 mb-2">Features to consider per split</p>
                <div className="text-xs bg-gray-50 p-2 rounded">
                  <strong>Default:</strong> √(total_features)<br/>
                  <strong>Options:</strong> 'auto', 'sqrt', 'log2', int, float
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">max_depth</h4>
                <p className="text-sm text-gray-700 mb-2">Maximum depth of each tree</p>
                <div className="text-xs bg-gray-50 p-2 rounded">
                  <strong>Default:</strong> None (unlimited)<br/>
                  <strong>Control:</strong> Overfitting vs underfitting
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-8 pt-6 border-t border-emerald-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🚀 When to Use Random Forest</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-3">✅ Great For:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Mixed data types:</strong> Categorical and numerical features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Feature importance:</strong> When you need to understand which features matter</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Baseline model:</strong> Often performs well out-of-the-box</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Noisy data:</strong> Robust to outliers and missing values</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Medium datasets:</strong> 1K - 100K samples work well</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-red-700 mb-3">❌ Consider Alternatives For:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span><strong>Very large datasets:</strong> Can be memory intensive</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span><strong>Real-time prediction:</strong> Slower than single models</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span><strong>Interpretability:</strong> Less interpretable than single decision tree</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span><strong>Linear relationships:</strong> Linear/logistic regression might be better</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span><strong>Time series:</strong> Doesn't capture temporal dependencies well</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Real-world Examples */}
          <div className="mt-8 pt-6 border-t border-emerald-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🌍 Real-World Applications</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🏦 Finance</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Credit risk assessment</li>
                  <li>• Fraud detection</li>
                  <li>• Algorithmic trading</li>
                  <li>• Portfolio optimization</li>
                </ul>
              </div>

              <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🏥 Healthcare</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Disease diagnosis</li>
                  <li>• Drug discovery</li>
                  <li>• Patient risk stratification</li>
                  <li>• Medical image analysis</li>
                </ul>
              </div>

              <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">🛒 E-commerce</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Recommendation systems</li>
                  <li>• Price optimization</li>
                  <li>• Customer segmentation</li>
                  <li>• Demand forecasting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RandomForest;