import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WinOverlayProps {
  promoCode: string;
  onPlayAgain: () => void;
  onCopyCode: () => void;
}

export const WinOverlay = ({ promoCode, onPlayAgain, onCopyCode }: WinOverlayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyCode();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 max-w-sm w-full animate-celebrate text-center space-y-5">
        {/* Sparkle decoration */}
        <div className="flex justify-center">
          <div className="relative">
            <Sparkles size={48} className="text-accent animate-sparkle" />
            <Sparkles size={24} className="text-accent/60 absolute -top-2 -right-4 animate-sparkle" style={{ animationDelay: '0.3s' }} />
            <Sparkles size={20} className="text-accent/40 absolute -bottom-1 -left-3 animate-sparkle" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Congratulations!
          </h2>
          <p className="text-sm text-muted-foreground">
            You've won! Here's your exclusive promo code
          </p>
        </div>

        {/* Promo code display */}
        <div className="bg-accent/10 border-2 border-accent rounded-xl py-3 px-4">
          <p className="font-mono text-2xl font-bold tracking-widest text-accent">
            {promoCode}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full border-accent text-accent hover:bg-accent/10 gap-2"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          <Button
            onClick={onPlayAgain}
            className="w-full gold-gradient text-white hover:opacity-90"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};
