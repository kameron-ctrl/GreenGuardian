'use client';

import { useState } from 'react';
import { getPrediction } from '../lib/api';
import PredictionResult from './PredictionResult';
import { PredictionResponse } from '../types/prediction';

export default function DiagnoseForm() {
  const [file, setFile] = useState<File | null>(null); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const prediction = await getPrediction(file);
      setResult(prediction);
    } catch (err) {
      setError('Prediction failed. Try again.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={!file || loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Diagnosing...' : 'Diagnose Plant'}
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {result && <PredictionResult result={result} />}
    </form>
  );
}
