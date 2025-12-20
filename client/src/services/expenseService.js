import axios from 'axios';

const API_URL = '/api/expenses';

export const expenseService = {
  // Get all expenses with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.category) params.append('category', filters.category);
    
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  },

  // Get single expense by ID
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create new expense
  create: async (expenseData) => {
    const response = await axios.post(API_URL, expenseData);
    return response.data;
  },

  // Update expense
  update: async (id, expenseData) => {
    const response = await axios.put(`${API_URL}/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Get expense statistics
  getStats: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await axios.get(`${API_URL}/stats?${params}`);
    return response.data;
  }
};
