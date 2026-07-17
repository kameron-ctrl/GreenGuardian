import { PredictionResponse } from '../types/prediction';

// The backend endpoint is configured per-deployment via NEXT_PUBLIC_API_URL.
// It is intentionally NOT hardcoded so this open-source repo does not ship a
// specific project's API endpoint — each deployment (or contributor running
// locally) supplies its own. See .env.example.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPrediction(file: File): Promise<PredictionResponse> {
  if (!API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not configured. Copy web/.env.example to ' +
        'web/.env.local and set your backend URL.',
    );
  }

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
