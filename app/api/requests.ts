import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation } from '../useConversations';
import * as SecureStore from 'expo-secure-store';

export const sendUserData = async (name: string, userId: string): Promise<any> => {
    try {
        const response = await axios.post('http://localhost:3000/users', {
          name,
          userId
        });
        return response.data;
      } catch (error) {
        console.error('Error sending user data:', error);
        throw new Error('Failed to send user data. Please try again.');
      }
};

export const fetchUserData = async (userId: string): Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`);
        console.log('User data successfully fetched');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data (requests.ts):', error);
        throw new Error('Failed to fetch user data. Please try again (requests.ts).');
    }
};

export const updateUserName = async (userId: string, newName: string): Promise<any> => {
    try {
        const response = await axios.put(`http://localhost:3000/users/${userId}`, { name: newName });
        console.log('User name updated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating user name (requests.ts):', error);
        throw new Error('Failed to update user name. Please try again.');
    }
};

export const sendContextData = async (contextData: {
  personality: string | null;
  message: string;
  responseInfo: string;
  name: string;
  userId: string;
}): Promise<any> => {
  try {
    const response = await axios.post('http://localhost:3000/context', contextData);
    console.log('Context data sent successfully');
    return response.data;
  } catch (error) {
    console.error('Error sending context data:', error);
    throw new Error('Failed to send context data. Please try again.');
  }
};

export const sendMessage = async (
  userId: string,
  userMessage: string,
  context: string,
  personalityKey: string
): Promise<{ assistantResponse: string; threadId: string }> => {
  try {
    const response = await axios.post('http://localhost:3000/sendMessage', {
      userId,
      userMessage,
      context,
      personalityKey // No encoding here
    });
    console.log('Message sent successfully');
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};

// New function to create and log the local object
export const createAndLogResponseObject = async (
  threadId: string,
  assistantResponse: string,
  userId: string,
  responseInfo: string,
  contextMessage: string,
  personalityName: string
) => {
  const responseObject = {
    threadId,
    assistantResponse,
    userId,
    responseInfo,
    message: contextMessage
  };
  console.log('Local response object:', responseObject);

  // Save conversation to AsyncStorage
  try {
    const newConversation: Conversation = {
      threadId,
      lastMessage: assistantResponse.substring(0, 50) + '...', // Truncate for preview
      timestamp: Date.now(),
      personalityName,
      userId,
      context: contextMessage // Using contextMessage as the context
    };
    const userSpecificKey = `conversations_${userId}`;
    const storedConversations = await AsyncStorage.getItem(userSpecificKey);
    let conversations: Conversation[] = storedConversations ? JSON.parse(storedConversations) : [];
    conversations = [newConversation, ...conversations];
    await AsyncStorage.setItem(userSpecificKey, JSON.stringify(conversations));

    // Remove this line to avoid using SecureStore for large data
    // await SecureStore.setItemAsync(`encrypted_${userSpecificKey}`, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversation:', error);
  }

  return responseObject;
};

export const continueThread = async (
  userId: string,
  userMessage: string,
  context: string,
  personalityKey: string,
  threadId: string
): Promise<{ assistantResponse: string; threadId: string }> => {
  try {
    const response = await axios.post('http://localhost:3000/continueThread', {
      userId,
      userMessage,
      context,
      personalityKey, // No encoding here
      threadId
    });
    console.log('Thread continued successfully');
    return response.data;
  } catch (error) {
    console.error('Error continuing thread:', error);
    throw new Error('Failed to continue thread. Please try again.');
  }
};

// Add this new function to the existing requests.ts file

export const fetchPersonalityDescription = async (userId: string, personalityName: string): Promise<string> => {
  try {
    const response = await axios.get(`http://localhost:3000/users/${userId}/personalities/${encodeURIComponent(personalityName)}`);
    console.log('Personality description fetched successfully');
    return response.data.description;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        if (error.response.data.error === "User not found") {
          throw new Error('User not found');
        } else if (error.response.data.error === "Personality not found") {
          throw new Error('Personality not found');
        }
      }
    }
    console.error('Error fetching personality description:', error);
    throw new Error('An error occurred while fetching the personality description');
  }
};

export const updatePersonalityDescription = async (userId: string, personalityKey: string, newDescription: string): Promise<void> => {
  try {
    const response = await axios.put(
      `http://localhost:3000/users/${userId}/personalities/${encodeURIComponent(personalityKey)}`,
      { newDescription }
    );
    console.log('Personality description updated successfully');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        if (error.response.data.error === "User not found") {
          throw new Error('User not found');
        } else if (error.response.data.error === "Personality not found") {
          throw new Error('Personality not found');
        }
      } else if (error.response?.status === 400) {
        throw new Error('New description is required');
      }
    }
    console.error('Error updating personality description:', error);
    throw new Error('An error occurred while updating the personality description');
  }
};

export const createPersonality = async (
  userId: string,
  newPersonalityName: string,
  newPersonalityDescription: string
): Promise<any> => {
  try {
    const response = await axios.post(`http://localhost:3000/users/${userId}/personalities`, {
      newPersonalityName,
      newPersonalityDescription,
    });

    if (response.status === 201) {
      console.log('New personality added successfully:', response.data.message);
      return response.data;
    } else {
      console.error('Unexpected response status:', response.status);
      throw new Error('Unexpected response from the server.');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          throw new Error('Personality name and description are required.');
        } else if (status === 404) {
          throw new Error('User not found.');
        } else if (status === 500) {
          throw new Error('Internal server error. Please try again later.');
        } else {
          throw new Error(`Unexpected error: ${data.error || 'Unknown error.'}`);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your network connection.');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Failed to create personality. Please try again.');
      }
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const deletePersonality = async (userId: string, personalityName: string): Promise<void> => {
  try {
    const response = await axios.delete(`http://localhost:3000/users/${userId}/personalities/${encodeURIComponent(personalityName)}`);
    console.log('Personality deleted successfully');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        if (error.response.data.error === "User not found") {
          throw new Error('User not found');
        } else if (error.response.data.error === "Personality not found") {
          throw new Error('Personality not found');
        }
      }
    }
    console.error('Error deleting personality:', error);
    throw new Error('An error occurred while deleting the personality');
  }
};
