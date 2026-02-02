import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseStats } from '@/components/ExpenseStats';
import { ExpenseFilters } from '@/components/ExpenseFilters';
import { Toaster } from '@/components/ui/toaster';
import { useExpenses } from '@/hooks/useExpenses';
import { useExpenseStats } from '@/hooks/useExpenseStats';

function ExpenseTracker() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({});

  const { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses(filters);
  const { stats, refresh: refreshStats } = useExpenseStats(filters);

  const handleFormSubmit = async (data) => {
    if (editingExpense) {
      const result = await updateExpense(editingExpense._id, data);
      if (result.success) {
        setIsFormOpen(false);
        setEditingExpense(null);
        refreshStats();
      }
    } else {
      const result = await addExpense(data);
      if (result.success) {
        setIsFormOpen(false);
        refreshStats();
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    refreshStats();
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, _timestamp: Date.now() });
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading expenses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <ExpenseList 
            expenses={expenses} 
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}

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
