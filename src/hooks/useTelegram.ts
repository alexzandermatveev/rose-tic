import { useEffect, useState, useCallback } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      
      // Tell Telegram that the Mini App is ready
      tg.ready();
      
      // Expand to full height
      tg.expand();
      
      setIsReady(true);
      
      console.log('[DEBUG] Telegram WebApp initialized:', {
        user: tg.initDataUnsafe?.user,
        themeParams: tg.themeParams
      });
    } else {
      // Running outside Telegram - use mock data for testing
      console.log('[DEBUG] Running outside Telegram - using mock data');
      setUser({
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      });
      setIsReady(true);
    }
  }, []);

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection') => {
    if (!webApp?.HapticFeedback) {
      console.log('[DEBUG] Haptic feedback (mock):', type);
      return;
    }

    try {
      if (type === 'selection') {
        webApp.HapticFeedback.selectionChanged();
      } else if (['success', 'error', 'warning'].includes(type)) {
        webApp.HapticFeedback.notificationOccurred(type as 'success' | 'error' | 'warning');
      } else {
        webApp.HapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
      }
    } catch (e) {
      console.log('[DEBUG] Haptic feedback error:', e);
    }
  }, [webApp]);

  const getUserId = useCallback((): number => {
    return user?.id || 0;
  }, [user]);

  const getUsername = useCallback((): string => {
    return user?.username || user?.first_name || 'anonymous';
  }, [user]);

  return {
    webApp,
    user,
    isReady,
    hapticFeedback,
    getUserId,
    getUsername
  };
};
