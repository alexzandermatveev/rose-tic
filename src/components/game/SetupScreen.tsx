import { Button } from '@/components/ui/button';
import { SymbolSelector } from './SymbolSelector';
import { DifficultySelector } from './DifficultySelector';
import { StatsCounter } from './StatsCounter';
import { PlayerSymbol, Difficulty } from '@/hooks/useGameLogic';
import { Play } from 'lucide-react';

interface SetupScreenProps {
  playerSymbol: PlayerSymbol;
  difficulty: Difficulty;
  stats: { wins: number; losses: number; draws: number };
  onSymbolSelect: (symbol: PlayerSymbol) => void;
  onDifficultySelect: (difficulty: Difficulty) => void;
  onStartGame: () => void;
}

export const SetupScreen = ({
  playerSymbol,
  difficulty,
  stats,
  onSymbolSelect,
  onDifficultySelect,
  onStartGame,
}: SetupScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-semibold text-foreground tracking-tight">
          Tic-Tac-Toe
        </h1>
        <p className="text-sm text-muted-foreground">
          Elegant gaming experience
        </p>
      </div>

      {/* Stats */}
      {(stats.wins > 0 || stats.losses > 0 || stats.draws > 0) && (
        <div className="glass-card rounded-xl px-6 py-3">
          <StatsCounter {...stats} />
        </div>
      )}

      {/* Setup options */}
      <div className="glass-card rounded-2xl p-6 w-full max-w-sm space-y-6">
        <SymbolSelector
          selectedSymbol={playerSymbol}
          onSelect={onSymbolSelect}
        />

        <div className="h-px bg-border/50" />

        <DifficultySelector
          selectedDifficulty={difficulty}
          onSelect={onDifficultySelect}
        />
      </div>

      {/* Start button */}
      <Button
        onClick={onStartGame}
        size="lg"
        className="gold-gradient text-white hover:opacity-90 gap-2 px-8 shadow-glow"
      >
        <Play size={20} />
        Start Game
      </Button>
    </div>
  );
};
