import { loginUser } from '@/utils/api'; // Import API function to handle login
import { useAuthStore } from '@/utils/authStore';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
// import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState(''); // State for password
    const [error, setError] = useState(''); // State for error handling
    const [showPassword, setShowPassword] = useState(false); // Toggle for showing/hiding password
    const { logIn } = useAuthStore(); // Access Zustand store

    // Handle Login
    const handleLogin = async () => {
        try {
            const userData = await loginUser(email, password); // Call the API to login
            logIn(userData); // Store user data in Zustand store
            // router.replace('/home'); // Navigate to home screen upon successful login
        } catch (err: String | any) {
            setError(err.message); // Set error message in case of failure
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

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.innerContainer}
                    >
                        <Text style={styles.title}>Welcome Back 👋</Text>
                        <Text style={styles.subtitle}>Login to continue your journey</Text>

                        <Image
                            source={require('../assets/images/splash.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#aaa"
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail} // Update email state
                            />

                            {/* Password Input */}
                            <View style={styles.passwordWrapper}>
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="#aaa"
                                    secureTextEntry={!showPassword}
                                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                    value={password} // Bind password state
                                    onChangeText={setPassword} // Update password state
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword((prev) => !prev)} // Toggle password visibility
                                    style={styles.eyeIconWrapper}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye' : 'eye-off'}
                                        size={22}
                                        color="#aaa"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Error Message */}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        {/* Forgot Password Button */}
                        <TouchableOpacity style={styles.forgotBtn}>
                            <Text style={styles.forgot}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={styles.signInBtn}
                            onPress={handleLogin} // Trigger login when pressed
                        >
                            <Text style={styles.btnText}>Sign In</Text>
                        </TouchableOpacity>

                        {/* Create New Account Button */}
                        <TouchableOpacity
                            style={styles.secondaryBtn}
                            onPress={() => router.push('/signup' as never)} // Navigate to sign up screen
                        >
                            <Text style={styles.secondaryText}>Create New Account</Text>
                        </TouchableOpacity>

                        {/* Terms and Privacy Policy */}
                        <View style={styles.termsContainer}>
                            <Text style={styles.terms}>
                                By signing in, you agree to our{' '}
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
    container: {
        flex: 1,
        // width,
        // height: height + 50,
        // backgroundColor: 'red',
        backgroundColor: '#000'
    },
    background: {
        width: "100%",
        height: "100%",
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
    logo: {
        width: 160,
        height: 160,
        marginBottom: 32,
    },
    inputContainer: {
        width: '100%',
    },
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
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: 14,
    },
    passwordInput: {
        flex: 1,
        color: '#fff',
    },
    eyeIconWrapper: {
        paddingLeft: 12,
        paddingRight: 4,
    },
    eyeIcon: {
        fontSize: 18,
        color: '#fff',
    },
    forgotBtn: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgot: {
        fontSize: 14,
        color: '#bbb',
        fontStyle: 'italic',
    },
    signInBtn: {
        width: '100%',
        backgroundColor: '#23d18b',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#23d18b',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    btnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
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
