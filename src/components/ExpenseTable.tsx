import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Receipt } from "lucide-react";
import type { Expense } from "@/hooks/useExpenses";

interface ExpenseTableProps {
  expenses: Expense[];
  currentUserId: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseTable = ({ expenses, currentUserId, onEdit, onDelete }: ExpenseTableProps) => {
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="card-expense text-center py-10 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-muted mx-auto mb-3 flex items-center justify-center">
          <Receipt className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No expenses yet</h3>
        <p className="text-sm text-muted-foreground">
          Tap + to add your first expense
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="card-expense p-5 w-full"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate mb-1">
                {expense.description}
              </h3>
              <span className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground inline-block">
                {expense.category}
              </span>
            </div>
            <p className="text-2xl font-bold text-primary shrink-0">
              ৳{Number(expense.amount).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {formatDate(expense.created_at)}
            </p>
            
            {expense.user_id === currentUserId && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(expense)}
                  className="h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary"
                >
                  <Pencil className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseTable;
