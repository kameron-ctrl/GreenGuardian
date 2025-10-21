
import { PredictionResponse } from '../types/prediction';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getPrediction(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Prediction failed');
  }

  return res.json();
}
