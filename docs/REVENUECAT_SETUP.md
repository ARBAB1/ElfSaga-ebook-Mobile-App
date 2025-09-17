# RevenueCat Setup Guide for ElfSaga

This document outlines the steps needed to complete the RevenueCat integration for the ElfSaga app.

## 1. RevenueCat Dashboard Configuration

### Create Products in RevenueCat Dashboard

1. **Log in to RevenueCat Dashboard**: https://app.revenuecat.com
2. **Create a new project** or use existing project with label: `elfSaga`

### Configure Products

#### Annual Subscription Product

- **Product ID**: `com.arbab001.ElfSaga.annual`
- **Type**: Auto-renewable subscription
- **Duration**: 1 year
- **Price**: $19.99 USD (or your preferred price)

### Configure Entitlements

1. **Create Entitlement**:
   - **Identifier**: `premium`
   - **Description**: Premium access to all videos
   - **Attach Products**: Link the annual subscription product

### Configure Offerings

1. **Create Offering**:
   - **Identifier**: `default`
   - **Description**: Default offering for annual subscription
   - **Add Package**:
     - **Identifier**: `$rc_annual`
     - **Product**: `com.arbab001.ElfSaga.annual`

## 2. App Store Connect / Google Play Console Setup

### iOS (App Store Connect)

1. **Create In-App Purchase**:

   - **Type**: Auto-Renewable Subscription
   - **Product ID**: `com.arbab001.ElfSaga.annual`
   - **Reference Name**: ElfSaga Annual Subscription
   - **Subscription Group**: Create new group "ElfSaga Subscriptions"
   - **Subscription Duration**: 1 Year
   - **Price**: $19.99 USD

2. **Subscription Details**:
   - **Display Name**: Annual Subscription
   - **Description**: Get unlimited access to all ElfSaga videos for a full year
   - **Review Information**: Provide screenshots and description

### Android (Google Play Console)

1. **Create Subscription**:
   - **Product ID**: `com.arbab001.ElfSaga.annual`
   - **Name**: Annual Subscription
   - **Description**: Get unlimited access to all ElfSaga videos for a full year
   - **Billing Period**: 1 year
   - **Price**: $19.99 USD
   - **Free Trial**: Optional (e.g., 7 days)

## 3. RevenueCat Integration Configuration

### API Keys (Already configured in code)

- **Public API Key**: `appl_MvYiaJhpHxbUSbDFrFttQeeyuEx`
- **Secret Key**: `sk_PtnDtUPYdOTBSKhMwIQMtKDkhoUjl` (Note: Should be server-side only)

### Bundle IDs

- **iOS**: `com.arbab001.ElfSaga`
- **Android**: `com.arbab001.ElfSaga`

## 4. Testing

### Test Users

1. **iOS**: Create sandbox test users in App Store Connect
2. **Android**: Add test accounts in Google Play Console

### Test Scenarios

1. **Purchase Flow**: Test annual subscription purchase
2. **Restore Flow**: Test purchase restoration
3. **Subscription Status**: Verify premium content access
4. **Expiration**: Test subscription expiration handling

## 5. Implementation Status

✅ **Completed**:

- RevenueCat SDK integration
- Subscription store with Zustand
- Purchase and restore flows
- Video feed premium gating
- Subscription screen UI
- Error handling and loading states
- Automatic subscription status checking

⚠️ **Requires Setup**:

- RevenueCat dashboard configuration
- App Store Connect in-app purchases
- Google Play Console subscriptions
- Test user accounts
- Production testing

## 6. Important Notes

### Security

- The secret key (`sk_PtnDtUPYdOTBSKhMwIQMtKDkhoUjl`) should only be used server-side
- Client-side code should only use the public API key
- Consider implementing server-side receipt validation for additional security

### Product IDs

- Ensure product IDs match exactly between:
  - RevenueCat dashboard
  - App Store Connect / Google Play Console
  - App code configuration

### Testing

- Always test on physical devices for in-app purchases
- Use sandbox/test environments before production
- Test all edge cases (network failures, cancellations, etc.)

## 7. Deployment Checklist

Before releasing to production:

- [ ] RevenueCat dashboard configured with correct products and entitlements
- [ ] App Store Connect in-app purchases approved
- [ ] Google Play Console subscriptions published
- [ ] Test purchases working in sandbox environment
- [ ] Subscription restoration working correctly
- [ ] Premium content properly gated
- [ ] Error handling tested
- [ ] Analytics and tracking configured (optional)

## 8. Support and Troubleshooting

### Common Issues

1. **Product not found**: Check product IDs match exactly
2. **Purchase fails**: Verify sandbox test users are set up correctly
3. **Restore fails**: Ensure user is signed in with correct Apple ID/Google account
4. **Subscription not recognized**: Check entitlement configuration

### Debugging

- Enable RevenueCat debug logging in development
- Check RevenueCat dashboard for purchase events
- Monitor device logs for error messages
- Use RevenueCat's customer lookup tool

### Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [iOS In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing Guide](https://developer.android.com/google/play/billing)
- [Terms and Conditions](https://talesfromthenorthpole.com/terms-and-conditions)
- [Privacy Policy](https://talesfromthenorthpole.com/privacy-policy)
