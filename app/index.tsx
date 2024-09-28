import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useRootNavigationState, useRouter, Link, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import CustomSplashScreen from '../components/CustomSplashScreen';
import { AppRoutes } from '../types/routes'; // routes not used because of type issues

SplashScreen.preventAutoHideAsync().catch(console.warn);

export default function Index() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [temporaryUser, setTemporaryUser] = useState<{ id: string } | null>(null);
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
    // Simulate user authentication after a short delay
    const timer = setTimeout(() => {
      // Toggle this to simulate logged in (object) or logged out (null) state
      setTemporaryUser({ id: 'temp-user-id' });
      // setTemporaryUser(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [prepare]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !rootNavigationState?.key) {
    return (
      <CustomSplashScreen
        logoSource={require('../assets/images/icon.png')}
        appName="RespondAI"
      />
    );
  }


  //const user = auth().currentUser;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {temporaryUser ? <Redirect href="/Home" /> : <Redirect href="/Intro" />}
      {/*<Link href="/Home" />*/}
    </View>
  );
}