import { Trophy, XCircle, Equal, Loader2 } from 'lucide-react';

interface StatsCounterProps {
  wins: number;
  losses: number;
  draws: number;
  isLoading?: boolean;
  error?: string | null;
}

export const StatsCounter = ({ wins, losses, draws, isLoading, error }: StatsCounterProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 py-2">
        <Loader2 size={16} className="animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading stats...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center gap-2 py-2">
        <span className="text-sm text-destructive">Failed to load stats</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-6">
      <div className="flex items-center gap-1.5">
        <Trophy size={16} className="text-accent" />
        <span className="text-sm font-semibold text-foreground">{wins}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <XCircle size={16} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">{losses}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Equal size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">{draws}</span>
      </div>
    </div>
  );
};
