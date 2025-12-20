import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/constants/categories';

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
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4 flex-1">
              <div 
                className="w-2 h-12 rounded-full" 
                style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{expense.category}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(expense.date)}
                  </span>
                </div>
                {expense.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {expense.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{formatCurrency(expense.amount)}</p>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
