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

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({});

  const { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses(filters);
  const { stats } = useExpenseStats(filters);

  const handleFormSubmit = async (data) => {
    if (editingExpense) {
      const result = await updateExpense(editingExpense._id, data);
      if (result.success) {
        setIsFormOpen(false);
        setEditingExpense(null);
      }
    } else {
      const result = await addExpense(data);
      if (result.success) {
        setIsFormOpen(false);
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Expense Tracker</h1>
            <p className="text-muted-foreground mt-2">
              Keep track of your spending and manage your budget
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <ExpenseStats stats={stats} />

        <ExpenseFilters filters={filters} onFilterChange={handleFilterChange} />

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
            if (!open) setEditingExpense(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingExpense}
        />

        <Toaster />
      </div>
    </div>
  );
}

export default App;
