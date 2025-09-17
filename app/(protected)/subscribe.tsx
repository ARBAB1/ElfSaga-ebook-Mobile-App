// app/subscribe.tsx - Apple App Store Policy Compliant
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    Linking,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    Alert,
} from 'react-native';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

const BG = require('@/assets/images/splash-bg.png');

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Feature Item Component
interface FeatureItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    size: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, size }) => (
    <View style={styles.featureItem}>
        <Ionicons name={icon} size={20} color="#4CAF50" />
        <Text style={[styles.featureText, { fontSize: size }]}>{text}</Text>
    </View>
);

export default function SubscribeScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();

    // Use subscription store
    const {
        isLoading,
        annualPrice,
        error,
        purchaseAnnualSubscription,
        restorePurchases,
        refreshProductInfo,
        clearError,
    } = useSubscriptionStore();

    // Local loading state for UI feedback
    const [localLoading, setLocalLoading] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Responsive scale based on width
    const scale = Math.min(width, 520) / 375;
    const titleSize = clamp(28 * scale, 22, 34);
    const bodySize = clamp(16 * scale, 14, 18);
    const badgeSize = clamp(12 * scale, 11, 13);
    const priceSize = clamp(32 * scale, 24, 40);
    const featureSize = clamp(15 * scale, 13, 17);

    // Apple-required subscription terms
    const subscriptionTerms = {
        duration: '1 year',
        price: annualPrice || '$19.99',
        renewalInfo: 'Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.',
        chargeInfo: 'Account will be charged for renewal within 24-hours prior to the end of the current period.',
        managementInfo: 'Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user\'s Account Settings after purchase.',
        cancellationInfo: 'No cancellation of the current subscription is allowed during active subscription period.',
    };
    const ctaHeight = clamp(50 * scale, 44, 58);
    const ctaRadius = clamp(16 * scale, 12, 20);
    const maxWidth = Math.min(width - 32, 560);

    // Combined loading state
    const isLoadingState = isLoading || localLoading;

    // Load product info on mount
    useEffect(() => {
        refreshProductInfo();
    }, [refreshProductInfo]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            if (error) {
                clearError();
            }
        };
    }, [error, clearError]);

    const openURL = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch { }
    };

    const manageSubscriptions = () => {
        if (Platform.OS === 'ios') {
            openURL('https://apps.apple.com/account/subscriptions');
        } else if (Platform.OS === 'android') {
            openURL('https://play.google.com/store/account/subscriptions');
        }
    };

    const onSubscribe = async () => {
        setLocalLoading(true);
        clearError(); // Clear any previous errors

        try {
            const result = await purchaseAnnualSubscription();

            if (result.success) {
                // Show success message
                Alert.alert(
                    'Success!',
                    'Your subscription is now active. Enjoy unlimited access to all videos!',
                    [
                        {
                            text: 'Continue',
                            onPress: () => router.back(),
                        },
                    ]
                );
            } else {
                // Show error message
                const errorMessage = result.error || 'Purchase failed. Please try again.';
                if (!result.error?.includes('cancelled')) {
                    Alert.alert('Purchase Failed', errorMessage);
                }
            }
        } catch (e: any) {
            console.error('Purchase error:', e);
            Alert.alert('Error', e.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLocalLoading(false);
        }
    };

    const onRestore = async () => {
        setLocalLoading(true);
        clearError(); // Clear any previous errors

        try {
            const result = await restorePurchases();

            if (result.success) {
                Alert.alert(
                    'Restore Successful!',
                    'Your previous purchases have been restored.',
                    [
                        {
                            text: 'Continue',
                            onPress: () => router.back(),
                        },
                    ]
                );
            } else {
                Alert.alert(
                    'No Purchases Found',
                    'We couldn\'t find any previous purchases to restore. If you believe this is an error, please contact support.',
                    [{ text: 'OK' }]
                );
            }
        } catch (e: any) {
            console.error('Restore error:', e);
            Alert.alert('Error', e.message || 'Failed to restore purchases. Please try again.');
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <ImageBackground source={BG} style={StyleSheet.absoluteFill} blurRadius={8} />
            <LinearGradient
                colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.55)']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header with close button */}
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.closeButton}
                        hitSlop={8}
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </Pressable>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        {/* App Icon/Logo */}
                        <View style={styles.iconContainer}>
                            <Ionicons name="book" size={60} color="#FFD700" />
                        </View>

                        {/* Title */}
                        <Text style={[styles.title, { fontSize: titleSize }]}>
                            The Elf Chronicles
                        </Text>
                        <Text style={[styles.subtitle, { fontSize: bodySize }]}>
                            Premium Subscription
                        </Text>

                        {/* Features */}
                        <View style={styles.featuresContainer}>
                            <FeatureItem
                                icon="play-circle"
                                text="Unlimited access to all video stories"
                                size={featureSize}
                            />
                            <FeatureItem
                                icon="calendar"
                                text="New stories added regularly"
                                size={featureSize}
                            />
                            <FeatureItem
                                icon="shield-checkmark"
                                text="Ad-free, family-safe content"
                                size={featureSize}
                            />
                            <FeatureItem
                                icon="devices"
                                text="Works on all your devices"
                                size={featureSize}
                            />
                        </View>

                        {/* Subscription Plan - Apple Compliant */}
                        <View style={styles.subscriptionCard}>
                            <View style={styles.planHeader}>
                                <Text style={styles.planTitle}>Annual Subscription</Text>
                                <View style={styles.priceRow}>
                                    <Text style={[styles.price, { fontSize: priceSize }]}>
                                        {subscriptionTerms.price}
                                    </Text>
                                    <Text style={styles.period}>per year</Text>
                                </View>
                            </View>
                        </View>

                        {/* Subscribe Button - Apple Compliant */}
                        <Pressable
                            onPress={onSubscribe}
                            accessibilityRole="button"
                            accessibilityLabel={`Subscribe for ${subscriptionTerms.price} per year`}
                            disabled={isLoading || localLoading}
                            style={[
                                styles.subscribeButton,
                                (isLoading || localLoading) && styles.subscribeButtonDisabled
                            ]}
                        >
                            {(isLoading || localLoading) ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <Ionicons name="lock-open" size={20} color="white" />
                                    <Text style={styles.subscribeButtonText}>
                                        Subscribe - {subscriptionTerms.price}/year
                                    </Text>
                                </>
                            )}
                        </Pressable>

                        {/* Apple Required: Subscription Terms */}
                        <View style={styles.termsContainer}>
                            <Text style={styles.termsText}>
                                • {subscriptionTerms.renewalInfo}
                            </Text>
                            <Text style={styles.termsText}>
                                • {subscriptionTerms.chargeInfo}
                            </Text>
                            <Text style={styles.termsText}>
                                • {subscriptionTerms.managementInfo}
                            </Text>
                            <Text style={styles.termsText}>
                                • {subscriptionTerms.cancellationInfo}
                            </Text>
                        </View>

                        {/* Restore Button */}
                        <Pressable
                            onPress={onRestore}
                            accessibilityRole="button"
                            accessibilityLabel="Restore previous purchases"
                            style={styles.restoreButton}
                            disabled={isLoading || localLoading}
                        >
                            <Text style={styles.restoreButtonText}>
                                Restore Purchase
                            </Text>
                        </Pressable>

                        {/* Legal Links - Apple Required */}
                        <View style={styles.legalLinks}>
                            <Pressable
                                onPress={() => router.push('/legal?type=terms')}
                                hitSlop={8}
                                style={styles.legalButton}
                            >
                                <Text style={styles.legalText}>Terms of Service</Text>
                            </Pressable>
                            <Text style={styles.legalSeparator}>•</Text>
                            <Pressable
                                onPress={() => router.push('/legal?type=privacy')}
                                hitSlop={8}
                                style={styles.legalButton}
                            >
                                <Text style={styles.legalText}>Privacy Policy</Text>
                            </Pressable>
                        </View>

                        {/* Apple Required: Manage Subscription Link */}
                        <Pressable
                            onPress={() => {
                                const url = Platform.OS === 'ios'
                                    ? 'https://apps.apple.com/account/subscriptions'
                                    : 'https://play.google.com/store/account/subscriptions';
                                Linking.openURL(url);
                            }}
                            hitSlop={8}
                            style={styles.manageButton}
                        >
                            <Text style={styles.manageText}>
                                Manage subscription in your {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} account
                            </Text>
                        </Pressable>

                        {/* Additional Apple Required Info */}
                        <Text style={styles.additionalInfo}>
                            Price shown is in USD and may vary by region. Subscription automatically renews unless cancelled.
                        </Text>

                        {__DEV__ && (
                            <Pressable
                                onPress={() => router.back()}
                                style={styles.devCloseButton}
                            >
                                <Text style={styles.devCloseText}>(Dev) Close</Text>
                            </Pressable>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Show error message if any */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable onPress={clearError} style={styles.errorDismiss}>
                        <Text style={styles.errorDismissText}>Dismiss</Text>
                    </Pressable>
                </View>
            )}

            {/* Loading overlay is now handled by individual button states */}
        </View>
    );
}

// Apple-compliant styles
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    iconContainer: {
        marginBottom: 20,
        padding: 20,
        borderRadius: 30,
        backgroundColor: 'rgba(255,215,0,0.1)',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 30,
    },
    featuresContainer: {
        width: '100%',
        marginBottom: 30,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    featureText: {
        color: 'white',
        marginLeft: 12,
        flex: 1,
    },
    subscriptionCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    planHeader: {
        alignItems: 'center',
    },
    planTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
    },
    price: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
    period: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        marginLeft: 4,
    },
    subscribeButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
    },
    subscribeButtonDisabled: {
        opacity: 0.6,
    },
    subscribeButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 8,
    },
    termsContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        width: '100%',
    },
    termsText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 4,
    },
    restoreButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    restoreButtonText: {
        color: '#007AFF',
        fontSize: 16,
        textAlign: 'center',
    },
    legalLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    legalButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    legalText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    legalSeparator: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginHorizontal: 8,
    },
    manageButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    manageText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    additionalInfo: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
        marginBottom: 20,
    },
    devCloseButton: {
        marginTop: 12,
        alignSelf: 'center',
        padding: 8,
    },
    devCloseText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    errorContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    errorText: {
        color: 'white',
        fontSize: 14,
        flex: 1,
    },
    errorDismiss: {
        marginLeft: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    errorDismissText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
