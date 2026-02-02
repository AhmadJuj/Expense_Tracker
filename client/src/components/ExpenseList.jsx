import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getCategoryColor } from '@/constants/categories';

export function ExpenseList({ expenses, onDelete, onEdit }) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No expenses found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click "Add Expense" to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start sm:items-center gap-2 sm:gap-4">
              <div 
                className="w-1 sm:w-2 h-12 sm:h-12 rounded-full flex-shrink-0" 
                style={{ backgroundColor: getCategoryColor(expense.category) }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h3 className="font-semibold text-sm sm:text-base">{expense.category}</h3>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {formatDate(expense.date)}
                  </span>
                </div>
                {expense.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1 sm:line-clamp-none">
                    {expense.description}
                  </p>
                )}
                <p className="text-base sm:text-xl font-bold mt-1 sm:hidden">{formatCurrency(expense.amount)}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xl font-bold">{formatCurrency(expense.amount)}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(expense._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="flex sm:hidden gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(expense)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete(expense._id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
