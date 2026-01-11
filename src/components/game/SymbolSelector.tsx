import { cn } from '@/lib/utils';
import { PlayerSymbol } from '@/hooks/useGameLogic';
import { GameSymbol } from './GameSymbol';

interface SymbolSelectorProps {
  selectedSymbol: PlayerSymbol;
  onSelect: (symbol: PlayerSymbol) => void;
}

export const SymbolSelector = ({ selectedSymbol, onSelect }: SymbolSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-muted-foreground text-center">
        Choose Your Symbol
      </label>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => onSelect('diamond')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300',
            'border-2 hover:scale-105',
            selectedSymbol === 'diamond'
              ? 'border-accent bg-accent/10 shadow-glow'
              : 'border-border/50 bg-card/50 hover:border-accent/50'
          )}
        >
          <GameSymbol symbol="diamond" size={40} animated={false} />
          <span className="text-xs font-medium text-muted-foreground">Diamond</span>
        </button>
        <button
          onClick={() => onSelect('ring')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300',
            'border-2 hover:scale-105',
            selectedSymbol === 'ring'
              ? 'border-accent bg-accent/10 shadow-glow'
              : 'border-border/50 bg-card/50 hover:border-accent/50'
          )}
        >
          <GameSymbol symbol="ring" size={40} animated={false} />
          <span className="text-xs font-medium text-muted-foreground">Ring</span>
        </button>
      </div>
    </div>
  );
};
