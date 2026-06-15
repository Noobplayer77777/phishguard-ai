import { useState } from 'react';
import { analyzeUrl } from '../services/api';

export const useAnalyze = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const analyze = async (url) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await analyzeUrl(url);
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to analyze URL';
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

  return { analyze, loading, error, result, reset };
};
