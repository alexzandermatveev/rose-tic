import { useState, useCallback, useEffect } from 'react';

export type CellValue = 'diamond' | 'ring' | null;
export type Difficulty = 'relaxed' | 'strategic' | 'master';
export type GameStatus = 'setup' | 'playing' | 'win' | 'loss' | 'draw';
export type PlayerSymbol = 'diamond' | 'ring';

interface GameState {
  board: CellValue[];
  currentTurn: PlayerSymbol;
  playerSymbol: PlayerSymbol;
  computerSymbol: PlayerSymbol;
  difficulty: Difficulty;
  status: GameStatus;
  winningLine: number[] | null;
  stats: {
    wins: number;
    losses: number;
    draws: number;
  };
}

const WINNING_LINES = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal
  [2, 4, 6], // anti-diagonal
];

const initialState: GameState = {
  board: Array(9).fill(null),
  currentTurn: 'diamond',
  playerSymbol: 'diamond',
  computerSymbol: 'ring',
  difficulty: 'relaxed',
  status: 'setup',
  winningLine: null,
  stats: {
    wins: 0,
    losses: 0,
    draws: 0,
  },
};

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>(initialState);

  const checkWinner = useCallback((board: CellValue[]): { winner: CellValue; line: number[] } | null => {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line };
      }
    }
    return null;
  }, []);

  const isBoardFull = useCallback((board: CellValue[]): boolean => {
    return board.every(cell => cell !== null);
  }, []);

  const getEmptyCells = useCallback((board: CellValue[]): number[] => {
    return board.reduce<number[]>((acc, cell, index) => {
      if (cell === null) acc.push(index);
      return acc;
    }, []);
  }, []);

  // Relaxed AI: Random move
  const getRelaxedMove = useCallback((board: CellValue[]): number => {
    const emptyCells = getEmptyCells(board);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }, [getEmptyCells]);

  // Strategic AI: Tries to place adjacent to existing marks
  const getStrategicMove = useCallback((board: CellValue[], computerSymbol: PlayerSymbol): number => {
    const emptyCells = getEmptyCells(board);
    const computerCells = board.reduce<number[]>((acc, cell, index) => {
      if (cell === computerSymbol) acc.push(index);
      return acc;
    }, []);

    // Adjacent positions for each cell
    const adjacentMap: Record<number, number[]> = {
      0: [1, 3, 4],
      1: [0, 2, 3, 4, 5],
      2: [1, 4, 5],
      3: [0, 1, 4, 6, 7],
      4: [0, 1, 2, 3, 5, 6, 7, 8],
      5: [1, 2, 4, 7, 8],
      6: [3, 4, 7],
      7: [3, 4, 5, 6, 8],
      8: [4, 5, 7],
    };

    // Try to find an empty cell adjacent to an existing computer mark
    for (const computerCell of computerCells) {
      const adjacentCells = adjacentMap[computerCell];
      for (const adj of adjacentCells) {
        if (emptyCells.includes(adj)) {
          return adj;
        }
      }
    }

    // Fallback to center or random
    if (emptyCells.includes(4)) return 4;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }, [getEmptyCells]);

  // Master AI: Win-block logic
  const getMasterMove = useCallback((board: CellValue[], computerSymbol: PlayerSymbol, playerSymbol: PlayerSymbol): number => {
    const emptyCells = getEmptyCells(board);

    // Helper to check if a move would win for a given symbol
    const findWinningMove = (symbol: PlayerSymbol): number | null => {
      for (const cell of emptyCells) {
        const testBoard = [...board];
        testBoard[cell] = symbol;
        if (checkWinner(testBoard)) {
          return cell;
        }
      }
      return null;
    };

    // 1. Try to win
    const winMove = findWinningMove(computerSymbol);
    if (winMove !== null) return winMove;

    // 2. Block player from winning
    const blockMove = findWinningMove(playerSymbol);
    if (blockMove !== null) return blockMove;

    // 3. Take center if available
    if (emptyCells.includes(4)) return 4;

    // 4. Take corners
    const corners = [0, 2, 6, 8].filter(c => emptyCells.includes(c));
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Take any edge
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }, [getEmptyCells, checkWinner]);

  const getComputerMove = useCallback((board: CellValue[], difficulty: Difficulty, computerSymbol: PlayerSymbol, playerSymbol: PlayerSymbol): number => {
    switch (difficulty) {
      case 'relaxed':
        return getRelaxedMove(board);
      case 'strategic':
        return getStrategicMove(board, computerSymbol);
      case 'master':
        return getMasterMove(board, computerSymbol, playerSymbol);
      default:
        return getRelaxedMove(board);
    }
  }, [getRelaxedMove, getStrategicMove, getMasterMove]);

  const makeMove = useCallback((cellIndex: number) => {
    setState(prev => {
      if (prev.status !== 'playing' || prev.board[cellIndex] !== null || prev.currentTurn !== prev.playerSymbol) {
        return prev;
      }

      const newBoard = [...prev.board];
      newBoard[cellIndex] = prev.playerSymbol;

      // Check for winner
      const result = checkWinner(newBoard);
      if (result) {
        return {
          ...prev,
          board: newBoard,
          status: 'win',
          winningLine: result.line,
          stats: {
            ...prev.stats,
            wins: prev.stats.wins + 1,
          },
        };
      }

      // Check for draw
      if (isBoardFull(newBoard)) {
        return {
          ...prev,
          board: newBoard,
          status: 'draw',
          stats: {
            ...prev.stats,
            draws: prev.stats.draws + 1,
          },
        };
      }

      // Switch to computer's turn
      return {
        ...prev,
        board: newBoard,
        currentTurn: prev.computerSymbol,
      };
    });
  }, [checkWinner, isBoardFull]);

  // Computer makes a move when it's their turn
  useEffect(() => {
    if (state.status !== 'playing' || state.currentTurn !== state.computerSymbol) {
      return;
    }

    const timer = setTimeout(() => {
      const moveIndex = getComputerMove(state.board, state.difficulty, state.computerSymbol, state.playerSymbol);
      
      setState(prev => {
        const newBoard = [...prev.board];
        newBoard[moveIndex] = prev.computerSymbol;

        // Check for winner
        const result = checkWinner(newBoard);
        if (result) {
          return {
            ...prev,
            board: newBoard,
            status: 'loss',
            winningLine: result.line,
            stats: {
              ...prev.stats,
              losses: prev.stats.losses + 1,
            },
          };
        }

        // Check for draw
        if (isBoardFull(newBoard)) {
          return {
            ...prev,
            board: newBoard,
            status: 'draw',
            stats: {
              ...prev.stats,
              draws: prev.stats.draws + 1,
            },
          };
        }

        // Switch back to player
        return {
          ...prev,
          board: newBoard,
          currentTurn: prev.playerSymbol,
        };
      });
    }, 600); // Add delay for better UX

    return () => clearTimeout(timer);
  }, [state.status, state.currentTurn, state.computerSymbol, state.board, state.difficulty, state.playerSymbol, getComputerMove, checkWinner, isBoardFull]);

  const setPlayerSymbol = useCallback((symbol: PlayerSymbol) => {
    setState(prev => ({
      ...prev,
      playerSymbol: symbol,
      computerSymbol: symbol === 'diamond' ? 'ring' : 'diamond',
    }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setState(prev => ({
      ...prev,
      difficulty,
    }));
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      board: Array(9).fill(null),
      currentTurn: 'diamond', // Diamond (X) always goes first
      status: 'playing',
      winningLine: null,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      board: Array(9).fill(null),
      currentTurn: 'diamond',
      status: 'playing',
      winningLine: null,
    }));
  }, []);

  const goToSetup = useCallback(() => {
    setState(prev => ({
      ...prev,
      board: Array(9).fill(null),
      currentTurn: 'diamond',
      status: 'setup',
      winningLine: null,
    }));
  }, []);

  return {
    ...state,
    makeMove,
    setPlayerSymbol,
    setDifficulty,
    startGame,
    resetGame,
    goToSetup,
  };
};
