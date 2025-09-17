# ElfSaga Subscription Testing Guide

This guide provides step-by-step instructions for testing the RevenueCat subscription integration.

## Prerequisites

1. **Development Environment Setup**:
   - Expo development build installed on physical device
   - RevenueCat dashboard configured (see REVENUECAT_SETUP.md)
   - Test user accounts created in App Store Connect/Google Play Console

2. **Test Accounts**:
   - iOS: Sandbox test user in App Store Connect
   - Android: Test account added to Google Play Console

## Testing Scenarios

### 1. Initial App Launch

**Expected Behavior**:
- App initializes RevenueCat successfully
- Subscription status is checked automatically
- User sees first 6 videos only (free tier)
- Subscription gate appears after 6th video

**Test Steps**:
1. Launch app on fresh install
2. Navigate through video feed
3. Verify only 6 videos are accessible
4. Confirm subscription gate appears correctly

### 2. Subscription Purchase Flow

**Test Steps**:
1. Tap "Continue" button on subscription gate
2. Navigate to subscription screen
3. Verify annual price is displayed correctly
4. Tap "Continue · 1-Year Subscription" button
5. Complete purchase flow in App Store/Google Play

**Expected Behavior**:
- Loading state shows during purchase
- Success alert appears on completion
- User is redirected back to video feed
- All videos become accessible immediately
- Subscription gate no longer appears

### 3. Subscription Restore Flow

**Test Steps**:
1. Delete and reinstall app (or use different device)
2. Sign in with same Apple ID/Google account that made purchase
3. Navigate to subscription screen
4. Tap "Restore Purchase"

**Expected Behavior**:
- Loading state shows during restore
- Success alert appears if purchases found
- All videos become accessible
- Subscription status updates correctly

### 4. Error Handling

#### Network Errors
**Test Steps**:
1. Disable internet connection
2. Attempt to purchase subscription
3. Re-enable internet and retry

**Expected Behavior**:
- Appropriate error message displayed
- User can retry after network restoration

#### Purchase Cancellation
**Test Steps**:
1. Start purchase flow
2. Cancel in App Store/Google Play dialog

**Expected Behavior**:
- No error alert shown for user cancellation
- User remains on subscription screen
- Can retry purchase

#### No Purchases to Restore
**Test Steps**:
1. Use account with no previous purchases
2. Tap "Restore Purchase"

**Expected Behavior**:
- "No Purchases Found" alert displayed
- User remains on subscription screen

### 5. Subscription Status Validation

#### App State Changes
**Test Steps**:
1. Purchase subscription
2. Background the app for 10+ minutes
3. Return to app

**Expected Behavior**:
- Subscription status is re-validated
- Premium access maintained

#### Subscription Expiration (Sandbox Only)
**Test Steps**:
1. Purchase subscription in sandbox (expires quickly)
2. Wait for expiration
3. Check video access

**Expected Behavior**:
- Access reverts to free tier after expiration
- Subscription gate reappears

### 6. Development Testing Features

#### Dev Unlock (Development Only)
**Test Steps**:
1. In development build, scroll to subscription gate
2. Tap "(Dev) Temporarily Unlock" button

**Expected Behavior**:
- All videos become accessible
- No actual purchase made
- Useful for testing premium features

## Automated Testing Checklist

### Video Feed Tests
- [ ] Shows exactly 6 videos for free users
- [ ] Shows subscription gate after 6th video
- [ ] Shows all videos for premium users
- [ ] No subscription gate for premium users
- [ ] Subscription status updates in real-time

### Purchase Flow Tests
- [ ] Purchase button shows loading state
- [ ] Success alert appears on completion
- [ ] Error handling for failed purchases
- [ ] User cancellation handled gracefully
- [ ] Navigation works correctly

### Restore Flow Tests
- [ ] Restore button shows loading state
- [ ] Success alert for found purchases
- [ ] Appropriate message for no purchases
- [ ] Error handling for network issues

### Subscription Status Tests
- [ ] Status checked on app launch
- [ ] Status re-checked when app becomes active
- [ ] Periodic status checks work
- [ ] Premium access validated before content access

## Performance Testing

### Memory Usage
- Monitor memory usage during purchase flows
- Check for memory leaks in subscription store
- Verify proper cleanup of RevenueCat listeners

### Network Efficiency
- Verify subscription status isn't checked too frequently
- Confirm caching works correctly (5-minute cache)
- Test offline behavior

## Production Testing

### Before Release
1. **Sandbox Testing**: Complete all scenarios in sandbox environment
2. **TestFlight/Internal Testing**: Test with real App Store Connect setup
3. **Edge Cases**: Test various network conditions and device states
4. **User Experience**: Verify smooth flow from free to premium

### Post-Release Monitoring
1. **Analytics**: Monitor purchase conversion rates
2. **Error Tracking**: Watch for subscription-related errors
3. **User Feedback**: Monitor reviews for subscription issues
4. **Revenue Tracking**: Verify RevenueCat dashboard matches store reports

## Troubleshooting Common Issues

### "Product not available"
- Check product IDs match exactly
- Verify products are approved in App Store Connect
- Ensure test user is signed in correctly

### "Purchase failed"
- Check network connection
- Verify test user has valid payment method
- Ensure RevenueCat configuration is correct

### "Restore failed"
- Confirm user is signed in with correct account
- Check if user actually has previous purchases
- Verify RevenueCat user ID mapping

### Premium content not unlocked
- Check entitlement configuration in RevenueCat
- Verify subscription status in RevenueCat dashboard
- Confirm app is checking correct entitlement ID

## Test Data Cleanup

After testing:
1. Clear app data/reinstall for fresh state
2. Sign out of test accounts
3. Reset subscription store state if needed
4. Clear RevenueCat customer data in dashboard (if needed)

## Reporting Issues

When reporting subscription-related issues, include:
1. Device type and OS version
2. App version and build number
3. RevenueCat customer ID (if available)
4. Exact error messages
5. Steps to reproduce
6. Screenshots/screen recordings
