import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { BlurView } from "expo-blur";
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Platform, StyleSheet, View } from "react-native";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/utils/authStore';
import { ImageBackground } from "expo-image";
import revenueCatService from '@/services/revenueCat';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

const { width, height } = Dimensions.get("window");
// const isLoggedIn = false;
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [isAppReady, setAppReady] = useState(false);
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const {
    isLoggedIn,
  } = useAuthStore();

  // Initialize subscription status monitoring
  useSubscriptionStatus();
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Initialize RevenueCat early in app lifecycle (only on real devices)
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          await revenueCatService.initialize();
          console.log('RevenueCat initialized successfully');
        } else {
          console.log('Skipping RevenueCat initialization - not on mobile device');
        }
      } catch (error) {
        console.error('Failed to initialize RevenueCat:', error);
        // Continue app initialization even if RevenueCat fails
      }

      await SplashScreen.hideAsync();
      // const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      // console.log(isLoggedIn, "aaa")
      // if (isLoggedIn != null || isLoggedIn) {

      //   setLoginStatus(true);
      // }
      setTimeout(() => {
        setAppReady(true);
      }, 3000); // splash delay
    };

    prepareApp();
  }, []);

  // useEffect(() => {
  //   const prepareApp = async () => {
  //     await SplashScreen.hideAsync();

  //     const storedLogin = await AsyncStorage.getItem('isLoggedIn');
  //     setLoggedIn(storedLogin === 'true');
  //     setAppReady(true);
  //   };

  //   prepareApp();
  // }, []);
  if (!isAppReady || !fontsLoaded) {

    return (
      <View style={styles.container1}>
        <Image
          source={require("../assets/images/splash-bg.png")}
          style={styles.background1}
          resizeMode="cover"
        />
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        <Image
          source={require("../assets/images/splash.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/splash-bg.png")}
      style={styles.background2}
      contentFit="cover"
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill}>

          <Stack>
            <Stack.Protected guard={!isLoggedIn} >
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={isLoggedIn} >
              <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            </Stack.Protected>


            <Stack.Screen name="+not-found" />
          </Stack>
        </BlurView>

        {/* <StatusBar style="auto" hidden /> */}
        <StatusBar translucent backgroundColor="transparent" />
      </ThemeProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#004f66",
  },
  background: {
    // position: "absolute",
    width: "100%",
    height: "100%",
  },
  container1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#004f66",
  },
  background1: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  background2: {
    position: "relative",

    width: "100%",
    height: "100%",
  },
  logo: {
    width: 280,
    height: 280,
  },
});
