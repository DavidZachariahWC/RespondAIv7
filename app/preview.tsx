import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, gradientColors } from '../constants/styles';

export default function Preview() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.title}>Preview</Text>
          <Text style={styles.subtitle}>Your generated response will appear here.</Text>
          <Button
            title="Go Back Home"
            onPress={() => router.push('/Home')}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: 20,
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    ...typography.button,
    color: colors.secondary,
  },
});
