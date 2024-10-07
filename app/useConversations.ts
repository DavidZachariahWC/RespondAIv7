import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Conversation {
  threadId: string;
  lastMessage: string;
  timestamp: number;
  personalityName: string;
  userId: string;
  context: string;
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

  const updateConversation = async (updatedConversation: Conversation) => {
    try {
      const updatedConversations = conversations.map(conv => 
        conv.threadId === updatedConversation.threadId ? updatedConversation : conv
      );
      await AsyncStorage.setItem('conversations', JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  const deleteConversation = async (threadId: string) => {
    try {
      const updatedConversations = conversations.filter(conv => conv.threadId !== threadId);
      await AsyncStorage.setItem('conversations', JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return { conversations, addConversation, getConversationByThreadId, updateConversation, deleteConversation };
};
