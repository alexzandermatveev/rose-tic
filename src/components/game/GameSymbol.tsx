import { cn } from '@/lib/utils';
import { CellValue } from '@/hooks/useGameLogic';

interface GameSymbolProps {
  symbol: CellValue;
  className?: string;
  size?: number;
  animated?: boolean;
}

export const GameSymbol = ({ symbol, className, size = 48, animated = true }: GameSymbolProps) => {
  if (!symbol) return null;

  const baseClasses = cn(
    'symbol-icon transition-all flex items-center justify-center',
    animated && 'animate-symbol-enter',
    className
  );

  const emojiStyle = {
    fontSize: `${size}px`,
    lineHeight: 1,
  };

  if (symbol === 'diamond') {
    return (
      <div className={baseClasses} style={emojiStyle}>
        💎
      </div>
    );
  }

  return (
    <div className={baseClasses} style={emojiStyle}>
      💍
    </div>
  );
};
