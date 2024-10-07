import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, gradientColors, colors, typography, spacing } from "../constants/styles";
import { Button } from '@rneui/themed';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from './AuthContext';
import { updateUserName } from './api/requests';

export default function AccountDetails() {
  const router = useRouter();
  const { userObject, setUserObject, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userObject?.name || '');

  const handleEditName = () => {
    console.log('Editing name started');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    console.log('Name edit cancelled');
    setNewName(userObject?.name || '');
    setIsEditing(false);
  };

  const handleSaveName = async () => {
    if (!user || !userObject) return;

    try {
      console.log('Attempting to save new name:', newName);
      const updatedUserData = await updateUserName(user.uid, newName);
      setUserObject({
        name: updatedUserData.name,
        personalities: updatedUserData.personalities
      });
      setIsEditing(false);
      console.log('Name updated successfully');
    } catch (error) {
      console.error('Failed to update name:', error);
      // Here you might want to show an error message to the user
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <LinearGradient
          colors={gradientColors}
          style={globalStyles.gradientBackground}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                <Button
                  icon={<Ionicons name="arrow-back" size={24} color={colors.white} />}
                  type="clear"
                  onPress={() => router.push("/Settings" as any)}
                />
                <Text style={styles.title}>Account Details</Text>
                <View style={{ width: 40 }} />
              </View>
              
              <View style={styles.content}>
                <Text style={styles.label}>Name:</Text>
                {isEditing ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.nameInput}
                      value={newName}
                      onChangeText={setNewName}
                      autoFocus
                    />
                    <TouchableOpacity onPress={handleSaveName} style={styles.iconButton}>
                      <Ionicons name="checkmark" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancelEdit} style={styles.iconButton}>
                      <Ionicons name="close" size={24} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={handleEditName} style={styles.nameContainer}>
                    <Text style={styles.name}>{userObject?.name || 'Not available'}</Text>
                    <Ionicons name="create-outline" size={24} color={colors.white} />
                  </TouchableOpacity>
                )}
                <Text style={styles.description}>This is where account information and settings will be displayed.</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.l,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  label: {
    ...typography.body,
    color: colors.white,
    marginBottom: spacing.s,
  },
  name: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
  },
  description: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  nameInput: {
    ...typography.h2,
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    paddingVertical: spacing.m,
    flex: 1,
  },
  iconButton: {
    padding: spacing.s,
  },
});