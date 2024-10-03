import { AuthError } from 'firebase/auth';

type ErrorType = 'auth' | 'network' | 'user-input' | 'unknown';

interface ErrorMessage {
  title: string;
  message: string;
  type: ErrorType;
}

const errorMessages: { [key: string]: ErrorMessage } = {
  'auth/user-not-found': {
    title: 'Account Not Found',
    message: 'No account found with this email. Please check your email or sign up for a new account.',
    type: 'auth',
  },
  'auth/wrong-password': {
    title: 'Incorrect Password',
    message: 'The password you entered is incorrect. Please try again or reset your password.',
    type: 'auth',
  },
  'auth/invalid-email': {
    title: 'Invalid Email',
    message: 'Please enter a valid email address.',
    type: 'user-input',
  },
  'auth/email-already-in-use': {
    title: 'Email Already in Use',
    message: 'This email is already associated with an account. Please use a different email or try logging in.',
    type: 'auth',
  },
  'auth/weak-password': {
    title: 'Weak Password',
    message: 'Please choose a stronger password. It should be at least 6 characters long.',
    type: 'user-input',
  },
  'auth/network-request-failed': {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    type: 'network',
  },
  'auth/invalid-credential': {
    title: 'Invalid Credentials',
    message: 'The email or password you entered is incorrect. Please check your credentials and try again.',
    type: 'auth',
  },
  'auth/too-many-requests': {
    title: 'Too Many Attempts',
    message: 'Too many unsuccessful login attempts. Please try again later or reset your password.',
    type: 'auth',
  },
  'auth/user-disabled': {
    title: 'Account Disabled',
    message: 'This account has been disabled. Please contact support for assistance.',
    type: 'auth',
  },
};

export const handleAuthError = (error: AuthError): ErrorMessage => {
  console.log('Firebase Auth Error:', error.code, error.message); // For debugging

  const knownError = errorMessages[error.code];
  if (knownError) {
    return knownError;
  }

  // Handle unknown errors
  console.error('Unknown error:', error);
  return {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again later.',
    type: 'unknown',
  };
};

export const handleGoogleSignInError = (error: any): ErrorMessage => {
  if (error.code === 'auth/popup-closed-by-user') {
    return {
      title: 'Google Sign-In Cancelled',
      message: 'Google Sign-In was cancelled. Please try again if you want to sign in with Google.',
      type: 'auth',
    };
  }
  
  // For other Google Sign-In errors, we'll use a generic message
  console.error('Google Sign-In error:', error);
  return {
    title: 'Google Sign-In Error',
    message: 'An error occurred during Google Sign-In. Please try again.',
    type: 'auth',
  };
};