import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, typography, spacing, gradientColors } from "../constants/styles";
import { useAuth } from './AuthContext';
import ContinueWithGoogleButton from '../components/ContinueWithGoogle';
import AuthInput from '../components/AuthInput';
import AlertComponent from '../components/AlertComponent';
import LoadingIndicator from '../components/LoadingIndicator';
import { handleAuthError, handleGoogleSignInError } from './utils/ErrorHandler';
import { validateEmail, validatePassword, validateName } from './utils/InputValidation';
import { sendUserData } from './api/requests';
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | { title: string; message: string }>(null);
  
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth();

  const validateInputs = () => {
    if (!validateName(name)) {
      setError({ title: 'Invalid Name', message: 'Please enter a valid name (at least 2 characters).' });
      return false;
    }
    if (!validateEmail(email)) {
      setError({ title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return false;
    }
    if (!validatePassword(password)) {
      setError({ title: 'Weak Password', message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.' });
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
  
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      console.log('User account created & signed in!');
      
      // Send user data to the server
      await sendUserData(name, userCredential.user.uid);
    } catch (error: any) {
      console.error('Sign Up Error:', error.code, error.message);
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
            <Text style={styles.title}>Sign up</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <AuthInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                autoCapitalize="words"
              />
            </View>

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
                placeholder="Create a password"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.signUpButtonText}>Sign up</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Or</Text>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/SignIn' as any)}>
                <Text style={styles.signInLink}>Log in</Text>
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
  signUpButton: {  
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingVertical: spacing.m,
    alignItems: 'center',
    marginTop: spacing.l,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButtonText: {  
    ...typography.button,
    color: colors.primary,
  },
  orText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.m,
  },
  signInText: {
    ...typography.body,
    color: colors.white,
  },
  signInLink: {
    ...typography.body,
    color: colors.white,
    textDecorationLine: 'underline',
  },
});