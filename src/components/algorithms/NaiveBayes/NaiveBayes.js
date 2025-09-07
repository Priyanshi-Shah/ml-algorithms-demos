import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function NaiveBayes() {
  const [inputText, setInputText] = useState('Free money! Win now! Click here!');
  const [showCalculation, setShowCalculation] = useState(true);
  const [smoothing, setSmoothing] = useState(true);

  // Pre-trained word probabilities (simplified dataset)
  const wordProbabilities = {
    // Spam words
    'free': { spam: 0.8, ham: 0.1 },
    'money': { spam: 0.7, ham: 0.05 },
    'win': { spam: 0.6, ham: 0.02 },
    'click': { spam: 0.5, ham: 0.1 },
    'now': { spam: 0.4, ham: 0.3 },
    'offer': { spam: 0.7, ham: 0.05 },
    'urgent': { spam: 0.8, ham: 0.02 },
    'limited': { spam: 0.6, ham: 0.1 },
    'guarantee': { spam: 0.7, ham: 0.05 },
    'prize': { spam: 0.8, ham: 0.01 },
    
    // Ham words  
    'meeting': { spam: 0.01, ham: 0.4 },
    'project': { spam: 0.02, ham: 0.5 },
    'work': { spam: 0.05, ham: 0.6 },
    'team': { spam: 0.02, ham: 0.4 },
    'please': { spam: 0.1, ham: 0.3 },
    'thank': { spam: 0.05, ham: 0.4 },
    'schedule': { spam: 0.01, ham: 0.3 },
    'report': { spam: 0.02, ham: 0.35 },
    'update': { spam: 0.03, ham: 0.4 },
    'regards': { spam: 0.01, ham: 0.5 }
  };

  // Prior probabilities
  const priorProbabilities = {
    spam: 0.4,  // 40% of emails are spam
    ham: 0.6    // 60% of emails are ham
  };

  // Laplace smoothing parameters
  const alpha = 1; // smoothing parameter
  const vocabularySize = Object.keys(wordProbabilities).length;

  const { classification, wordAnalysis, stepByStep } = useMemo(() => {
    if (!inputText.trim()) {
      return { 
        classification: { spam: 0.5, ham: 0.5, predicted: 'unknown' }, 
        wordAnalysis: [], 
        stepByStep: [] 
      };
    }

    // Tokenize input text
    const words = inputText.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);

    // Calculate probabilities for each word
    const wordAnalysis = words.map(word => {
      let spamProb, hamProb;
      
      if (wordProbabilities[word]) {
        spamProb = wordProbabilities[word].spam;
        hamProb = wordProbabilities[word].ham;
      } else {
        // Unknown word - use smoothing
        if (smoothing) {
          spamProb = alpha / (vocabularySize + alpha);
          hamProb = alpha / (vocabularySize + alpha);
        } else {
          spamProb = 0.01; // small probability
          hamProb = 0.01;
        }
      }

      return {
        word,
        spamProb,
        hamProb,
        spamContrib: Math.log(spamProb),
        hamContrib: Math.log(hamProb),
        isKnown: !!wordProbabilities[word]
      };
    });

    // Calculate final probabilities using log probabilities to avoid underflow
    let logSpamProb = Math.log(priorProbabilities.spam);
    let logHamProb = Math.log(priorProbabilities.ham);

    wordAnalysis.forEach(analysis => {
      logSpamProb += analysis.spamContrib;
      logHamProb += analysis.hamContrib;
    });

    // Convert back to normal probabilities using normalization
    const maxLog = Math.max(logSpamProb, logHamProb);
    const normalizedSpamProb = Math.exp(logSpamProb - maxLog);
    const normalizedHamProb = Math.exp(logHamProb - maxLog);
    const total = normalizedSpamProb + normalizedHamProb;

    const finalSpamProb = normalizedSpamProb / total;
    const finalHamProb = normalizedHamProb / total;

    const stepByStep = [
      {
        step: 'Prior Probabilities',
        description: 'P(Spam) and P(Ham) from training data',
        spamValue: priorProbabilities.spam,
        hamValue: priorProbabilities.ham
      },
      ...wordAnalysis.map((analysis, index) => ({
        step: `Word: "${analysis.word}"`,
        description: `P(${analysis.word}|Class) ${analysis.isKnown ? '' : '(unknown word)'}`,
        spamValue: analysis.spamProb,
        hamValue: analysis.hamProb
      })),
      {
        step: 'Final Classification',
        description: 'Normalized posterior probabilities',
        spamValue: finalSpamProb,
        hamValue: finalHamProb
      }
    ];

    return {
      classification: {
        spam: finalSpamProb,
        ham: finalHamProb,
        predicted: finalSpamProb > finalHamProb ? 'spam' : 'ham'
      },
      wordAnalysis,
      stepByStep
    };
  }, [inputText, smoothing]);

  const loadPreset = (type) => {
    const presets = {
      spam1: "FREE MONEY! Win $1000 now! Click here immediately! Limited time offer!",
      spam2: "URGENT! You've won a prize! Claim your free gift now! Don't wait!",
      spam3: "Make money fast! Guaranteed returns! Free trial! Act now!",
      ham1: "Hi team, please review the project report and send your feedback by Friday.",
      ham2: "Thank you for the meeting today. I'll update the schedule accordingly.",
      ham3: "Could you please share the latest work progress? Best regards.",
      mixed: "Free project update: please review our work and schedule a meeting."
    };
    setInputText(presets[type] || '');
  };

  // Prepare data for probability comparison chart
  const comparisonData = wordAnalysis.slice(0, 8).map(analysis => ({
    word: analysis.word,
    'P(word|Spam)': (analysis.spamProb * 100).toFixed(1),
    'P(word|Ham)': (analysis.hamProb * 100).toFixed(1),
    spamRaw: analysis.spamProb,
    hamRaw: analysis.hamProb
  }));

  // Pie chart data for final classification
  const pieData = [
    { name: 'Spam', value: (classification.spam * 100).toFixed(1), color: '#ef4444' },
    { name: 'Ham', value: (classification.ham * 100).toFixed(1), color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🚀 Quick Start Guide</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
            <div>
              <p className="font-semibold text-purple-800">Type Text</p>
              <p className="text-purple-700 text-xs">Enter email content or use presets</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
            <div>
              <p className="font-semibold text-blue-800">Watch Analysis</p>
              <p className="text-blue-700 text-xs">See how each word contributes to classification</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
            <div>
              <p className="font-semibold text-green-800">View Probabilities</p>
              <p className="text-green-700 text-xs">Understand P(word|class) calculations</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
            <div>
              <p className="font-semibold text-orange-800">Learn Bayes</p>
              <p className="text-orange-700 text-xs">Follow step-by-step calculations</p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-purple-200">
          <p className="text-sm text-gray-600 mb-2"><strong>💡 Try These:</strong></p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => loadPreset('spam1')} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs hover:bg-red-200 transition-colors">Obvious Spam</button>
            <button onClick={() => loadPreset('ham1')} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors">Work Email</button>
            <button onClick={() => loadPreset('mixed')} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors">Mixed Content</button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Text Input */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📧 Email Text Classifier</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter email text to classify:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your email content here..."
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => loadPreset('spam1')} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Spam Example</button>
              <button onClick={() => loadPreset('ham1')} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Ham Example</button>
              <button onClick={() => loadPreset('mixed')} className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">Mixed Example</button>
              <button onClick={() => setInputText('')} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">Clear</button>
            </div>

            {/* Classification Result */}
            <div className={`p-4 rounded-lg border-2 ${
              classification.predicted === 'spam' 
                ? 'bg-red-50 border-red-200' 
                : classification.predicted === 'ham'
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">
                    Classification: <span className={
                      classification.predicted === 'spam' ? 'text-red-600' : 'text-green-600'
                    }>
                      {classification.predicted === 'spam' ? '🚨 SPAM' : '✅ HAM (Not Spam)'}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    Confidence: {Math.max(classification.spam, classification.ham) * 100 >= 50 ? 
                      `${(Math.max(classification.spam, classification.ham) * 100).toFixed(1)}%` : 
                      'Low confidence'}
                  </p>
                </div>
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Word Analysis Chart */}
          {comparisonData.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">📊 Word Probability Analysis</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="word" />
                  <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Bar dataKey="P(word|Spam)" fill="#ef4444" />
                  <Bar dataKey="P(word|Ham)" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-2">
                Higher bars indicate stronger association with that class. Red = Spam indicators, Green = Ham indicators.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">⚙️ Controls</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Laplace Smoothing</span>
                <button
                  onClick={() => setSmoothing(!smoothing)}
                  className={`px-3 py-1 rounded text-sm ${
                    smoothing 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {smoothing ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show Calculations</span>
                <button
                  onClick={() => setShowCalculation(!showCalculation)}
                  className={`px-3 py-1 rounded text-sm ${
                    showCalculation 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {showCalculation ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Step by Step Calculation */}
          {showCalculation && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">🧮 Step-by-Step</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {stepByStep.map((step, index) => (
                  <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <div className="font-semibold text-sm text-gray-800">{step.step}</div>
                    <div className="text-xs text-gray-600 mb-2">{step.description}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-600">
                        Spam: {(step.spamValue * 100).toFixed(3)}%
                      </span>
                      <span className="text-green-600">
                        Ham: {(step.hamValue * 100).toFixed(3)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Algorithm Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">ℹ️ Algorithm Info</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Vocabulary Size:</span>
                <span className="ml-2 text-gray-600">{vocabularySize} words</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Prior P(Spam):</span>
                <span className="ml-2 text-gray-600">{(priorProbabilities.spam * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Prior P(Ham):</span>
                <span className="ml-2 text-gray-600">{(priorProbabilities.ham * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Smoothing α:</span>
                <span className="ml-2 text-gray-600">{smoothing ? alpha : 'Disabled'}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">🏷️ Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>P(word|Spam) - Spam probability</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>P(word|Ham) - Ham probability</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span>Unknown words (smoothed)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎓 Understanding Naive Bayes Classification</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-purple-800 mb-3">🤔 How Does It Work?</h3>
            <p className="text-gray-700 mb-4">
              Naive Bayes uses Bayes' theorem to calculate the probability that a text belongs to each class (spam or ham), 
              then predicts the class with the highest probability.
            </p>
            
            <div className="bg-white border border-purple-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-purple-800 mb-2">📐 Bayes' Theorem</h4>
              <div className="text-center text-lg font-mono bg-purple-100 p-3 rounded mb-2">
                P(Class|Text) = P(Text|Class) × P(Class) / P(Text)
              </div>
              <p className="text-sm text-purple-700">
                Where P(Text|Class) = ∏ P(word|Class) for all words
              </p>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">🔑 Key Steps</h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li><strong>Training:</strong> Learn P(word|spam) and P(word|ham) from data</li>
              <li><strong>Prior:</strong> Calculate P(spam) and P(ham) from training set</li>
              <li><strong>Independence:</strong> Assume words are independent (naive assumption)</li>
              <li><strong>Classify:</strong> Multiply probabilities for all words in text</li>
              <li><strong>Predict:</strong> Choose class with highest probability</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">💡 Why "Naive"?</h3>
            
            <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">🔗 Independence Assumption</h4>
              <p className="text-sm text-green-700 mb-2">
                The algorithm assumes that words are independent of each other. For example:
              </p>
              <div className="bg-green-50 p-3 rounded text-sm">
                <p className="mb-1"><strong>Reality:</strong> "Free" and "money" often appear together in spam</p>
                <p><strong>Naive Bayes:</strong> Treats P("free"|spam) and P("money"|spam) as independent</p>
              </div>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">⚡ Advantages</h4>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              <li>• Fast training and prediction</li>
              <li>• Works well with small datasets</li>
              <li>• Handles multiple classes naturally</li>
              <li>• Good baseline for text classification</li>
              <li>• Interpretable probability outputs</li>
            </ul>

            <h4 className="font-semibold text-gray-800 mb-2">⚠️ Limitations</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Independence assumption often violated</li>
              <li>• Zero probabilities for unseen words</li>
              <li>• Poor probability calibration</li>
              <li>• Struggles with correlated features</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-purple-200">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-2">🎯 Best Use Cases</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Email spam filtering</li>
                <li>• Document classification</li>
                <li>• Sentiment analysis</li>
                <li>• News categorization</li>
                <li>• Medical diagnosis (discrete features)</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">🔧 Key Techniques</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Laplace Smoothing:</strong> Handle unseen words</li>
                <li>• <strong>Log Probabilities:</strong> Prevent underflow</li>
                <li>• <strong>Feature Selection:</strong> Remove irrelevant words</li>
                <li>• <strong>TF-IDF:</strong> Weight word importance</li>
                <li>• <strong>N-grams:</strong> Capture word sequences</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h4 className="font-semibold text-orange-800 mb-2">📊 Performance Tips</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Remove stop words carefully</li>
                <li>• Use appropriate smoothing</li>
                <li>• Consider feature preprocessing</li>
                <li>• Validate independence assumption</li>
                <li>• Compare with other classifiers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NaiveBayes;