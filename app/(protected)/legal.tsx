import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type LegalPageType = 'terms' | 'privacy';

const LEGAL_URLS = {
  terms: 'https://talesfromthenorthpole.com/terms-and-conditions',
  privacy: 'https://talesfromthenorthpole.com/privacy-policy',
};

const LEGAL_TITLES = {
  terms: 'Terms & Conditions',
  privacy: 'Privacy Policy',
};

export default function LegalScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: LegalPageType }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pageType = (type as LegalPageType) || 'terms';
  const url = LEGAL_URLS[pageType];
  const title = LEGAL_TITLES[pageType];

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#066863', '#0aa69f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            
            <Text style={styles.headerTitle}>{title}</Text>
            
            {/* Spacer to center title */}
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#666" />
            <Text style={styles.errorTitle}>Unable to load page</Text>
            <Text style={styles.errorMessage}>
              Please check your internet connection and try again.
            </Text>
            <Pressable onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <WebView
              source={{ uri: url }}
              style={styles.webview}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              startInLoadingState={true}
              scalesPageToFit={true}
              showsVerticalScrollIndicator={true}
              allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
            />
            
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#066863" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40, // Same width as back button to center title
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#066863',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
