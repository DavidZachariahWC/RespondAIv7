import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, gradientColors, spacing, globalStyles } from '../constants/styles';
import * as Clipboard from 'expo-clipboard';
import { useConversations, Conversation } from './useConversations';
import { continueThread } from './api/requests';
import { useAuth } from './AuthContext';

export default function Preview() {
  const router = useRouter();
  const { threadId } = useLocalSearchParams();
  const { user } = useAuth();
  const { getConversationByThreadId, updateConversation } = useConversations(user?.uid || '');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [customModifications, setCustomModifications] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (threadId && user) {
      const fetchedConversation = getConversationByThreadId(threadId as string);
      console.log('Fetched conversation:', fetchedConversation);
      setConversation(fetchedConversation);
    }
  }, [threadId, getConversationByThreadId, user]);

  const handleCopyToClipboard = async () => {
    if (conversation?.lastMessage) {
      try {
        await Clipboard.setStringAsync(conversation.lastMessage);
        console.log('Text copied to clipboard');
        // You might want to show a toast or some feedback here
      } catch (error) {
        console.error('Failed to copy text: ', error);
      }
    }
  };

  const handleRegenerate = async () => {
    if (!conversation || !user) return;

    console.log('Current conversation before regeneration:', conversation); // Log the current conversation

    setIsRegenerating(true);
    const additionalInfo = customModifications.trim();
    const userMessage = additionalInfo
      ? `Rewrite the message with the following additional information: ${additionalInfo} \n Your rewrite is seperate from any previous attempts and each rewrite has no impact or relation to the previous ones.`
      : "Rewrite the message.";

    console.log('User message for regeneration:', userMessage); // Log the user message
    console.log('Context for regeneration:', conversation.context); // Log the context

    try {
      const response = await continueThread(
        user.uid,
        userMessage,
        conversation.context,
        conversation.personalityName,
        conversation.threadId
      );
      
      console.log('Response from continueThread:', response); // Log the response

      // Update the conversation with the new response
      const updatedConversation: Conversation = {
        ...conversation,
        lastMessage: response.assistantResponse,
        threadId: response.threadId, // Update the threadId in case it changed
      };
      
      console.log('Updated conversation:', updatedConversation); // Log the updated conversation

      await updateConversation(updatedConversation);
      setConversation(updatedConversation);
      setCustomModifications('');
    } catch (error) {
      console.error('Failed to regenerate response:', error);
      Alert.alert('Error', 'Failed to regenerate response. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Response</Text>
            <View style={styles.contentContainer}>
              <ScrollView style={[styles.responseBox, globalStyles.shadow]}>
                {conversation ? (
                  <Text style={styles.responseText}>{conversation.lastMessage}</Text>
                ) : (
                  <Text style={styles.placeholderText}>No response available</Text>
                )}
              </ScrollView>
              <Button
                title="Copy to Clipboard"
                onPress={handleCopyToClipboard}
                buttonStyle={[styles.button, globalStyles.shadow]}
                titleStyle={styles.buttonText}
                disabled={!conversation}
              />
              <TextInput
                style={[styles.input, globalStyles.shadow]}
                placeholder="Custom modifications here"
                placeholderTextColor={colors.textSecondary}
                value={customModifications}
                onChangeText={setCustomModifications}
                multiline
              />
              <Button
                title={isRegenerating ? "Regenerating..." : "Regenerate"}
                onPress={handleRegenerate}
                buttonStyle={[styles.button, globalStyles.shadow, styles.regenerateButton]}
                titleStyle={styles.buttonText}
                disabled={isRegenerating || !conversation}
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
    maxHeight: 300, // Set a max height and allow scrolling
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
    height: 60, // Increased height for the regenerate button
    justifyContent: 'center', // Center the text vertically
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    marginBottom: spacing.m,
    width: '100%', // Make input full width
    ...typography.body,
    color: colors.black, // Changed to black
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