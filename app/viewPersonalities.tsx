import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, gradientColors } from '../constants/styles';
import { useAuth } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';
import PersonalityList from '../components/personalityList';
import { fetchUserData } from './api/requests';

const ViewPersonalities = () => {
  const router = useRouter();
  const { userObject, setUserObject, user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      const refreshUserData = async () => {
        if (user) {
          try {
            const updatedUserData = await fetchUserData(user.uid);
            setUserObject(updatedUserData);
          } catch (error) {
            console.error('Failed to refresh user data:', error);
          }
        }
      };

      refreshUserData();
    }, [user, setUserObject])
  );

  const personalities = userObject?.personalities 
    ? Object.keys(userObject.personalities) 
    : [];

  const handleSelectPersonality = (personality: string) => {
    router.push({
      pathname: '/personalityDetails',
      params: { personalityName: personality }
    });
  };

  const handleEditPersonality = (personality: string) => {
    router.push({
      pathname: '/personalityDetails',
      params: { personalityName: personality }
    });
  };

  const handleCreatePersonality = () => {
    router.push("/createPersonality");
    console.log('Create new personality');
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Your Personalities</Text>
        </View>
        <View style={styles.listContainer}>
          <PersonalityList
            personalities={personalities}
            onSelectPersonality={handleSelectPersonality}
            onEditPersonality={handleEditPersonality}
            onCreatePersonality={handleCreatePersonality}
          />
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
  listContainer: {
    flex: 1,
  },
  backButton: {
    marginRight: spacing.m,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    flex: 1,
  },
  personalityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.m,
    marginHorizontal: spacing.m,
    marginBottom: spacing.s,
    borderRadius: 10,
  },
  personalityName: {
    ...typography.h3,
    color: colors.white,
  },
  createPersonalityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.m,
    marginHorizontal: spacing.m,
    marginTop: spacing.m,
    borderRadius: 10,
  },
  createPersonalityText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.s,
  },
});

export default ViewPersonalities;
