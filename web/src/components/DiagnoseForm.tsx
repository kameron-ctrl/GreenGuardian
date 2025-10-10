'use client';

import { useState } from 'react';
import { getPrediction } from '../lib/api';
import PredictionResult from './PredictionResult';
import { PredictionResponse } from '../types/prediction';

export default function DiagnoseForm() {
  const [file, setFile] = useState<File | null>(null); 
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResult(null);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
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
      setError('Prediction failed. Please try again with a different image.');
    }

    setLoading(false);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div className="relative">
          <label 
            htmlFor="file-upload" 
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl cursor-pointer bg-green-50/50 dark:bg-green-950/30 hover:bg-green-100/50 dark:hover:bg-green-900/30 transition-all duration-200"
          >
            {preview ? (
              <div className="relative w-full h-full p-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReset();
                  }}
                  className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg 
                  className="w-16 h-16 mb-4 text-green-500 dark:text-green-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PNG, JPG or JPEG (MAX. 10MB)
                </p>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Image...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Diagnose Plant Disease
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-red-800 dark:text-red-300">Error</p>
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && <PredictionResult result={result} />}
    </div>
  );
}