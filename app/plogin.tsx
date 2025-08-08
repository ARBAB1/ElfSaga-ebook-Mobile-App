import { BlurView } from 'expo-blur';
import React from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            {/* Background & Blur */}
            <Image
                source={require('../assets/images/splash-bg.png')}
                style={styles.background}
                resizeMode="cover"
            />
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

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

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#aaa"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signInBtn}>
                    <Text style={styles.btnText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBtn}>
                    <Text style={styles.secondaryText}>Create New Account</Text>
                </TouchableOpacity>

                <Text style={styles.or}>─ OR ─</Text>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.icon}>G</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.icon}>f</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.terms}>
                    By signing in, you agree to our{' '}
                    <Text style={styles.link}>Terms</Text> &{' '}
                    <Text style={styles.link}>Privacy Policy</Text>
                </Text>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        width,
        height,
        position: 'absolute',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
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
    icon: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    terms: {
        color: '#ccc',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    link: {
        color: '#23d18b',
        fontWeight: '600',
    },
});
