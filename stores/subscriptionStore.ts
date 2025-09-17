import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import revenueCatService, { CustomerInfo } from '@/services/revenueCat';

export interface SubscriptionState {
  // Subscription status
  isSubscribed: boolean;
  isPremium: boolean;
  isLoading: boolean;
  
  // Customer info
  customerInfo: CustomerInfo | null;
  
  // Product info
  annualPrice: string;
  
  // Error handling
  error: string | null;
  
  // Last check timestamp
  lastChecked: number | null;
  
  // Actions
  checkSubscriptionStatus: () => Promise<void>;
  purchaseAnnualSubscription: () => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; error?: string }>;
  refreshProductInfo: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  
  // Dev/testing actions
  setSubscribedForTesting: (subscribed: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      isSubscribed: false,
      isPremium: false,
      isLoading: false,
      customerInfo: null,
      annualPrice: '$19.99', // Default fallback price
      error: null,
      lastChecked: null,

      // Check current subscription status
      checkSubscriptionStatus: async () => {
        const state = get();
        
        // Avoid too frequent checks (cache for 5 minutes)
        const now = Date.now();
        if (state.lastChecked && (now - state.lastChecked) < 5 * 60 * 1000) {
          console.log('Using cached subscription status');
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const customerInfo = await revenueCatService.getCustomerInfo();
          const isPremium = await revenueCatService.isPremiumActive();

          set({
            customerInfo,
            isSubscribed: isPremium,
            isPremium,
            isLoading: false,
            lastChecked: now,
            error: null,
          });

          console.log('Subscription status updated:', { isPremium });
        } catch (error: any) {
          console.error('Failed to check subscription status:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to check subscription status',
          });
        }
      },

      // Purchase annual subscription
      purchaseAnnualSubscription: async () => {
        set({ isLoading: true, error: null });

        try {
          const result = await revenueCatService.purchaseAnnualSubscription();

          if (result.success && result.customerInfo) {
            const isPremium = await revenueCatService.isPremiumActive();
            
            set({
              customerInfo: result.customerInfo,
              isSubscribed: isPremium,
              isPremium,
              isLoading: false,
              lastChecked: Date.now(),
              error: null,
            });

            console.log('Purchase successful, subscription activated');
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: result.error || 'Purchase failed',
            });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          console.error('Purchase error:', error);
          const errorMessage = error.message || 'Purchase failed';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          return { success: false, error: errorMessage };
        }
      },

      // Restore previous purchases
      restorePurchases: async () => {
        set({ isLoading: true, error: null });

        try {
          const result = await revenueCatService.restorePurchases();

          if (result.success && result.customerInfo) {
            const isPremium = await revenueCatService.isPremiumActive();
            
            set({
              customerInfo: result.customerInfo,
              isSubscribed: isPremium,
              isPremium,
              isLoading: false,
              lastChecked: Date.now(),
              error: null,
            });

            console.log('Restore successful:', { isPremium });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: result.error || 'No purchases to restore',
            });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          console.error('Restore error:', error);
          const errorMessage = error.message || 'Restore failed';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          return { success: false, error: errorMessage };
        }
      },

      // Refresh product information (pricing, etc.)
      refreshProductInfo: async () => {
        try {
          await revenueCatService.loadOfferings();
          const annualPrice = revenueCatService.getAnnualPrice();
          
          set({ annualPrice });
          console.log('Product info refreshed:', { annualPrice });
        } catch (error) {
          console.error('Failed to refresh product info:', error);
        }
      },

      // Clear error state
      clearError: () => {
        set({ error: null });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Dev/testing helper
      setSubscribedForTesting: (subscribed: boolean) => {
        if (__DEV__) {
          set({ 
            isSubscribed: subscribed, 
            isPremium: subscribed,
            lastChecked: Date.now(),
          });
          console.log('Dev: Subscription status set to:', subscribed);
        }
      },
    }),
    {
      name: 'subscription-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain fields
      partialize: (state) => ({
        isSubscribed: state.isSubscribed,
        isPremium: state.isPremium,
        customerInfo: state.customerInfo,
        annualPrice: state.annualPrice,
        lastChecked: state.lastChecked,
      }),
    }
  )
);

// Helper hook for subscription status
export const useIsSubscribed = () => {
  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed);
  const checkSubscriptionStatus = useSubscriptionStore((state) => state.checkSubscriptionStatus);
  
  // Auto-check subscription status when hook is used
  React.useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);
  
  return isSubscribed;
};

// Helper hook for premium status (alias for subscription)
export const useIsPremium = () => {
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const checkSubscriptionStatus = useSubscriptionStore((state) => state.checkSubscriptionStatus);
  
  React.useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);
  
  return isPremium;
};

// Export store instance for direct access if needed
export default useSubscriptionStore;
