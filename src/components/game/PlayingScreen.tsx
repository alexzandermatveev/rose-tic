import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameBoard } from './GameBoard';
import { GameStatusBar } from './GameStatusBar';
import { StatsCounter } from './StatsCounter';
import { CellValue, PlayerSymbol } from '@/hooks/useGameLogic';

interface PlayingScreenProps {
  board: CellValue[];
  currentTurn: PlayerSymbol;
  playerSymbol: PlayerSymbol;
  winningLine: number[] | null;
  stats: { wins: number; losses: number; draws: number };
  isGameOver: boolean;
  onCellClick: (index: number) => void;
  onSettings: () => void;
}

export const PlayingScreen = ({
  board,
  currentTurn,
  playerSymbol,
  winningLine,
  stats,
  isGameOver,
  onCellClick,
  onSettings,
}: PlayingScreenProps) => {
  const isPlayerTurn = currentTurn === playerSymbol;
  
  // Debug logs
  console.log('[DEBUG] PlayingScreen render:', {
    board,
    currentTurn,
    playerSymbol,
    isPlayerTurn,
    isGameOver,
    boardLength: board.length,
    boardValues: board.map((v, i) => ({ index: i, value: v }))
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between">
        <h1 className="font-serif text-xl font-semibold text-foreground">
          Tic-Tac-Toe
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettings}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings size={20} />
        </Button>
      </div>

      {/* Stats */}
      <StatsCounter {...stats} />

      {/* Status bar */}
      <GameStatusBar
        currentTurn={currentTurn}
        playerSymbol={playerSymbol}
        isGameOver={isGameOver}
      />

      {/* Game board */}
      <GameBoard
        board={board}
        winningLine={winningLine}
        isPlayerTurn={isPlayerTurn}
        isGameOver={isGameOver}
        onCellClick={onCellClick}
      />
    </div>
  );
};
