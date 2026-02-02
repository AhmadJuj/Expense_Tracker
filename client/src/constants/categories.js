export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other'
];

export const CATEGORY_COLORS = {
  Food: '#FF6B6B',
  Transport: '#4ECDC4',
  Entertainment: '#45B7D1',
  Shopping: '#FFA07A',
  Bills: '#98D8C8',
  Healthcare: '#FF8ED4',
  Other: '#95A5A6'
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#6B7280';
};
