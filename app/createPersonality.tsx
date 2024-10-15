import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../constants/styles';
import { useRouter } from 'expo-router';
import { createPersonality, fetchUserData } from './api/requests';
import { useAuth } from './AuthContext'; // Import the useAuth hook

const CreatePersonality: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();
  const { user, setUserObject } = useAuth(); // Get both user and setUserObject

  const handleCreate = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await createPersonality(user.uid, name, description);
      console.log('Personality created:', response);

      // Fetch updated user data
      const updatedUserData = await fetchUserData(user.uid);
      
      // Update the user object in AuthContext
      setUserObject({
        name: updatedUserData.name,
        personalities: updatedUserData.personalities
      });

      Alert.alert('Success', 'Personality created successfully!');
      router.back();
    } catch (error: any) {
      console.error('Error creating personality:', error);
      Alert.alert('Error', error.message || 'Failed to create personality.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.white} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Create New Personality</Text>
      
      <TextInput
        style={styles.input}
        placeholder="New Personality Name"
        placeholderTextColor={colors.lightGray}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Describe your personality"
        placeholderTextColor={colors.lightGray}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity
        style={[
          styles.createButton,
          (!name || !description || loading) && styles.disabledButton
        ]}
        onPress={handleCreate}
        disabled={!name || !description || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={styles.createButtonText}>Create Personality</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.l,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: spacing.l,
    left: spacing.l,
    zIndex: 1,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginTop: spacing.xl,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  input: {
    ...typography.body,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    alignItems: 'center',
    marginTop: spacing.l,
  },
  disabledButton: {
    opacity: 0.5,
  },
  createButtonText: {
    ...typography.button,
    color: colors.primary,
  },
});

export default CreatePersonality;
