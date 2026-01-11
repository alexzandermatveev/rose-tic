import { RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LossOverlayProps {
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const LossOverlay = ({ onPlayAgain, onGoHome }: LossOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 max-w-sm w-full animate-fade-up text-center space-y-5">
        {/* Gentle illustration */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl">🌸</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Almost There!
          </h2>
          <p className="text-sm text-muted-foreground">
            Don't give up — every great player learns from each game
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onPlayAgain}
            className="w-full gold-gradient text-white hover:opacity-90 gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </Button>
          <Button
            onClick={onGoHome}
            variant="outline"
            className="w-full gap-2"
          >
            <Home size={18} />
            Change Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
