
import { PredictionResponse } from '../types/prediction';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qfpsilmnvg.execute-api.us-east-1.amazonaws.com/prod';

export async function getPrediction(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Prediction failed (${res.status} ${res.statusText})${body ? `: ${body}` : ''}`,
    );
  }

  return res.json();
}
