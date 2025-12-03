import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Expense {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface TeamMember {
  id: string;
  full_name: string;
  total: number;
}

const fetchExpensesData = async () => {
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (expensesError) throw expensesError;

  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, full_name");

  let teamMembers: TeamMember[] = [];
  if (profilesData && expensesData) {
    const memberTotals = profilesData.map((profile) => {
      const total = expensesData
        .filter((e) => e.user_id === profile.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return { id: profile.id, full_name: profile.full_name, total };
    });
    teamMembers = memberTotals.filter((m) => m.total > 0);
  }

  return { expenses: expensesData || [], teamMembers };
};

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpensesData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense deleted");
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    },
  });
};

export const useInvalidateExpenses = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["expenses"] });
};
