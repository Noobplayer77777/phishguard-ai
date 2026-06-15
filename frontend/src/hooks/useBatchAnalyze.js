import { useState } from 'react';
import { uploadCsvBatch } from '../services/api';

export const useBatchAnalyze = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const analyzeBatch = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await uploadCsvBatch(file);
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to analyze batch';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { analyzeBatch, loading, error, result, reset };
};
