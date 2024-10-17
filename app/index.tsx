import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useRootNavigationState, useRouter, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import CustomSplashScreen from '../components/CustomSplashScreen';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Import getAnalytics if you plan to use it
// import { getAnalytics } from "firebase/analytics";

SplashScreen.preventAutoHideAsync().catch(console.warn);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAec7NIVqzu4T3E3Q3Isuzye2x7LLIC6qA",
  authDomain: "respondaiv7.firebaseapp.com",
  projectId: "respondaiv7",
  storageBucket: "respondaiv7.appspot.com",
  messagingSenderId: "40724096528",
  appId: "1:40724096528:web:039c2f295ec823374a8c95",
  measurementId: "G-QHKP56N9NY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Analytics if you plan to use it
// const analytics = getAnalytics(app);

export default function Index() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const rootNavigationState = useRootNavigationState();
  const router = useRouter();

  const prepare = useCallback(async () => {
    try {
      await Font.loadAsync({
        'CustomFont-Regular': require('../assets/fonts/Metropolis-Regular.otf'),
        'CustomFont-Bold': require('../assets/fonts/Metropolis-Bold.otf'),
      });
      // Add any other initialization logic here
    } catch (e) {
      console.error('Error during app initialization and font loading:', e);
    } finally {
      setAppIsReady(true);
    }
  }, []);

  useEffect(() => {
    prepare();

    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user as any);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [prepare]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !rootNavigationState?.key) {
    return (
      <CustomSplashScreen
        logoSource={require('../assets/images/newIcon.png')}
        appName="RespondAI"
      />
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {user ? <Redirect href="/Home" /> : <Redirect href="/Intro" />}
    </View>
  );
}