import { registerUser } from '@/utils/api'; // Register API function
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { BlurView } from 'expo-blur';

import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();
const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        webClientId: 'YOUR_WEB_CLIENT_ID',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                AsyncStorage.setItem('isLoggedIn', 'true');
                AsyncStorage.setItem('google_token', authentication.accessToken);
                // router.replace('/home'); // Navigate to home after successful signup
            }
        }
    }, [response]);

    const handleGoogleSignup = () => promptAsync();



    // Handle form-based signup
    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        try {
            // Call the API to register the user
            const userData = await registerUser(email, password);
            AsyncStorage.setItem('isLoggedIn', 'true');
            AsyncStorage.setItem('user_token', userData.token); // Assuming the token is returned
            router.replace('/login'); // Navigate to home after successful signup
        } catch (err: any) {
            setError(err.message); // Set error message if the registration fails
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../assets/images/splash-bg.png')}
                style={styles.background}
                contentFit="cover"
            >
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

                <ScrollView contentContainerStyle={styles.innerContainer1}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.innerContainer}
                    >
                        <Text style={styles.title}>Create Account ✨</Text>
                        <Text style={styles.subtitle}>Sign up to begin your adventure</Text>

                        <Image
                            source={require('../assets/images/splash.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#aaa"
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <View style={styles.passwordField}>
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="#aaa"
                                    secureTextEntry={!passwordVisible}
                                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={22} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.passwordField}>
                                <TextInput
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#aaa"
                                    secureTextEntry={!passwordVisible}
                                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={22} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity style={styles.signInBtn} onPress={handleSignup}>
                            <Text style={styles.btnText}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryBtn}
                            onPress={() => router.replace('/login')}
                        >
                            <Text style={styles.secondaryText}>Already have an account? Login</Text>
                        </TouchableOpacity>

                        {/* Social media buttons */}


                        <View style={styles.termsContainer}>
                            <Text style={styles.terms}>
                                By signing up, you agree to our{' '}
                            </Text>
                            <Pressable
                                onPress={() => router.push('/legal?type=terms')}
                                hitSlop={8}
                            >
                                <Text style={styles.link}>Terms</Text>
                            </Pressable>
                            <Text style={styles.terms}> & </Text>
                            <Pressable
                                onPress={() => router.push('/legal?type=privacy')}
                                hitSlop={8}
                            >
                                <Text style={styles.link}>Privacy Policy</Text>
                            </Pressable>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>

            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    background: {
        width: "100%",
        height: "100%",
    },
    backButton: {
        position: 'absolute',
        top: 25,
        left: 24,
        zIndex: 10,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    innerContainer1: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // paddingHorizontal: 24,
    },
    title: {
        fontSize: 34,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 24,
    },
    logo: { width: 160, height: 160, marginBottom: 32 },
    inputContainer: { width: '100%', marginBottom: 20 },
    input: {
        width: '100%',
        height: 52,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 14,
        paddingHorizontal: 16,
        color: '#fff',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    passwordField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: 14,
    },
    eyeIcon: { paddingHorizontal: 12 },
    signInBtn: {
        width: '100%',
        backgroundColor: '#23d18b',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 14,
    },
    btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
    secondaryBtn: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 20,
    },
    secondaryText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    or: {
        color: '#aaa',
        fontSize: 14,
        marginVertical: 10,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    iconBtn: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: { fontSize: 20, fontWeight: 'bold' },
    termsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    terms: {
        color: '#ccc',
        fontSize: 13,
        textAlign: 'center',
    },
    link: {
        color: '#23d18b',
        fontWeight: '600',
        fontSize: 13,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});
