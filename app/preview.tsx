import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, gradientColors, spacing, globalStyles } from '../constants/styles';
import * as Clipboard from 'expo-clipboard';

export default function Preview() {
  const router = useRouter();
  const { response, threadId } = useLocalSearchParams();

  console.log('Thread ID in preview:', threadId);

  const handleCopyToClipboard = async () => {
    if (response) {
      try {
        await Clipboard.setStringAsync(response as string);
        console.log('Text copied to clipboard');
        // You might want to show a toast or some feedback here
      } catch (error) {
        console.error('Failed to copy text: ', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Preview</Text>
            <View style={styles.contentContainer}>
              <View style={[styles.responseBox, globalStyles.shadow]}>
                {response ? (
                  <Text style={styles.responseText}>{response as string}</Text>
                ) : (
                  <Text style={styles.placeholderText}>No response available</Text>
                )}
              </View>
              <Button
                title="Copy to Clipboard"
                onPress={handleCopyToClipboard}
                buttonStyle={[styles.button, globalStyles.shadow]}
                titleStyle={styles.buttonText}
                disabled={!response}
              />
              <Button
                title="Regenerate"
                onPress={() => {/* Implement regenerate functionality */}}
                buttonStyle={[styles.button, globalStyles.shadow, styles.regenerateButton]}
                titleStyle={styles.buttonText}
              />
              <TextInput
                style={[styles.input, globalStyles.shadow]}
                placeholder="Custom modifications here"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </ScrollView>
          <View style={styles.bottomContainer}>
            <Button
              title="Go Back Home"
              onPress={() => router.push('/Home')}
              buttonStyle={[styles.button, globalStyles.shadow, styles.homeButton]}
              titleStyle={styles.buttonText}
            />
          </View>
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
    justifyContent: 'space-between', // This will push the bottom container to the bottom
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: spacing.m,
    paddingBottom: spacing.xl * 2, // Add extra padding at the bottom for the button
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.m,
    marginTop: spacing.xl,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400, // Limit the maximum width for larger screens
    alignItems: 'center',
  },
  responseBox: {
    backgroundColor: colors.white,
    borderRadius: 15, // Slightly larger border radius
    padding: spacing.m,
    marginBottom: spacing.l,
    width: '100%',
    minHeight: 150, // Ensure the box has a minimum height
    borderWidth: 5, // Add a subtle border
    borderColor: 'rgba(0, 0, 0, 1)', // Very light black for the border
    // More pronounced shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  responseText: {
    ...typography.body,
    color: colors.black, // Changed to black
    textAlign: 'left',
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    marginBottom: spacing.m,
    width: 345, // Make buttons full width
    // Lighter shadow for buttons
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    ...typography.button,
    color: colors.secondary,
  },
  regenerateButton: {
    backgroundColor: colors.accent,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    marginBottom: spacing.m,
    width: '100%', // Make input full width
    ...typography.body,
    color: colors.text,
  },
  bottomContainer: {
    width: '100%',
    padding: spacing.m,
    backgroundColor: 'transparent',
  },
  homeButton: {
    marginTop: 0, // Remove top margin
  },
});