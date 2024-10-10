import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, globalStyles, gradientColors } from "../constants/styles";
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { AppRoutes } from '../types/routes';
import { getAuth, signOut } from "firebase/auth";
import { useConversations } from './useConversations';
import ConversationCard from '../components/conversationCard';
import { useAuth } from './AuthContext';

export default function Home() {
  const router = useRouter();
  const auth = getAuth();
  const { user } = useAuth();
  const { conversations, deleteConversation } = useConversations(user?.uid || null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      // Router will automatically redirect to SignIn page due to auth state change
    } catch (error) {
      console.error('Sign out error', error);
      Alert.alert('Sign Out Error', 'An error occurred while signing out. Please try again.');
    }
  };

  const handleDeleteConversation = (threadId: string) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteConversation(threadId);
            // The list will automatically update due to state change in useConversations
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={gradientColors}
        style={globalStyles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.title}>RespondAI</Text>
              <Button
                icon={<Ionicons name="settings-outline" size={24} color={colors.white} />}
                type="clear"
                onPress={() => router.push("/Settings" as any)}
              />
            </View>
            <View style={styles.content}>
              <Text style={styles.subtitle}>Start a new conversation</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Respond to Message"
                  icon={<Ionicons name="chatbubble-outline" size={24} color={colors.white} style={styles.buttonIcon} />}
                  buttonStyle={styles.button}
                  titleStyle={styles.buttonTitle}
                  onPress={() => router.push("/Context" as any)}
                />
              </View>
            </View>
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>Recent Chats</Text>
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.threadId}
                    threadId={conversation.threadId}
                    lastMessage={conversation.lastMessage}
                    onDelete={handleDeleteConversation}
                  />
                ))
              ) : (
                <Text style={styles.noConversationsText}>No recent conversations</Text>
              )}
            </View>
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              buttonStyle={styles.signOutButton}
              titleStyle={styles.signOutButtonTitle}
              icon={<Ionicons name="log-out-outline" size={24} color={colors.white} style={styles.signOutButtonIcon} />}
            />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.l,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.s,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    fontSize: 32,
  },
  content: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  subtitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
    textAlign: "center",
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.s,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    marginBottom: spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: spacing.m,
  },
  buttonTitle: {
    ...typography.button,
    color: colors.white,
  },
  buttonSubtext: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.m,
    opacity: 0.8,
  },
  historySection: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
  },
  historyTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
  },
  historyButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    backgroundColor: colors.white,
    borderRadius: 15,
  },
  historyButton: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    height: 70,
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deleteButton: {
    padding: spacing.s,
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
  },
  historyButtonTitle: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'left',
    flex: 1,
    marginLeft: spacing.m,
    fontSize: 14,
    paddingRight: 40, // Add right padding to prevent text from being covered by delete icon
  },
  historyButtonIcon: {
    marginRight: spacing.m,
  },
  signOutButton: {
    marginHorizontal: spacing.l,
    marginTop: spacing.l,
    marginBottom: spacing.xl,
    borderRadius: 30,
    height: 50,
  },
  signOutButtonTitle: {
    ...typography.button,
    color: colors.white,
  },
  signOutButtonIcon: {
    marginRight: spacing.s,
  },
  noConversationsText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.m,
  },
});