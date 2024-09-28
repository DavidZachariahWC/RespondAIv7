import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Image } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, gradientColors } from "../constants/styles";

interface CustomSplashScreenProps {
  logoSource: number;
  appName: string;
}

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ logoSource, appName }) => {
  return (
    <View style={styles.container} testID="custom-splash-screen">
      <LinearGradient colors={gradientColors} style={styles.background}>
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel={`${appName} logo`}
        />
        <Text style={styles.appName} accessibilityRole="header">
          {appName}
        </Text>
        <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.l,
  },
  appName: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.xl,
  },
  loader: {
    marginTop: spacing.l,
  },
});

export default CustomSplashScreen;