// src/components/algorithms/LinearRegression/MultipleLinearRegression.js
import React from 'react';
import { BarChart3 } from 'lucide-react';

function MultipleLinearRegression() {
  return (
    <div className="text-center py-16">
      <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Multiple Linear Regression</h3>
      <p className="text-gray-600 mb-6">
        This will show regression with multiple input variables (X₁, X₂, X₃...) predicting one output (Y).
      </p>
      <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-yellow-800 font-medium">🚧 Coming Soon!</p>
        <p className="text-yellow-700 text-sm mt-1">
          This demo will include 3D visualizations and feature importance analysis.
        </p>
      </div>
    </div>
  );
}

export default MultipleLinearRegression;

// // src/components/algorithms/LinearRegression/PolynomialRegression.js
// import React from 'react';
// import { Activity } from 'lucide-react';

// function PolynomialRegression() {
//   return (
//     <div className="text-center py-16">
//       <Activity className="mx-auto text-gray-400 mb-4" size={64} />
//       <h3 className="text-2xl font-bold text-gray-800 mb-2">Polynomial Regression</h3>
//       <p className="text-gray-600 mb-6">
//         Watch how polynomial curves of different degrees fit to non-linear data patterns.
//       </p>
//       <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto">
//         <p className="text-yellow-800 font-medium">🚧 Coming Soon!</p>
//         <p className="text-yellow-700 text-sm mt-1">
//           Interactive degree selection and overfitting visualization.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default PolynomialRegression;

// // src/components/algorithms/LinearRegression/RidgeRegression.js
// import React from 'react';
// import { Layers } from 'lucide-react';

// function RidgeRegression() {
//   return (
//     <div className="text-center py-16">
//       <Layers className="mx-auto text-gray-400 mb-4" size={64} />
//       <h3 className="text-2xl font-bold text-gray-800 mb-2">Ridge Regression</h3>
//       <p className="text-gray-600 mb-6">
//         Learn how L2 regularization prevents overfitting by penalizing large coefficients.
//       </p>
//       <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto">
//         <p className="text-yellow-800 font-medium">🚧 Coming Soon!</p>
//         <p className="text-yellow-700 text-sm mt-1">
//           Interactive regularization parameter (alpha) tuning.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default RidgeRegression;

// // src/components/algorithms/KMeans/KMeansPlusPlus.js
// import React from 'react';
// import { Circle } from 'lucide-react';

// function KMeansPlusPlus() {
//   return (
//     <div className="text-center py-16">
//       <Circle className="mx-auto text-gray-400 mb-4" size={64} />
//       <h3 className="text-2xl font-bold text-gray-800 mb-2">K-Means++</h3>
//       <p className="text-gray-600 mb-6">
//         Smart initialization that chooses initial centroids to be far apart for better clustering.
//       </p>
//       <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto">
//         <p className="text-yellow-800 font-medium">🚧 Coming Soon!</p>
//         <p className="text-yellow-700 text-sm mt-1">
//           Compare standard vs K-means++ initialization side-by-side.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default KMeansPlusPlus;

// // src/components/algorithms/KMeans/MiniBatchKMeans.js
// import React from 'react';
// import { Grid } from 'lucide-react';

// function MiniBatchKMeans() {
//   return (
//     <div className="text-center py-16">
//       <Grid className="mx-auto text-gray-400 mb-4" size={64} />
//       <h3 className="text-2xl font-bold text-gray-800 mb-2">Mini-Batch K-Means</h3>
//       <p className="text-gray-600 mb-6">
//         Faster clustering using random samples of the data instead of all points at once.
//       </p>
//       <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto">
//         <p className="text-yellow-800 font-medium">🚧 Coming Soon!</p>
//         <p className="text-yellow-700 text-sm mt-1">
//           Interactive batch size selection and speed comparison.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default MiniBatchKMeans;

// // src/components/algorithms/KMeans/FuzzyKMeans.js
// import React from 'react';
// import { Layers } from 'lucide-react';

// function FuzzyKMeans() {
//   return (
//     <div className="text-center py-16">
//       <Layers className="mx-auto text-gray-400 mb-4" size={64} />
//       <h3 className="text-2xl font-bold text-gray-800 mb-2">Fuzzy K-Means (FCM)</h3>
//       <p className="text-gray-600 mb-6">
//         Soft clustering where each point has a membership degree to multiple clusters.
//       </p>
//       <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto">
//         <p className="text-yellow-800 font-medium">🚧 Coming Soon!</p>
//         <p className="text-yellow-700 text-sm mt-1">
//           Visualize membership probabilities with color gradients.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default FuzzyKMeans;