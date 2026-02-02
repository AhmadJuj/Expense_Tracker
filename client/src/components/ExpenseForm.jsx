import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EXPENSE_CATEGORIES } from '@/constants/categories';

export function ExpenseForm({ open, onOpenChange, onSubmit, initialData = null, expenses = [] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  
  // Get available categories: predefined (except Other) + custom categories + Other at the end
  const availableCategories = useMemo(() => {
    const customCategories = new Set();
    
    // Extract custom categories from expenses
    expenses.forEach(expense => {
      if (expense.category && !EXPENSE_CATEGORIES.includes(expense.category)) {
        customCategories.add(expense.category);
      }
    });
    
    // Combine: predefined (without Other) + sorted custom + Other at end
    const predefined = EXPENSE_CATEGORIES.filter(cat => cat !== 'Other');
    const custom = Array.from(customCategories).sort();
    
    return [...predefined, ...custom, 'Other'];
  }, [expenses]);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const category = watch('category');

  useEffect(() => {
    if (initialData) {
      const isCustomCategory = !EXPENSE_CATEGORIES.includes(initialData.category);
      if (isCustomCategory) {
        setValue('category', 'Other');
        setCustomCategory(initialData.category);
      } else {
        setValue('category', initialData.category);
      }
      setValue('description', initialData.description || '');
      setValue('date', initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    const submitData = { 
      ...data, 
      category: category === 'Other' && customCategory ? customCategory : data.category 
    };
    await onSubmit(submitData);
    setIsLoading(false);
    reset();
    setCustomCategory('');
  };

  const handleClose = () => {
    reset();
    setCustomCategory('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update your expense details below.' : 'Fill in the details to add a new expense.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            {category === 'Other' && (
              <div className="grid gap-2">
                <Label htmlFor="customCategory">Custom Category Name</Label>
                <Input
                  id="customCategory"
                  placeholder="Enter category name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="What was this expense for?"
                {...register('description')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
