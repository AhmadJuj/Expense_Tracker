import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseStats } from '@/components/ExpenseStats';
import { ExpenseFilters } from '@/components/ExpenseFilters';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

// Hardcoded sample data
const INITIAL_EXPENSES = [
  {
    _id: '1',
    amount: 45.50,
    category: 'Food',
    description: 'Grocery shopping',
    date: '2025-12-18'
  },
  {
    _id: '2',
    amount: 120.00,
    category: 'Transportation',
    description: 'Monthly bus pass',
    date: '2025-12-15'
  },
  {
    _id: '3',
    amount: 85.75,
    category: 'Entertainment',
    description: 'Movie tickets and dinner',
    date: '2025-12-14'
  },
  {
    _id: '4',
    amount: 200.00,
    category: 'Shopping',
    description: 'New shoes',
    date: '2025-12-12'
  },
  {
    _id: '5',
    amount: 35.00,
    category: 'Food',
    description: 'Restaurant lunch',
    date: '2025-12-10'
  },
  {
    _id: '6',
    amount: 60.00,
    category: 'Utilities',
    description: 'Internet bill',
    date: '2025-12-08'
  },
  {
    _id: '7',
    amount: 150.00,
    category: 'Healthcare',
    description: 'Doctor visit',
    date: '2025-12-05'
  },
  {
    _id: '8',
    amount: 25.50,
    category: 'Food',
    description: 'Coffee shop',
    date: '2025-12-03'
  }
];

function ExpenseTracker() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({});
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  // Calculate stats from expenses
  const stats = useMemo(() => {
    const filteredExpenses = applyFilters(expenses, filters);
    
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = filteredExpenses.length;
    
    // Category breakdown
    const categoryMap = {};
    filteredExpenses.forEach(exp => {
      if (!categoryMap[exp.category]) {
        categoryMap[exp.category] = { total: 0, count: 0 };
      }
      categoryMap[exp.category].total += exp.amount;
      categoryMap[exp.category].count += 1;
    });

    // Convert to array format expected by ExpenseStats
    const byCategory = Object.entries(categoryMap).map(([category, data]) => ({
      _id: category,
      total: data.total,
      count: data.count
    }));

    return {
      totalExpenses: total,
      totalTransactions: count,
      byCategory
    };
  }, [expenses, filters]);

  // Filter expenses based on filters
  const filteredExpenses = useMemo(() => {
    return applyFilters(expenses, filters);
  }, [expenses, filters]);

  function applyFilters(expenseList, filters) {
    let filtered = [...expenseList];

    if (filters.category) {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    if (filters.startDate) {
      filtered = filtered.filter(exp => exp.date >= filters.startDate);
    }

    if (filters.endDate) {
      filtered = filtered.filter(exp => exp.date <= filters.endDate);
    }

    if (filters.minAmount !== undefined && filters.minAmount !== '') {
      filtered = filtered.filter(exp => exp.amount >= parseFloat(filters.minAmount));
    }

    if (filters.maxAmount !== undefined && filters.maxAmount !== '') {
      filtered = filtered.filter(exp => exp.amount <= parseFloat(filters.maxAmount));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const handleFormSubmit = async (data) => {
    if (editingExpense) {
      // Update expense
      setExpenses(prev => prev.map(exp => 
        exp._id === editingExpense._id 
          ? { ...exp, ...data }
          : exp
      ));
      toast({
        title: 'Success',
        description: 'Expense updated successfully'
      });
      setIsFormOpen(false);
      setEditingExpense(null);
    } else {
      // Add new expense
      const newExpense = {
        _id: Date.now().toString(),
        ...data,
        amount: parseFloat(data.amount)
      };
      setExpenses(prev => [...prev, newExpense]);
      toast({
        title: 'Success',
        description: 'Expense added successfully'
      });
      setIsFormOpen(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    setExpenses(prev => prev.filter(exp => exp._id !== id));
    toast({
      title: 'Success',
      description: 'Expense deleted successfully'
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Expense Tracker</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              Keep track of your spending and manage your budget
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <ExpenseStats stats={stats} />

        <ExpenseFilters filters={filters} onFilterChange={handleFilterChange} expenses={expenses} />

        <ExpenseList 
          expenses={filteredExpenses} 
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <ExpenseForm
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) {
              setTimeout(() => setEditingExpense(null), 200);
            }
          }}
          onSubmit={handleFormSubmit}
          initialData={editingExpense}
          expenses={expenses}
        />

        <Toaster />
      </div>
    </div>
  );
}

export default ExpenseTracker;
