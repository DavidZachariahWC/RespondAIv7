import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Add this import
import ConversationCard from '../components/conversationCard';
import { colors, typography, spacing, globalStyles, gradientColors } from '../constants/styles';
import { useConversations } from './useConversations'; // Assume this hook manages conversations
import { useAuth } from './AuthContext';
export default function RecentChats() {
  const router = useRouter();
  const { user } = useAuth();

  const { conversations, deleteConversation } = useConversations(user?.uid || null);

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

  const handleBackPress = () => {
    router.back();
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
              <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </TouchableOpacity>
              <Text style={styles.title}>Recent Chats</Text>
            </View>
            <View style={styles.content}>
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
    alignItems: 'center',
    paddingTop: spacing.l,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.s,
  },
  backButton: {
    marginRight: spacing.m,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    fontSize: 24,
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  noConversationsText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.m,
  },
});
