import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, typography, spacing, gradientColors } from "../constants/styles";
import { useAuth } from './AuthContext';
import ContinueWithGoogleButton from '../components/ContinueWithGoogle';
import AuthInput from '../components/AuthInput';
import AlertComponent from '../components/AlertComponent';
import LoadingIndicator from '../components/LoadingIndicator';
import { handleAuthError } from './utils/ErrorHandler';
import { sendUserData } from './api/requests';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | { title: string; message: string }>(null);
  
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully');
    } catch (error: any) {
      console.error('Sign In Error:', error.code, error.message);
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={gradientColors} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <Text style={styles.title}>Log in</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Email</Text>
              <AuthInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <AuthInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.signInButtonText}>Log in</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Or</Text>
            
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/SignUp' as any)}>
                <Text style={styles.signUpButtonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <AlertComponent
              //title={error.title}
              message={error.message}
              onDismiss={() => setError(null)}
              severity="error"
            />
          )}

          {loading && <LoadingIndicator />}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    flex: 1,
    padding: spacing.l,
    paddingTop: spacing.xl * 2,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.m,
  },
  label: {
    ...typography.body,
    color: colors.white,
    marginBottom: spacing.s,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl - 10,
    left: spacing.l - 15,
    zIndex: 1,
    padding: spacing.s,
  },
  signInButton: {  
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingVertical: spacing.m,
    alignItems: 'center',
    marginTop: spacing.l,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInButtonText: {  
    ...typography.button,
    color: colors.primary,
  },
  orText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginVertical: spacing.l,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  signUpText: {
    ...typography.body,
    color: colors.white,
  },
  signUpButtonText: {
    ...typography.body,
    color: colors.white,
    textDecorationLine: 'underline',
  },
});