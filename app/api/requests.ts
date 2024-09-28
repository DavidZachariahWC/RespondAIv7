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