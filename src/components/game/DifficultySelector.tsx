import { cn } from '@/lib/utils';
import { Difficulty } from '@/hooks/useGameLogic';
import { Sparkles, Target, Crown } from 'lucide-react';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties: { value: Difficulty; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'relaxed',
    label: 'Relaxed',
    description: 'Easy & fun',
    icon: <Sparkles size={20} />,
  },
  {
    value: 'strategic',
    label: 'Strategic',
    description: 'A fair challenge',
    icon: <Target size={20} />,
  },
  {
    value: 'master',
    label: 'Master',
    description: 'Test your skill',
    icon: <Crown size={20} />,
  },
];

export const DifficultySelector = ({ selectedDifficulty, onSelect }: DifficultySelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-muted-foreground text-center">
        Select Difficulty
      </label>
      <div className="flex gap-2 justify-center">
        {difficulties.map(({ value, label, description, icon }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-300',
              'border-2 hover:scale-105 min-w-[85px]',
              selectedDifficulty === value
                ? 'border-accent bg-accent/10 shadow-glow'
                : 'border-border/50 bg-card/50 hover:border-accent/50'
            )}
          >
            <span className={cn(
              'transition-colors',
              selectedDifficulty === value ? 'text-accent' : 'text-muted-foreground'
            )}>
              {icon}
            </span>
            <span className="text-xs font-semibold">{label}</span>
            <span className="text-[10px] text-muted-foreground">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
