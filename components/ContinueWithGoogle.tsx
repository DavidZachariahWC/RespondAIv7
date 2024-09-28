import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { colors, typography, spacing } from "../constants/styles";

interface ContinueWithGoogleButtonProps {
  onPress: () => Promise<void>;
}

const ContinueWithGoogleButton: React.FC<ContinueWithGoogleButtonProps> = ({ onPress }) => {
  const handlePress = async () => {
    try {
      await onPress();
    } catch (error) {
      // Error handling is now done in the parent component
      console.error('Google Sign In Error:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/images/google-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.m,
    // Shadow properties
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: spacing.s,
  },
  text: {
    ...typography.button,
    color: colors.textDark,
  },
});

export default ContinueWithGoogleButton;