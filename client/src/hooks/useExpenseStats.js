import { useState, useEffect } from 'react';
import { expenseService } from '@/services/expenseService';

export function useExpenseStats(filters = {}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await expenseService.getStats(filters);
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [JSON.stringify(filters)]);

  return { stats, loading, error };
}
