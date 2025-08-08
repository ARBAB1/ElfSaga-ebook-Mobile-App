// import { Redirect, Stack } from 'expo-router';
// import React from 'react';

// // import { HapticTab } from '@/components/HapticTab';
// // import { IconSymbol } from '@/components/ui/IconSymbol';
// // import TabBarBackground from '@/components/ui/TabBarBackground';
// // import { Colors } from '@/constants/Colors';
// // import { useColorScheme } from '@/hooks/useColorScheme';
// import { useAuthStore } from '@/utils/authStore';
// import { StatusBar } from 'expo-status-bar';

// export default function ProtectedLayout() {
//   const {
//     isLoggedIn,
//   } = useAuthStore();
//   // const isLoggedIn = true;
//   // const colorScheme = useColorScheme();
//   // useEffect(() => {
//   //   const prepareApp = async () => {
//   //     // const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
//   //     console.log(isLoggedIn)

//   //     if (isLoggedIn === null || !isLoggedIn) {
//   //       // <Redirect href="(tabs)" />
//   //       <Redirect href="/(auth)/login" />
//   //     }


//   //   };

//   //   prepareApp();
//   // }, []);
//   // useEffect(() => {
//   //   if (!isLoggedIn) {
//   //     // <Redirect href="(tabs)" />
//   //     <Redirect href="/auth/authentication/test" />
//   //   }
//   // }, [])

//   if (!isLoggedIn) {
//     // <Redirect href="(tabs)" />
//     return <Redirect href={"/login" as never} />
//   }


//   return (
//     <>
//       <StatusBar style="auto" />
//       <Stack>
//         <Stack.Screen name="index" />
//       </Stack>
//     </>
//   );
// }


'use client';
import { useAuthStore } from '@/utils/authStore';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProtectedLayout() {
  const { isLoggedIn, logOut } = useAuthStore();
  const router = useRouter();

  // If the user is not logged in, redirect to the login screen
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  const handleLogout = () => {
    // logOut(); // Clear Zustand auth store
    // router.replace('/login'); // Redirect to login
    console.log("first")
  };

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: '#066863',
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#066863',
      }}
    >
      {/* Home Screen */}
      <Drawer.Screen
        name="home"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Screen */}
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Logout Button in Drawer */}
      <View style={styles.drawerButtonContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.drawerButton}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerButtonContainer: {
    marginTop: 'auto', // Push the logout button to the bottom
    marginBottom: 20, // Add space from the bottom
  },
  drawerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#069999', // Same color as the header
    borderRadius: 5,
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});
