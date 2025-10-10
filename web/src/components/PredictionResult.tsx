import { PredictionResponse } from '../types/prediction';

export default function PredictionResult({ result }: { result: PredictionResponse }) {
  const confidencePercentage = (result.confidence * 100).toFixed(1);
  const confidenceLevel = result.confidence > 0.8 ? 'high' : result.confidence > 0.6 ? 'medium' : 'low';
  
  const getConfidenceColor = () => {
    if (confidenceLevel === 'high') return 'from-green-500 to-emerald-600';
    if (confidenceLevel === 'medium') return 'from-yellow-500 to-orange-600';
    return 'from-orange-500 to-red-600';
  };

  const getConfidenceText = () => {
    if (confidenceLevel === 'high') return 'High Confidence';
    if (confidenceLevel === 'medium') return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl p-6 border-2 border-green-200 dark:border-green-800 shadow-lg animate-fadeIn">
      <div className="flex items-start gap-4">
       
        <div className="flex-shrink-0">
          <div className={`bg-gradient-to-br ${getConfidenceColor()} p-3 rounded-full shadow-md`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">
              Diagnosis Result
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.label}
            </p>
          </div>

         
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {getConfidenceText()}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {confidencePercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getConfidenceColor()} rounded-full transition-all duration-1000 ease-out shadow-inner`}
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {confidenceLevel === 'high' 
                  ? 'The model is highly confident in this diagnosis. Consider consulting with plant care resources for treatment options.'
                  : confidenceLevel === 'medium'
                  ? 'The model has moderate confidence. Consider taking additional photos or consulting an expert for confirmation.'
                  : 'The model has low confidence. We recommend taking clearer photos or consulting a plant expert for accurate diagnosis.'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}