// app/(protected)/account.tsx
import { useAuthStore } from '@/utils/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const BG = require('@/assets/images/splash-bg.png');

export default function AccountScreen() {
    const router = useRouter();
    const { logOut /* add deleteAccount to your store if you have one */ } = useAuthStore();
    const [busy, setBusy] = useState(false);

    const confirmDelete = () => {
        Alert.alert(
            'Delete account',
            'This permanently deletes your account and data. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: handleDelete },
            ]
        );
    };

    const handleDelete = async () => {
        try {
            setBusy(true);

            // TODO: replace with your real API call / store action
            // await deleteAccount();
            await new Promise((r) => setTimeout(r, 1200)); // demo delay

            // After a successful deletion, log out and go to login
            logOut();
            router.replace('/login');
        } catch (e) {
            Alert.alert('Something went wrong', 'Please try again.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <ImageBackground source={BG} style={styles.bg} resizeMode="cover" blurRadius={6}>
            <View style={styles.overlay} />

            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Account</Text>
                    <Text style={styles.sub}>
                        Manage your account and privacy settings.
                    </Text>

                    <Pressable
                        onPress={confirmDelete}
                        disabled={busy}
                        style={({ pressed }) => [
                            styles.deleteBtn,
                            pressed && { opacity: 0.9 },
                            busy && { opacity: 0.6 },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel="Delete account"
                    >
                        {busy ? (
                            <ActivityIndicator />
                        ) : (
                            <>
                                <Ionicons name="trash-outline" size={20} color="#fff" />
                                <Text style={styles.deleteText}>Delete account</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(6, 104, 99, 0.45)',
    },
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    card: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 560,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    title: { fontSize: 20, fontWeight: '800', color: '#0b0b0b' },
    sub: { marginTop: 6, color: '#333' },
    deleteBtn: {
        marginTop: 18,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#d11a2a',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
    },
    deleteText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
