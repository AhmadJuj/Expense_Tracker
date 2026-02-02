import { useState, useMemo } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { X } from 'lucide-react';

export function ExpenseFilters({ filters, onFilterChange, expenses = [] }) {
  const [startDate, setStartDate] = useState(filters.startDate || '');
  const [endDate, setEndDate] = useState(filters.endDate || '');
  const [category, setCategory] = useState(filters.category || '');

  // Get unique categories from expenses, excluding 'Other' and including custom categories
  const availableCategories = useMemo(() => {
    const uniqueCategories = new Set();
    
    // Add predefined categories except 'Other'
    EXPENSE_CATEGORIES.filter(cat => cat !== 'Other').forEach(cat => uniqueCategories.add(cat));
    
    // Add custom categories from expenses
    expenses.forEach(expense => {
      if (expense.category && !EXPENSE_CATEGORIES.includes(expense.category)) {
        uniqueCategories.add(expense.category);
      }
    });
    
    return Array.from(uniqueCategories).sort();
  }, [expenses]);

  const handleApply = () => {
    onFilterChange({ startDate, endDate, category });
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setCategory('');
    onFilterChange({});
  };

  const hasActiveFilters = startDate || endDate || category;

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="pt-4 sm:pt-6 pb-4">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select value={category || 'all'} onValueChange={(value) => setCategory(value === 'all' ? '' : value)}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2 sm:col-span-2 md:col-span-1">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
