// app/(protected)/_layout.tsx
'use client';

import { useAuthStore } from '@/utils/authStore';
import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Redirect, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

// 🔹 local image (put a jpg/png in your assets folder)
const BG = require('@/assets/images/splash-bg.png');
// // or remote fallback:
// const BG = { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200' };

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { logOut } = useAuthStore();

  const onLogout = () => {
    logOut();
    router.replace('/login');
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={styles.bgOverlay} />

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Pretty header area */}
        <View style={styles.header}>
          {/* <View style={styles.avatar} /> */}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Welcome 👋</Text>
            <Text style={styles.sub}>Have a great session</Text>
          </View>
        </View>

        {/* Auto-renders your <Drawer.Screen/> items */}
        <View style={{ flexGrow: 1 }}>
          <DrawerItemList {...props} />
        </View>

        {/* Sticky bottom action */}
        <View style={styles.footer}>
          <DrawerItem
            label="Logout"
            onPress={onLogout}
            icon={({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            )}
            style={styles.logoutItem}
            labelStyle={styles.logoutLabel}
          />
        </View>
      </DrawerContentScrollView>
    </ImageBackground>
  );
}

export default function ProtectedLayout() {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <Drawer
      // global look & feel
      screenOptions={{
        // Header
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        headerBackground: () => (
          <ImageBackground source={BG} style={{ flex: 1 }} blurRadius={8} />
        ),

        // Drawer colors integrate with the background image
        drawerStyle: { backgroundColor: 'transparent' },
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: 'rgba(255,255,255,0.8)',
        drawerLabelStyle: { fontSize: 15, fontWeight: '500' },
        drawerItemStyle: { borderRadius: 12, marginHorizontal: 12 },

        // Scene (screen) background behind content
        // sceneContainerStyle: { backgroundColor: '#0b132b' },
      }}
      drawerContent={(p) => <CustomDrawerContent {...p} />}
    >
      {/* Home */}
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="aboutAuthor"
        options={{
          title: 'About Author',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ribbon-outline" size={size} color={color} />
            // nice alternatives: "information-circle-outline", "book-outline", "sparkles-outline"
          ),
        }}
      />
      <Drawer.Screen
        name="subscribe" // if your file is app/(protected)/subscribe/index.tsx
        // name="subscribe"     // use this instead if your file is app/(protected)/subscribe.tsx
        options={{
          title: 'Subscription',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />


      <Drawer.Screen
        name="account"
        options={{
          title: 'Delete Account',
          drawerIcon: ({ color, size }) => (
            // <Ionicons name="trash-outline" size={size} color={color} />

            <Ionicons name="trash-outline" size={size} color={"red"} />
          ),
        }}
      />

      {/* Example extra screens (uncomment when you add them) */}
      {/*
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      */}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 104, 99, 0.45)', // teal glass overlay for contrast
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 0,
    paddingBottom: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sub: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 4,
  },
  logoutItem: {
    borderRadius: 12,
    marginHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  logoutLabel: {
    fontWeight: '600',
  },
});
