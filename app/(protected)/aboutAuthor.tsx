import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Credits / Copyright screen with a blurred background image and a bottom "Continue" button.
 *
 * Drop your background art at: assets/images/credits-bg.jpg
 * Or pass a remote URL to BG_SOURCE below.
 */
const BG_SOURCE = require('@/assets/images/splash-bg.png');

export default function CreditsScreen() {
    const router = useRouter();

    const onContinue = () => {
        // go to your home screen / first chapter route
        // change the href below to wherever you want to land
        router.replace('/');
    };

    const onOpenSite = async () => {
        const url = 'https://www.TalesFromTheNorthPole.com';
        try { await Linking.openURL(url); } catch { }
    };

    return (
        <View style={styles.root}>
            {/* Background image */}
            <Image
                source={BG_SOURCE}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                // soft blur roughly matching the screenshot
                blurRadius={Platform.select({ ios: 6, android: 6, default: 3 })}
                transition={300}
            />

            {/* Legibility gradient from top & bottom */}
            <LinearGradient
                colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.05)", "rgba(0,0,0,0.35)"]}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safe}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.textWrap}>
                        <Text style={[styles.h1, styles.center]}>AUTHOR</Text>
                        <Text style={[styles.h2, styles.center]}>ROLLOND EDDY</Text>

                        <Text style={[styles.p, styles.center, styles.mtLg]}>
                            Original Concept and Characters Created By: <Text style={styles.bold}>Rollond Eddy</Text>
                        </Text>

                        <Text style={[styles.p, styles.center]}>
                            Illustrations & Animation By: <Text style={styles.bold}>The Imagination Team</Text>
                        </Text>

                        <Text style={[styles.p, styles.center]}>
                            Contributors · Robert Marvin & Family and Dillon Ricci
                        </Text>

                        <Text style={[styles.p, styles.center, styles.mtMd]}>
                            Signature Book Printing{"\n"}
                            8041 Cessna Ave, Ste 132{"\n"}
                            Gaithersburg, MD 20879
                        </Text>

                        <Pressable onPress={onOpenSite} accessibilityRole="link">
                            <Text style={[styles.link, styles.center, styles.mtSm]}>Website www.TalesFromTheNorthPole.com</Text>
                        </Pressable>

                        <Text style={[styles.p, styles.center, styles.mtMd]}>
                            Copyright, 2025 By The Elf Chronicles LLC
                        </Text>

                        <Text style={[styles.p, styles.center]}>
                            All rights reserved. No part of the book may be reproduced in any form
                            without written permission from the author.
                        </Text>

                        <Text style={[styles.p, styles.center]}>
                            The events and characters in this book are fictitious.
                        </Text>

                        <Text style={[styles.p, styles.center]}>
                            Any similarity to real persons, living or dead, is coincidental and not intended by the author.
                        </Text>

                        <Text style={[styles.p, styles.center, styles.mtSm]}>ISBN: 979-8-218-99808-0</Text>
                    </View>
                    <View style={styles.footer}>
                        <Pressable onPress={onContinue} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]} accessibilityRole="button">
                            <Text style={styles.ctaText}>Continue</Text>
                        </Pressable>
                    </View>
                </ScrollView>

                {/* Bottom sticky Continue button */}

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0b0b0b',
    },
    safe: { flex: 1 },
    content: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 120, // leaves room so text doesn't hide under the button
    },
    textWrap: {
        maxWidth: 520,
        alignSelf: 'center',
    },
    center: { textAlign: 'center' },
    h1: {
        fontSize: 26,
        letterSpacing: 2,
        color: '#0b0b0b',
        fontWeight: '800',
        textTransform: 'uppercase',
        // subtle light text over darkened bg
        textShadowColor: 'rgba(255,255,255,0.55)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    h2: {
        fontSize: 32,
        letterSpacing: 1,
        marginTop: 2,
        marginBottom: 8,
        fontWeight: '900',
        color: '#0b0b0b',
        textShadowColor: 'rgba(255,255,255,0.55)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    p: {
        fontSize: 15,
        lineHeight: 22,
        color: '#0b0b0b',
        textShadowColor: 'rgba(255,255,255,0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
        marginBottom: 10,
    },
    bold: { fontWeight: '700' },
    link: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0a3c8b',
        textDecorationLine: 'underline',
    },
    mtSm: { marginTop: 8 },
    mtMd: { marginTop: 14 },
    mtLg: { marginTop: 18 },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 24,
        paddingBottom: Platform.select({ ios: 20, android: 16, default: 16 }),
        paddingTop: 12,
        // a top gradient strip to lift the button
    },
    cta: {
        height: 48,
        borderRadius: 14,
        backgroundColor: '#1a1e3a',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    ctaText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.25,
    },
});
