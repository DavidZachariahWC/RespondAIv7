import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, gradientColors } from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';
import { useUpload } from './ManageUploadContext';
import { sendMessage, createAndLogResponseObject } from './api/requests';
import { useConversations } from './useConversations';

type Personality = {
  id: number;
  name: string;
};

// Reusable PersonalityButton Component with 'selected' prop
const PersonalityButton = React.memo(
  ({
    name,
    onPress,
    selected,
  }: {
    name: string;
    onPress: () => void;
    selected: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.personalityButton,
        selected ? styles.personalityButtonSelected : null,
      ]}
      onPress={onPress}
      accessibilityLabel={`Select ${name} personality`}
    >
      <Text
        style={[
          styles.personalityButtonText,
          selected ? styles.personalityButtonTextSelected : null,
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  )
);

export default function StepThree() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [listHeight, setListHeight] = useState(0);
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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const personalitiesArray = userObject?.personalities
    ? Object.values(userObject.personalities).map((p) => p.personality)
    : [];
  const indicatorSize = listHeight / (personalitiesArray.length || 1);
  const indicatorTranslate = scrollY.interpolate({
    inputRange: [0, listHeight],
    outputRange: [0, listHeight - indicatorSize],
    extrapolate: 'clamp',
  });

  // Handle personality selection
  const handleSelectPersonality = useCallback(
    (personality: string) => {
      setPersonalityName(personality);
    },
    [setPersonalityName]
  );

  // Render item function for FlatList with 'selected' prop
  const renderPersonalityButton = useCallback(
    ({ item }: { item: string }) => (
      <PersonalityButton
        name={item}
        onPress={() => handleSelectPersonality(item)}
        selected={item === personalityName} // Pass 'selected' prop
      />
    ),
    [handleSelectPersonality, personalityName]
  );

  // Calculate progress
  const progress = React.useMemo(() => {
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
        console.log('Context:', contextMessage);
        console.log('Thread ID:', response.threadId);
        console.log('Assistant Message:', response.assistantResponse);

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
          params: { response: response.assistantResponse, threadId: response.threadId },
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
          <View style={styles.header}>
            <Button
              icon={<Icon name="arrow-left" type="feather" size={24} color={colors.white} />}
              type="clear"
              onPress={() => router.back()}
              buttonStyle={styles.backButton}
            />
            <Text style={styles.headerTitle}>Select Personality</Text>
            <View style={{ width: 40 }} />
          </View>

          <FlatList
            data={personalitiesArray}
            renderItem={renderPersonalityButton}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.listContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
          />

          <TouchableOpacity
            style={[
              styles.generateButton,
              progress > 99 ? styles.generateButtonActive : null,
            ]}
            onPress={handleGenerate}
            activeOpacity={0.7}
            disabled={progress <= 99}
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
          <Text style={styles.progressText}>{`${Math.round(progress)}% Complete`}</Text>
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
    paddingTop: 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    flexShrink: 1,
  },
  listContainer: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.l,
    paddingBottom: spacing.m,
  },
  personalityButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: 'transparent', // Default border color
  },
  personalityButtonSelected: {
    backgroundColor: colors.primary, // Highlighted background
    borderColor: colors.secondary,   // Highlighted border
    borderWidth: 2,
  },
  personalityButtonText: {
    ...typography.body,
    color: colors.white,
  },
  personalityButtonTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10, // Increased shadowOffset for deeper shadow
    },
    shadowOpacity: 0.6, // Increased shadowOpacity for stronger shadow
    shadowRadius: 10, // Increased shadowRadius for more spread
    elevation: 20, // Further increased elevation for enhanced 3D effect
    borderColor: 'black',
    borderWidth: 1,
    transform: [{ translateY: 2 }], // Slight downward translation to mimic depth
  },
  generateButtonActive: {
    backgroundColor: colors.primary,
  },
  generateButtonText: {
    ...typography.button,
    color: colors.primary,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: spacing.m,
    marginHorizontal: spacing.m,
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
    marginTop: spacing.s,
  },
});