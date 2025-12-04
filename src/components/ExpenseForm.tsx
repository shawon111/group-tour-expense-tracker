import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";
import { z } from "zod";
import type { Expense } from "@/hooks/useExpenses";

const expenseSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters").max(200),
  amount: z.number().positive("Amount must be positive").max(10000000, "Amount too large"),
  category: z.string().min(1, "Please select a category"),
});

const CATEGORIES = ["Personal", "Team"];

interface ExpenseFormProps {
  expense: Expense | null;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ExpenseForm = ({ expense, userId, onSuccess, onCancel }: ExpenseFormProps) => {
  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");
  const [category, setCategory] = useState(expense?.category || "Personal");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = expenseSchema.safeParse({
        description: description.trim(),
        amount: parseFloat(amount),
        category,
      });

      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setLoading(false);
        return;
      }

      if (expense) {
        const { error } = await supabase
          .from("expenses")
          .update({
            description: description.trim(),
            amount: parseFloat(amount),
            category,
          })
          .eq("id", expense.id);

        if (error) throw error;
        toast.success("Expense updated");
      } else {
        const { error } = await supabase.from("expenses").insert({
          user_id: userId,
          description: description.trim(),
          amount: parseFloat(amount),
          category,
        });

        if (error) throw error;
        toast.success("Expense added");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl border border-border shadow-lg w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">
            {expense ? "Edit Expense" : "Add Expense"}
          </h3>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Snacks for the group"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (৳)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-hero"
              disabled={loading}
            >
              {loading ? "Saving..." : expense ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
