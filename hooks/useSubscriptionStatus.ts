import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useSubscriptionStore } from '../stores/subscriptionStore';

/**
 * Hook to automatically check subscription status at appropriate intervals
 * and when the app becomes active
 */
export const useSubscriptionStatus = () => {
  const { checkSubscriptionStatus, isSubscribed, lastChecked } = useSubscriptionStore();
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check subscription status when hook is first used
    checkSubscriptionStatus();

    // Set up periodic checks every 30 minutes
    intervalRef.current = setInterval(() => {
      console.log('Periodic subscription status check');
      checkSubscriptionStatus();
    }, 30 * 60 * 1000); // 30 minutes

    // Listen for app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App became active, checking subscription status');
        
        // Check if we should refresh (if last check was more than 5 minutes ago)
        const now = Date.now();
        const shouldRefresh = !lastChecked || (now - lastChecked) > 5 * 60 * 1000;
        
        if (shouldRefresh) {
          checkSubscriptionStatus();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription.remove();
    };
  }, [checkSubscriptionStatus, lastChecked]);

  return {
    isSubscribed,
    checkSubscriptionStatus,
  };
};

/**
 * Hook for components that need to react to subscription changes
 * with immediate status checking
 */
export const useSubscriptionGuard = () => {
  const { 
    isSubscribed, 
    isPremium, 
    checkSubscriptionStatus, 
    isLoading,
    error 
  } = useSubscriptionStore();

  // Check status immediately when this hook is used
  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  return {
    isSubscribed,
    isPremium,
    isLoading,
    error,
    refreshStatus: checkSubscriptionStatus,
  };
};

/**
 * Hook to validate subscription before accessing premium content
 */
export const usePremiumAccess = () => {
  const { isSubscribed, isPremium, checkSubscriptionStatus } = useSubscriptionStore();

  const validateAccess = async (): Promise<boolean> => {
    // Always check current status before granting access
    await checkSubscriptionStatus();
    
    // Get fresh state after check
    const currentState = useSubscriptionStore.getState();
    return currentState.isSubscribed && currentState.isPremium;
  };

  return {
    hasAccess: isSubscribed && isPremium,
    validateAccess,
  };
};

export default useSubscriptionStatus;
