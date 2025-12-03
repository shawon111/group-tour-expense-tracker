import { Users } from "lucide-react";
import type { TeamMember } from "@/hooks/useExpenses";

interface TeamOverviewProps {
  members: TeamMember[];
  totalSpent: number;
  currentUserId: string;
}

const TeamOverview = ({ members, totalSpent, currentUserId }: TeamOverviewProps) => {
  const sortedMembers = [...members].sort((a, b) => b.total - a.total);

  return (
    <div className="card-expense p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-accent" />
        <h3 className="font-semibold text-sm text-foreground">Team Breakdown</h3>
      </div>

      <div className="space-y-2.5">
        {sortedMembers.map((member) => {
          const percentage = totalSpent > 0 ? (member.total / totalSpent) * 100 : 0;
          const isCurrentUser = member.id === currentUserId;

          return (
            <div key={member.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                  {member.full_name}
                  {isCurrentUser && (
                    <span className="ml-1 text-[10px] text-primary">(You)</span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  ৳{member.total.toLocaleString()} · {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCurrentUser ? "bg-primary" : "bg-accent"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamOverview;
