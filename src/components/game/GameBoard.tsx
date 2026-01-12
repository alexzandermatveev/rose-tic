import { CellValue } from '@/hooks/useGameLogic';
import { GameCell } from './GameCell';

interface GameBoardProps {
  board: CellValue[];
  winningLine: number[] | null;
  isPlayerTurn: boolean;
  isGameOver: boolean;
  onCellClick: (index: number) => void;
}

export const GameBoard = ({ board, winningLine, isPlayerTurn, isGameOver, onCellClick }: GameBoardProps) => {
  // Debug logs
  console.log('[DEBUG] GameBoard render:', { board, isPlayerTurn, isGameOver, winningLine });
  
  return (
    <div className="glass-card rounded-2xl p-4 shadow-glass">
      <div className="grid grid-cols-3 w-full max-w-[280px] mx-auto aspect-square">
        {board.map((value, index) => (
          <GameCell
            key={index}
            value={value}
            index={index}
            isWinningCell={winningLine?.includes(index) || false}
            isDisabled={isGameOver || !isPlayerTurn}
            onClick={() => onCellClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
