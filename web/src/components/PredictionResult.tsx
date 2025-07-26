
import { PredictionResponse } from '../types/prediction';

export default function PredictionResult({ result }: { result: PredictionResponse }) {
  return (
    <div className="mt-6 bg-green-50 p-4 rounded-md border border-green-200">
      <p className="text-xl font-semibold text-green-800">
        🌱 Disease: {result.label}
      </p>
      <p className="text-md text-green-600">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
    </div>
  );
}
