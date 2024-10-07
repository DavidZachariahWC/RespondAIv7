import axios from 'axios';

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
      personalityKey
    });
    console.log('Message sent successfully');
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};