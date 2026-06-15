import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeUrl = async (url) => {
  const response = await api.post('/analyze', { url });
  return response.data;
};

export const uploadCsvBatch = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/analyze/batch', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getRecentScans = async (limit = 10) => {
  const response = await api.get(`/recent?limit=${limit}`);
  return response.data;
};

export const getHistory = async (page = 1, limit = 10, search = '') => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  
  const response = await api.get(`/history?${params.toString()}`);
  return response.data;
};

export default api;
