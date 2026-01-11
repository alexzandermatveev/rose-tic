import { Diamond, Circle } from 'lucide-react';
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
    'symbol-icon transition-all',
    animated && 'animate-symbol-enter',
    className
  );

  if (symbol === 'diamond') {
    return (
      <Diamond 
        size={size} 
        className={baseClasses}
        strokeWidth={1.5}
      />
    );
  }

  return (
    <Circle 
      size={size} 
      className={baseClasses}
      strokeWidth={1.5}
    />
  );
};
