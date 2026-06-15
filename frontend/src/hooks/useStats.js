import { useState, useEffect, useCallback } from 'react';
import { getStats, getRecentScans } from '../services/api';

export const useStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, recentData] = await Promise.all([
        getStats(),
        getRecentScans(10)
      ]);
      setStats(statsData);
      setRecentScans(recentData);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, recentScans, loading, error, refreshStats: fetchDashboardData };
};
