import Purchases, { 
  CustomerInfo, 
  PurchasesOffering, 
  PurchasesPackage,
  LOG_LEVEL 
} from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat Configuration
const REVENUECAT_CONFIG = {
  apiKey: 'appl_MvYiaJhpHxbUSbDFrFttQeeyuEx',
  secretKey: 'sk_PtnDtUPYdOTBSKhMwIQMtKDkhoUjl', // Note: Secret key should not be used in client-side code
  label: 'elfSaga',
  apiVersion: 2,
  // Product identifiers - these should match your App Store Connect/Google Play Console setup
  annualProductId: Platform.select({
    ios: 'com.arbab001.ElfSaga.annual',
    android: 'com.arbab001.ElfSaga.annual',
    default: 'com.arbab001.ElfSaga.annual'
  }),
  entitlementId: 'premium' // This should match your RevenueCat dashboard entitlement
};

class RevenueCatService {
  private isInitialized = false;
  private currentOffering: PurchasesOffering | null = null;

  /**
   * Initialize RevenueCat SDK
   * Call this early in your app lifecycle (App.tsx or _layout.tsx)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('RevenueCat already initialized');
      return;
    }

    try {
      // Only initialize on real devices, not in development/simulator
      if (__DEV__ && Platform.OS !== 'ios' && Platform.OS !== 'android') {
        console.log('Skipping RevenueCat initialization in development environment');
        this.isInitialized = true;
        return;
      }

      // Configure RevenueCat
      Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);

      // Initialize with API key
      await Purchases.configure({
        apiKey: REVENUECAT_CONFIG.apiKey,
      });

      // Set user attributes if needed
      await Purchases.setAttributes({
        'app_label': REVENUECAT_CONFIG.label,
      });

      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');

      // Load offerings
      await this.loadOfferings();
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Load available offerings from RevenueCat
   */
  async loadOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      this.currentOffering = offerings.current;
      
      if (!this.currentOffering) {
        console.warn('No current offering available');
        return null;
      }

      console.log('Loaded offerings:', this.currentOffering.identifier);
      return this.currentOffering;
    } catch (error) {
      console.error('Failed to load offerings:', error);
      return null;
    }
  }

  /**
   * Get the annual subscription package
   */
  getAnnualPackage(): PurchasesPackage | null {
    if (!this.currentOffering) {
      console.warn('No current offering available');
      return null;
    }

    // Try to find annual package by identifier
    const annualPackage = this.currentOffering.availablePackages.find(
      pkg => pkg.identifier === '$rc_annual' || 
             pkg.product.identifier === REVENUECAT_CONFIG.annualProductId
    );

    if (!annualPackage) {
      console.warn('Annual package not found in current offering');
      // Fallback to first available package
      return this.currentOffering.availablePackages[0] || null;
    }

    return annualPackage;
  }

  /**
   * Purchase the annual subscription
   */
  async purchaseAnnualSubscription(): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
    try {
      if (!this.isInitialized) {
        console.log('RevenueCat not initialized, skipping purchase');
        return { success: false, error: 'RevenueCat not initialized' };
      }

      const annualPackage = this.getAnnualPackage();

      if (!annualPackage) {
        return { success: false, error: 'Annual subscription package not available' };
      }

      console.log('Attempting to purchase:', annualPackage.product.identifier);
      
      const { customerInfo } = await Purchases.purchasePackage(annualPackage);
      
      console.log('Purchase successful:', customerInfo.entitlements.active);
      
      return { success: true, customerInfo };
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      // Handle specific error cases
      if (error.userCancelled) {
        return { success: false, error: 'Purchase cancelled by user' };
      }
      
      return { success: false, error: error.message || 'Purchase failed' };
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
    try {
      if (!this.isInitialized) {
        console.log('RevenueCat not initialized, skipping restore');
        return { success: false, error: 'RevenueCat not initialized' };
      }

      console.log('Attempting to restore purchases...');

      const customerInfo = await Purchases.restorePurchases();
      
      console.log('Restore successful:', customerInfo.entitlements.active);
      
      return { success: true, customerInfo };
    } catch (error: any) {
      console.error('Restore failed:', error);
      return { success: false, error: error.message || 'Restore failed' };
    }
  }

  /**
   * Get current customer info and subscription status
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  /**
   * Check if user has active premium subscription
   */
  async isPremiumActive(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        console.log('RevenueCat not initialized, returning false for premium status');
        return false;
      }

      const customerInfo = await this.getCustomerInfo();

      if (!customerInfo) {
        return false;
      }

      // Check if the premium entitlement is active
      const premiumEntitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId];
      
      return !!premiumEntitlement;
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return false;
    }
  }

  /**
   * Get formatted price for annual subscription
   */
  getAnnualPrice(): string {
    const annualPackage = this.getAnnualPackage();
    
    if (!annualPackage) {
      return '$19.99'; // Fallback price
    }

    return annualPackage.product.priceString;
  }

  /**
   * Set user ID for RevenueCat (optional, for user tracking)
   */
  async setUserId(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      console.log('User ID set:', userId);
    } catch (error) {
      console.error('Failed to set user ID:', error);
    }
  }

  /**
   * Log out user (optional)
   */
  async logOut(): Promise<void> {
    try {
      await Purchases.logOut();
      console.log('User logged out from RevenueCat');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();
export default revenueCatService;

// Export types for use in other files
export type { CustomerInfo, PurchasesOffering, PurchasesPackage };
