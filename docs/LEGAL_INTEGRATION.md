# Legal Pages Integration

This document outlines the integration of Terms and Conditions and Privacy Policy into the ElfSaga app.

## Overview

The app now includes proper legal page integration with both in-app viewing and external link options for Terms and Conditions and Privacy Policy.

## Implementation

### 1. Legal Page URLs

**Terms and Conditions**: https://talesfromthenorthpole.com/terms-and-conditions
**Privacy Policy**: https://talesfromthenorthpole.com/privacy-policy

### 2. In-App Legal Viewer

**File**: `app/(protected)/legal.tsx`

Features:

- WebView-based in-app viewing
- Loading states and error handling
- Retry functionality for network issues
- Native header with back navigation
- Support for both Terms and Privacy pages
- Responsive design

**Usage**:

```typescript
// Navigate to Terms and Conditions
router.push("/legal?type=terms");

// Navigate to Privacy Policy
router.push("/legal?type=privacy");
```

### 3. Integration Points

#### Login Screen

**File**: `app/login.tsx`

- Terms and Privacy links at bottom of login form
- Clickable links that open in-app legal viewer
- Required for user agreement before signing in

#### Signup Screen

**File**: `app/signup.tsx`

- Terms and Privacy links at bottom of signup form
- Clickable links that open in-app legal viewer
- Required for user agreement before account creation

#### Subscription Screen

**File**: `app/(protected)/subscribe.tsx`

- Terms and Privacy links in footer
- Uses in-app legal viewer
- Accessible during subscription flow

#### Video Feed Subscription Gate

**File**: `app/(protected)/index.tsx`

- Legal links below subscription gate
- Small, unobtrusive design
- Uses in-app legal viewer

### 4. Utility Functions

**File**: `utils/linkUtils.ts`

Provides helper functions for:

- Safe URL opening with error handling
- Predefined legal URLs
- Convenience functions for opening specific pages

**Functions**:

```typescript
openURL(url: string)     // Safe URL opening
openTerms()              // Open Terms and Conditions
openPrivacy()            // Open Privacy Policy
openWebsite()            // Open main website
```

## User Experience

### In-App Viewing (Recommended)

- Keeps users within the app
- Consistent UI/UX
- Loading states and error handling
- Easy navigation back to app

### External Browser (Fallback)

- Uses device's default browser
- Full website experience
- May cause user to leave app

## Design Considerations

### Subscription Screen

- Legal links placed in footer area
- Standard link styling with underlines
- Responsive text sizing
- Proper touch targets

### Video Feed Gate

- Minimal, unobtrusive design
- Small text size to not interfere with main CTA
- Centered layout
- Subtle colors

### Legal Viewer

- Clean, professional header
- Loading indicators
- Error states with retry options
- Proper back navigation
- WebView optimizations

## Accessibility

- Proper hit slop for touch targets
- Accessible labels and roles
- High contrast text
- Readable font sizes
- Screen reader compatibility

## Error Handling

### Network Issues

- Loading states during page load
- Error messages for failed loads
- Retry functionality
- Graceful fallbacks

### URL Issues

- Validation before opening
- Error alerts for unsupported URLs
- Fallback to external browser if needed

## Testing

### Manual Testing

1. **Login Screen Links**:

   - Navigate to login screen
   - Tap Terms link → Should open in-app legal viewer
   - Tap Privacy Policy link → Should open in-app legal viewer
   - Verify back navigation returns to login

2. **Signup Screen Links**:

   - Navigate to signup screen
   - Tap Terms link → Should open in-app legal viewer
   - Tap Privacy Policy link → Should open in-app legal viewer
   - Verify back navigation returns to signup

3. **Subscription Screen Links**:

   - Tap Terms link → Should open in-app legal viewer
   - Tap Privacy link → Should open in-app legal viewer
   - Verify back navigation works

4. **Video Feed Gate Links**:

   - Scroll to subscription gate
   - Tap Terms and Privacy links
   - Verify proper navigation

5. **Legal Viewer**:
   - Test loading states
   - Test error states (airplane mode)
   - Test retry functionality
   - Test back navigation

### Edge Cases

- No internet connection
- Slow network
- WebView errors
- Invalid URLs

## Compliance

### App Store Requirements

- Terms and Conditions accessible within app
- Privacy Policy accessible within app
- Links clearly labeled
- Easy to find and access

### Legal Requirements

- Terms and Conditions cover app usage
- Privacy Policy covers data collection
- Both documents easily accessible
- Clear presentation to users

## Maintenance

### URL Updates

- Update URLs in `utils/linkUtils.ts`
- Test all integration points
- Verify external links still work

### Content Updates

- Legal pages are hosted externally
- No app updates needed for content changes
- WebView will show latest content automatically

## Future Enhancements

### Potential Improvements

1. **Offline Support**: Cache legal pages for offline viewing
2. **Native Rendering**: Parse HTML and render natively
3. **Search Functionality**: Add search within legal documents
4. **Bookmarking**: Allow users to bookmark specific sections
5. **Print/Share**: Add options to print or share legal documents

### Analytics

- Track legal page views
- Monitor user engagement
- Identify common drop-off points
- Optimize based on usage patterns

## File Structure

```
app/
├── login.tsx              # Updated with legal links
├── signup.tsx             # Updated with legal links
└── (protected)/
    ├── legal.tsx          # In-app legal viewer
    ├── subscribe.tsx      # Updated with legal links
    └── index.tsx          # Updated with legal links

utils/
└── linkUtils.ts           # URL utilities

docs/
└── LEGAL_INTEGRATION.md   # This document
```

## Dependencies

- `react-native-webview`: For in-app web viewing
- `expo-router`: For navigation
- `@expo/vector-icons`: For UI icons
- `expo-linear-gradient`: For header styling

All dependencies are already included in the project.
