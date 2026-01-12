import { Trophy, XCircle, Equal } from 'lucide-react';

interface StatsCounterProps {
  wins: number;
  losses: number;
  draws: number;
}

export const StatsCounter = ({ wins, losses, draws }: StatsCounterProps) => {
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
