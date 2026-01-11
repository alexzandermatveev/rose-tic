import { PlayerSymbol } from '@/hooks/useGameLogic';
import { GameSymbol } from './GameSymbol';

interface GameStatusBarProps {
  currentTurn: PlayerSymbol;
  playerSymbol: PlayerSymbol;
  isGameOver: boolean;
}

export const GameStatusBar = ({ currentTurn, playerSymbol, isGameOver }: GameStatusBarProps) => {
  const isPlayerTurn = currentTurn === playerSymbol;

  if (isGameOver) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl px-4 py-2.5 flex items-center justify-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        {isPlayerTurn ? 'Your turn' : 'Opponent thinking...'}
      </span>
      <div className={isPlayerTurn ? '' : 'animate-pulse opacity-70'}>
        <GameSymbol symbol={currentTurn} size={24} animated={false} />
      </div>
    </div>
  );
};
