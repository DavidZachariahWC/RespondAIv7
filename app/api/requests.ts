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