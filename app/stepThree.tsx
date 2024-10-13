// stepThree.tsx

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  colors,
  typography,
  spacing,
  gradientColors,
} from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';
import { useUpload } from './ManageUploadContext';
import {
  sendMessage,
  createAndLogResponseObject,
} from './api/requests';
import { useConversations } from './useConversations';
import PersonalityList from '../components/personalityList';
import { Ionicons } from '@expo/vector-icons';

export default function StepThree() {
  const router = useRouter();
  const { userObject } = useAuth();
  const {
    contextUploaded,
    infoUploaded,
    contextMessage,
    responseInfo,
    personalityName,
    setPersonalityName,
    clearContext,
    clearResponseInfo,
    clearPersonality,
  } = useUpload();
  const { user } = useAuth();
  const { addConversation } = useConversations(user?.uid || '');

  // Memoize personalitiesArray
  const personalitiesArray = useMemo(
    () =>
      userObject?.personalities
        ? Object.values(userObject.personalities).map((p) => p.personality)
        : [],
    [userObject]
  );

  // Memoize handleSelectPersonality
  const handleSelectPersonality = useCallback(
    (personality: string) => {
      setPersonalityName(personality);
    },
    [setPersonalityName]
  );

  // Memoize handleEditPersonality (currently empty)
  const handleEditPersonality = useCallback(() => {
    // Implement edit functionality if needed
  }, []);

  // Memoize handleCreatePersonality
  const handleCreatePersonality = useCallback(() => {
    router.push('/createPersonality');
    console.log('Create new personality');
  }, [router]);

  // Calculate progress
  const progress = useMemo(() => {
    return (
      (personalityName ? 33.33 : 0) +
      (contextUploaded ? 33.33 : 0) +
      (infoUploaded ? 33.33 : 0)
    );
  }, [personalityName, contextUploaded, infoUploaded]);

  // Handle Generate
  const handleGenerate = useCallback(async () => {
    if (progress > 99) {
      if (!user) {
        Alert.alert('Authentication Error', 'User not authenticated.');
        return;
      }

      // Navigate to the generatingResponse page first
      router.push('/generatingResponse');

      try {
        const response = await sendMessage(
          user.uid,
          contextMessage,
          responseInfo,
          personalityName as string
        );
        console.log('RESPONSE received:', response);

        // Create and log the local response object
        const localResponseObject = await createAndLogResponseObject(
          response.threadId,
          response.assistantResponse,
          user.uid,
          responseInfo,
          contextMessage,
          personalityName as string
        );

        // Add the new conversation
        await addConversation({
          threadId: response.threadId,
          lastMessage: response.assistantResponse,
          timestamp: Date.now(),
          personalityName: personalityName as string,
          userId: user.uid,
          context: contextMessage,
        });

        // Clear the context and response info after creating the local object
        clearContext();
        clearResponseInfo();
        clearPersonality();

        // Navigate to the preview page with the response
        router.push({
          pathname: '/preview',
          params: {
            response: response.assistantResponse,
            threadId: response.threadId,
          },
        });
      } catch (error) {
        console.error('Failed to send message:', error);
        Alert.alert('Error', 'Failed to generate response. Please try again.');
        // Navigate back to this step to allow retry
        router.back();
      }
    } else {
      Alert.alert(
        'Incomplete Steps',
        'Please complete all steps before generating a response.'
      );
    }
  }, [
    progress,
    user,
    contextMessage,
    responseInfo,
    personalityName,
    addConversation,
    clearContext,
    clearResponseInfo,
    clearPersonality,
    router,
  ]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.push('/stepTwo')}
              style={styles.headerButton}
              accessibilityLabel="Go back to step two"
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Personality</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Personality List */}
          <View style={styles.listContainer}>
            <PersonalityList
              personalities={personalitiesArray}
              selectedPersonality={personalityName || ''}
              onSelectPersonality={handleSelectPersonality}
              onEditPersonality={handleEditPersonality}
              onCreatePersonality={handleCreatePersonality}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerate}
              activeOpacity={0.7}
            >
              <Text style={styles.generateButtonText}>Generate Response</Text>
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: `${progress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {`${Math.round(progress)}% Complete`}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (styles adjusted for visual improvements)
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 0,
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
  listContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.l,
  },
  footer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  generateButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.s,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});
