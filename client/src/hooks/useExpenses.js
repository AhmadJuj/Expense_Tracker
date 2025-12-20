import { useState, useEffect } from 'react';
import { expenseService } from '@/services/expenseService';

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAll(filters);
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [JSON.stringify(filters)]);

  const addExpense = async (expenseData) => {
    try {
      await expenseService.create(expenseData);
      await fetchExpenses();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to add expense' 
      };
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      await expenseService.update(id, expenseData);
      await fetchExpenses();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update expense' 
      };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseService.delete(id);
      await fetchExpenses();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to delete expense' 
      };
    }
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refresh: fetchExpenses
  };
}
