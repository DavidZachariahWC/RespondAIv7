import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, gradientColors } from '../constants/styles';
import { useAuth } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchPersonalityDescription, updatePersonalityDescription, deletePersonality, fetchUserData } from './api/requests';

const PersonalityDetails = () => {
  const router = useRouter();
  const { personalityName } = useLocalSearchParams();
  const { user, setUserObject } = useAuth();
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    const loadDescription = async () => {
      if (user && personalityName) {
        try {
          const fetchedDescription = await fetchPersonalityDescription(user.uid, personalityName as string);
          setDescription(fetchedDescription);
        } catch (error) {
          console.error('Failed to fetch personality description:', error);
          if (error instanceof Error) {
            if (error.message === 'User not found' || error.message === 'Personality not found') {
              Alert.alert('Error', error.message);
            } else {
              Alert.alert('Error', 'An error occurred while fetching the personality description');
            }
          }
          router.back(); // Navigate back on error
        }
      }
    };

    loadDescription();
  }, [user, personalityName, router]);

  const handleEditDescription = () => {
    setIsEditing(true);
    setEditedDescription(description);
  };

  const handleSaveDescription = async () => {
    if (user && personalityName) {
      try {
        await updatePersonalityDescription(user.uid, personalityName as string, editedDescription);
        setDescription(editedDescription);
        setIsEditing(false);
        Alert.alert('Success', 'Personality description updated successfully');
      } catch (error) {
        console.error('Failed to update personality description:', error);
        Alert.alert('Error', 'An error occurred while updating the personality description');
      }
    }
  };

  const handleDeletePersonality = () => {
    Alert.alert(
      "Delete Personality",
      "Are you sure you want to delete this personality?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    if (user && personalityName) {
      try {
        await deletePersonality(user.uid, personalityName as string);
        
        // Fetch updated user data
        const updatedUserData = await fetchUserData(user.uid);
        setUserObject(updatedUserData);

        Alert.alert("Success", "Personality deleted successfully");
        router.back();
      } catch (error) {
        console.error('Failed to delete personality:', error);
        Alert.alert('Error', 'An error occurred while deleting the personality');
      }
    }
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>{personalityName}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.descriptionTitle}>Description:</Text>
          {isEditing ? (
            <TextInput
              style={styles.descriptionInput}
              value={editedDescription}
              onChangeText={setEditedDescription}
              multiline
            />
          ) : (
            <Text style={styles.descriptionText}>{description}</Text>
          )}
          {isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={handleSaveDescription}>
              <Text style={styles.editButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleEditDescription}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePersonality}>
            <Text style={styles.deleteButtonText}>Delete Personality</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
  },
  backButton: {
    marginRight: spacing.m,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    flex: 1,
  },
  content: {
    padding: spacing.m,
  },
  descriptionTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.s,
  },
  descriptionText: {
    ...typography.body,
    color: colors.white,
  },
  descriptionInput: {
    ...typography.body,
    color: colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.s,
    borderRadius: 5,
    marginBottom: spacing.m,
  },
  editButton: {
    backgroundColor: colors.secondary,
    padding: spacing.s,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    ...typography.body,
    color: colors.white,
  },
  deleteButton: {
    backgroundColor: '#b23b3b',
    padding: spacing.s,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: spacing.m,
  },
  deleteButtonText: {
    ...typography.body,
    color: colors.white,
  },
});

export default PersonalityDetails;
