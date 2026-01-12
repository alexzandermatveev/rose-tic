import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

interface UserStats {
  wins: number;
  losses: number;
  draws: number;
}

interface UserStatsResponse {
  user_id: number;
  stats: UserStats;
}

export const useUserStats = () => {
  const { user } = useTelegram();
  const [stats, setStats] = useState<UserStats>({ wins: 0, losses: 0, draws: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserStats = useCallback(async () => {
    if (!user?.id) {
      console.log('[DEBUG] No user ID available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[DEBUG] Fetching stats for user:', user.id);
      
      // Get backend URL from environment
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/user/${user.id}/stats/simple`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: UserStatsResponse = await response.json();
      console.log('[DEBUG] Received user stats:', data);
      
      setStats(data.stats);
    } catch (err) {
      console.error('[ERROR] Failed to fetch user stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
      // Return default stats on error
      setStats({ wins: 0, losses: 0, draws: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch stats when user ID becomes available
  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user?.id, fetchUserStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchUserStats,
    userId: user?.id || null
  };
};