
import { PredictionResponse } from '../types/prediction';

export async function getPrediction(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Prediction failed');
  }

  return res.json();
}
