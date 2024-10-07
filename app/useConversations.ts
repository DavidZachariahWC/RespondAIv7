import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Conversation {
  threadId: string;
  lastMessage: string;
  timestamp: number;
  personalityName: string;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const storedConversations = await AsyncStorage.getItem('conversations');
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
      await AsyncStorage.setItem('conversations', JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error adding conversation:', error);
    }
  };

  const getConversationByThreadId = useCallback((threadId: string): Conversation | null => {
    return conversations.find(conversation => conversation.threadId === threadId) || null;
  }, [conversations]);

  return { conversations, addConversation, getConversationByThreadId };
};
