import { cn } from '@/lib/utils';
import { CellValue } from '@/hooks/useGameLogic';
import { GameSymbol } from './GameSymbol';

interface GameCellProps {
  value: CellValue;
  index: number;
  isWinningCell: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export const GameCell = ({ value, index, isWinningCell, isDisabled, onClick }: GameCellProps) => {
  const getBorderClasses = () => {
    const borders: string[] = [];
    
    // Add borders based on position
    if (index < 6) borders.push('border-b');
    if (index % 3 !== 2) borders.push('border-r');
    
    return borders.join(' ');
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled || value !== null}
      className={cn(
        'aspect-square flex items-center justify-center',
        'border-border/40 transition-all duration-300',
        getBorderClasses(),
        'hover:bg-muted/30 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-inset',
        'disabled:cursor-not-allowed disabled:hover:bg-transparent',
        isWinningCell && 'bg-accent/20 animate-pulse-gold'
      )}
      aria-label={`Cell ${index + 1}${value ? `, contains ${value}` : ', empty'}`}
    >
      <GameSymbol symbol={value} size={56} />
    </button>
  );
};
