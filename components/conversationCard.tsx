import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../constants/styles";

interface ConversationCardProps {
  threadId: string;
  lastMessage: string;
  onDelete: (threadId: string) => void;
}

export default function ConversationCard({ threadId, lastMessage, onDelete }: ConversationCardProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => router.push({ pathname: '/preview', params: { threadId } })}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="chatbubbles-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.messageText} numberOfLines={2} ellipsizeMode="tail">
            {lastMessage || 'No message available'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(threadId)}
      >
        <Ionicons name="trash-outline" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: spacing.m,
  },
  iconContainer: {
    backgroundColor: colors.lightBackground,
    borderRadius: 12,
    padding: spacing.s,
    marginRight: spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  messageText: {
    ...typography.body,
    color: colors.textDark,
    fontSize: 16,
  },
  deleteButton: {
    padding: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
});