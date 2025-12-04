import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useExpenses, useDeleteExpense, useInvalidateExpenses, Expense, TeamMember } from "@/hooks/useExpenses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Plus, Wallet, Users, TrendingUp, DollarSign } from "lucide-react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import TeamOverview from "@/components/TeamOverview";

export type { Expense, TeamMember };

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { data, isLoading } = useExpenses();
  const deleteExpense = useDeleteExpense();
  const invalidateExpenses = useInvalidateExpenses();

  const expenses = data?.expenses || [];
  const teamMembers = data?.teamMembers || [];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense.mutate(id);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpense(null);
    invalidateExpenses();
  };

  const myExpenses = expenses.filter((e) => e.user_id === user?.id);
  const myPersonalExpenses = myExpenses.filter((e) => e.category === "Personal");
  const myPersonalTotal = myPersonalExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  const teamExpenses = expenses.filter((e) => e.category === "Team");
  const teamTotal = teamExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  const myTeamExpenses = teamExpenses.filter((e) => e.user_id === user?.id);
  const myContribution = myTeamExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  const myTotalSpent = myPersonalTotal + myContribution;

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Mobile-optimized header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-10 safe-area-top">
        <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">TripTrack</h1>
              <p className="text-xs text-muted-foreground">Team Expenses</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="h-10 px-3">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats Cards - Full Width */}
        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="stat-card p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">৳{myTotalSpent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>

          <div className="stat-card p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">৳{myPersonalTotal.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Personal</p>
            </div>
          </div>

          <div className="stat-card p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Users className="w-7 h-7 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">৳{teamTotal.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Team Pool</p>
            </div>
          </div>

          <div className="stat-card p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">৳{myContribution.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">My Share</p>
            </div>
          </div>
        </div>

        {/* Team Overview */}
        {teamMembers.length > 0 && teamTotal > 0 && (
          <TeamOverview members={teamMembers} totalSpent={teamTotal} currentUserId={user?.id || ""} />
        )}

        {/* My Expenses Section */}
        <div className="flex justify-between items-center pt-4">
          <h2 className="text-xl font-bold text-foreground">My Expenses</h2>
        </div>

        {/* Expense Form Modal */}
        {showForm && (
          <ExpenseForm
            expense={editingExpense}
            userId={user?.id || ""}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
          />
        )}

        {/* Expenses List */}
        <ExpenseTable
          expenses={myExpenses}
          currentUserId={user?.id || ""}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 safe-area-bottom z-20">
        <Button
          onClick={handleAddExpense}
          size="lg"
          className="btn-hero h-14 w-14 rounded-full shadow-lg shadow-primary/30 p-0"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
