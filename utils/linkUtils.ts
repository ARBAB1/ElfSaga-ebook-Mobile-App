import { Linking, Alert } from 'react-native';

/**
 * Safely opens a URL in the default browser with error handling
 */
export const openURL = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Unable to open link',
        'This link cannot be opened on your device.',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Failed to open URL:', error);
    Alert.alert(
      'Error',
      'Failed to open the link. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

/**
 * Legal page URLs for the app
 */
export const LEGAL_URLS = {
  terms: 'https://talesfromthenorthpole.com/terms-and-conditions',
  privacy: 'https://talesfromthenorthpole.com/privacy-policy',
  website: 'https://talesfromthenorthpole.com',
} as const;

/**
 * Opens Terms and Conditions page
 */
export const openTerms = () => openURL(LEGAL_URLS.terms);

/**
 * Opens Privacy Policy page
 */
export const openPrivacy = () => openURL(LEGAL_URLS.privacy);

/**
 * Opens main website
 */
export const openWebsite = () => openURL(LEGAL_URLS.website);
