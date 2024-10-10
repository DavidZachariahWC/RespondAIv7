import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export interface Conversation {
  threadId: string;
  lastMessage: string;
  timestamp: number;
  personalityName: string;
  userId: string;
  context: string;
}

export const useConversations = (userId: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (userId) {
      loadConversations(userId);
    } else {
      setConversations([]); // Clear conversations in memory when there's no user
    }
  }, [userId]);

  const loadConversations = async (uid: string) => {
    try {
      const userSpecificKey = `conversations_${uid}`;
      const storedConversations = await AsyncStorage.getItem(userSpecificKey);
      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const addConversation = async (newConversation: Conversation) => {
    try {
      const updatedConversations = [newConversation, ...conversations];
      const userSpecificKey = `conversations_${userId}`;
      await AsyncStorage.setItem(userSpecificKey, JSON.stringify(updatedConversations));
      await SecureStore.setItemAsync(`encrypted_${userSpecificKey}`, JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error adding conversation:', error);
    }
  };

  const getConversationByThreadId = useCallback((threadId: string): Conversation | null => {
    return conversations.find(conversation => conversation.threadId === threadId) || null;
  }, [conversations]);

  const updateConversation = async (updatedConversation: Conversation) => {
    try {
      const updatedConversations = conversations.map(conv => 
        conv.threadId === updatedConversation.threadId ? updatedConversation : conv
      );
      const userSpecificKey = `conversations_${userId}`;
      await AsyncStorage.setItem(userSpecificKey, JSON.stringify(updatedConversations));
      await SecureStore.setItemAsync(`encrypted_${userSpecificKey}`, JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  const deleteConversation = async (threadId: string) => {
    try {
      const updatedConversations = conversations.filter(conv => conv.threadId !== threadId);
      const userSpecificKey = `conversations_${userId}`;
      await AsyncStorage.setItem(userSpecificKey, JSON.stringify(updatedConversations));
      await SecureStore.setItemAsync(`encrypted_${userSpecificKey}`, JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return { conversations, addConversation, getConversationByThreadId, updateConversation, deleteConversation };
};

// Remove the logoutUser function
