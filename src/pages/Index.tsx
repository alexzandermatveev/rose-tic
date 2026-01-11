import { useEffect, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useTelegram } from '@/hooks/useTelegram';
import { SetupScreen } from '@/components/game/SetupScreen';
import { PlayingScreen } from '@/components/game/PlayingScreen';
import { WinOverlay } from '@/components/game/WinOverlay';
import { LossOverlay } from '@/components/game/LossOverlay';
import { DrawOverlay } from '@/components/game/DrawOverlay';

// Placeholder for backend URL - will be configured later
const BACKEND_URL = '';

const generatePromoCode = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const Index = () => {
  const game = useGameLogic();
  const telegram = useTelegram();
  const [promoCode, setPromoCode] = useState<string>('');

  // Send result to backend and log for debugging
  const sendGameResult = useCallback(async (
    status: 'win' | 'loss' | 'draw',
    code: string | null
  ) => {
    const payload = {
      user_id: telegram.getUserId(),
      username: telegram.getUsername(),
      status,
      promo_code: code,
      difficulty: game.difficulty,
    };

    // Debug logging
    console.log('[DEBUG] Game Result Payload:', JSON.stringify(payload, null, 2));

    // Show toast with payload for verification
    toast.info('Game Result Logged', {
      description: (
        <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto max-h-40">
          {JSON.stringify(payload, null, 2)}
        </pre>
      ),
      duration: 5000,
    });

    // Send to backend if URL is configured
    if (BACKEND_URL) {
      try {
        const response = await fetch(`${BACKEND_URL}/game-result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error('[DEBUG] Backend request failed:', response.status);
        } else {
          console.log('[DEBUG] Backend request successful');
        }
      } catch (error) {
        console.error('[DEBUG] Backend request error:', error);
      }
    } else {
      console.log('[DEBUG] Backend URL not configured - skipping POST request');
    }
  }, [telegram, game.difficulty]);

  // Handle game over states
  useEffect(() => {
    if (game.status === 'win') {
      const code = generatePromoCode();
      setPromoCode(code);
      telegram.hapticFeedback('success');
      sendGameResult('win', code);
    } else if (game.status === 'loss') {
      telegram.hapticFeedback('error');
      sendGameResult('loss', null);
    } else if (game.status === 'draw') {
      telegram.hapticFeedback('warning');
      sendGameResult('draw', null);
    }
  }, [game.status, telegram, sendGameResult]);

  // Handle cell click with haptic feedback
  const handleCellClick = useCallback((index: number) => {
    if (game.board[index] === null && game.currentTurn === game.playerSymbol) {
      telegram.hapticFeedback('light');
      game.makeMove(index);
    }
  }, [game, telegram]);

  // Handle copy promo code
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(promoCode);
    telegram.hapticFeedback('medium');
    toast.success('Code copied to clipboard!');
  }, [promoCode, telegram]);

  // Handle symbol selection with haptic
  const handleSymbolSelect = useCallback((symbol: 'diamond' | 'ring') => {
    telegram.hapticFeedback('selection');
    game.setPlayerSymbol(symbol);
  }, [telegram, game]);

  // Handle difficulty selection with haptic
  const handleDifficultySelect = useCallback((difficulty: 'relaxed' | 'strategic' | 'master') => {
    telegram.hapticFeedback('selection');
    game.setDifficulty(difficulty);
  }, [telegram, game]);

  // Handle start game with haptic
  const handleStartGame = useCallback(() => {
    telegram.hapticFeedback('medium');
    game.startGame();
  }, [telegram, game]);

  // Handle play again with haptic
  const handlePlayAgain = useCallback(() => {
    telegram.hapticFeedback('light');
    game.resetGame();
  }, [telegram, game]);

  // Handle go to setup with haptic
  const handleGoToSetup = useCallback(() => {
    telegram.hapticFeedback('light');
    game.goToSetup();
  }, [telegram, game]);

  const isGameOver = game.status === 'win' || game.status === 'loss' || game.status === 'draw';

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {game.status === 'setup' ? (
        <SetupScreen
          playerSymbol={game.playerSymbol}
          difficulty={game.difficulty}
          stats={game.stats}
          onSymbolSelect={handleSymbolSelect}
          onDifficultySelect={handleDifficultySelect}
          onStartGame={handleStartGame}
        />
      ) : (
        <PlayingScreen
          board={game.board}
          currentTurn={game.currentTurn}
          playerSymbol={game.playerSymbol}
          winningLine={game.winningLine}
          stats={game.stats}
          isGameOver={isGameOver}
          onCellClick={handleCellClick}
          onSettings={handleGoToSetup}
        />
      )}

      {/* Game over overlays */}
      {game.status === 'win' && (
        <WinOverlay
          promoCode={promoCode}
          onPlayAgain={handlePlayAgain}
          onCopyCode={handleCopyCode}
        />
      )}

      {game.status === 'loss' && (
        <LossOverlay
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoToSetup}
        />
      )}

      {game.status === 'draw' && (
        <DrawOverlay
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoToSetup}
        />
      )}
    </div>
  );
};

export default Index;
