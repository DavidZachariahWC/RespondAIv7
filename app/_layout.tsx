import React, { useEffect, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './AuthContext';
import { UploadProvider } from './ManageUploadContext';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    'CustomFont-Regular': require('../assets/fonts/Metropolis-Regular.otf'),
    'CustomFont-Bold': require('../assets/fonts/Metropolis-Bold.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <UploadProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar translucent backgroundColor="transparent" />
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}>
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="Intro" options={{ animation: 'none' }} />
          <Stack.Screen name="Home" options={{ animation: 'none' }} />
          <Stack.Screen name="SignIn" options={{ animation: 'none', headerShown: false }} />
          <Stack.Screen name="Settings" options={{ animation: 'fade' }} />
          <Stack.Screen name="SignUp" options={{ animation: 'none', headerShown: false }} />
          <Stack.Screen name="generatingResponse" options={{ animation: 'none', headerShown: false }} />
          <Stack.Screen name="preview" options={{ animation: 'none', headerShown: false }} />
          <Stack.Screen name="RecentChats" options={{ animation: 'fade', headerShown: false }} />
          <Stack.Screen name="stepOne" options={{ animation: 'slide_from_left', headerShown: false }} />
          <Stack.Screen name="stepTwo" options={{ animation: 'fade', headerShown: false }} />
          <Stack.Screen name="stepThree" options={{ animation: 'fade', headerShown: false }} />
          <Stack.Screen name="AccountDetails" options={{ animation: 'fade', headerShown: false }} />
          <Stack.Screen name="viewPersonalities" options={{ animation: 'fade', headerShown: false }} />
          <Stack.Screen name="createPersonality" options={{ animation: 'fade', headerShown: false }} />
          <Stack.Screen name="personalityDetails" options={{ animation: 'fade', headerShown: false }} />
        </Stack>
      </View>
      </UploadProvider>
    </AuthProvider>
  );
}