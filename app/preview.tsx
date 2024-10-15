import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  colors,
  typography,
  gradientColors,
  spacing,
  globalStyles,
} from '../constants/styles';
import * as Clipboard from 'expo-clipboard';
import { useConversations, Conversation } from './useConversations';
import { continueThread } from './api/requests';
import { useAuth } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';

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
        Alert.alert('Copied', 'Response copied to clipboard.');
      } catch (error) {
        console.error('Failed to copy text: ', error);
        Alert.alert('Error', 'Failed to copy text.');
      }
    }
  };

  const handleRegenerate = async () => {
    if (!conversation || !user) return;

    setIsRegenerating(true);
    const additionalInfo = customModifications.trim();
    const userMessage = additionalInfo
      ? `Rewrite the message with the following additional information: ${additionalInfo}\nYour rewrite is separate from any previous attempts and each rewrite has no impact or relation to the previous ones.`
      : 'Rewrite the message.';

    try {
      const response = await continueThread(
        user.uid,
        userMessage,
        conversation.context,
        conversation.personalityName,
        conversation.threadId
      );

      const updatedConversation: Conversation = {
        ...conversation,
        lastMessage: response.assistantResponse,
        threadId: response.threadId, // Update the threadId in case it changed
      };

      await updateConversation(updatedConversation);
      setConversation(updatedConversation);
      setCustomModifications('');
    } catch (error) {
      console.error('Failed to regenerate response:', error);
      Alert.alert('Error', 'Failed to regenerate response. Please check your internet connection or ensure that this personality has not been deleted.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.headerButton}
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Response Preview</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.contentContainer}>
                {/* Response Box */}
                <View style={[styles.responseBox, globalStyles.shadow]}>
                  <ScrollView>
                    {conversation && conversation.lastMessage ? (
                      <Text style={styles.responseText}>{conversation.lastMessage}</Text>
                    ) : (
                      <Text style={styles.placeholderText}>No response available</Text>
                    )}
                  </ScrollView>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.copyButton]}
                    onPress={handleCopyToClipboard}
                    activeOpacity={0.7}
                    accessibilityLabel="Copy to clipboard"
                  >
                    <Ionicons name="copy-outline" size={20} color={colors.primary} />
                    <Text style={styles.buttonText}>Copy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.homeButton]}
                    onPress={() => router.push('/Home')}
                    activeOpacity={0.7}
                    accessibilityLabel="Go back home"
                  >
                    <Ionicons name="home-outline" size={20} color={colors.primary} />
                    <Text style={styles.buttonText}>Home</Text>
                  </TouchableOpacity>
                </View>

                {/* Custom Modifications Input */}
                <TextInput
                  style={[styles.input, globalStyles.shadow]}
                  placeholder="Add custom modifications..."
                  placeholderTextColor={colors.textSecondary}
                  value={customModifications}
                  onChangeText={setCustomModifications}
                  multiline
                />

                {/* Regenerate Button */}
                <TouchableOpacity
                  style={[styles.regenerateButton, globalStyles.shadow]}
                  onPress={handleRegenerate}
                  activeOpacity={0.7}
                  disabled={!!(isRegenerating || !conversation)}
                  accessibilityLabel="Regenerate response"
                >
                  {isRegenerating ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Ionicons name="refresh-outline" size={24} color={colors.primary} />
                      <Text style={styles.regenerateButtonText}>Regenerate</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
    backgroundColor: 'transparent',
  },
  headerButton: {
    padding: spacing.s,
  },
  headerTitle: {
    ...typography.h2Bold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.l,
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  responseBox: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.l,
    width: '100%',
    maxHeight: 300,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  responseText: {
    ...typography.body,
    color: colors.textDark,
    textAlign: 'left',
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.m,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    flex: 1,
    marginHorizontal: spacing.s,
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.button,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  copyButton: {},
  homeButton: {},
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    marginBottom: spacing.m,
    width: '100%',
    ...typography.body,
    color: colors.textDark,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white, // Changed from colors.primary
    borderRadius: 10,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    width: '100%',
    justifyContent: 'center',
  },
  regenerateButtonText: {
    ...typography.button,
    color: colors.primary, // Changed from colors.white
    marginLeft: spacing.s,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
