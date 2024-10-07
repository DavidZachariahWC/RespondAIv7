import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, globalStyles, gradientColors } from "../constants/styles";
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { AppRoutes } from '../types/routes';
import { getAuth, signOut } from "firebase/auth";
import { useConversations } from './useConversations';

export default function Home() {
  const router = useRouter();
  const auth = getAuth();
  const { conversations } = useConversations();

  // Use the AppRoutes type when navigating
  const handleNavigation = (route: AppRoutes) => {
    router.push(route as any);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      // Router will automatically redirect to SignIn page due to auth state change
    } catch (error) {
      console.error('Sign out error', error);
      Alert.alert('Sign Out Error', 'An error occurred while signing out. Please try again.');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <LinearGradient
          colors={gradientColors}
          style={globalStyles.gradientBackground}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                <Text style={styles.title}>RespondAI</Text>
                <Button
                  icon={<Ionicons name="settings-outline" size={24} color={colors.white} />}
                  type="clear"
                  onPress={() => router.push("/Settings" as any)}
                />
              </View>
              <View style={styles.content}>
                <Text style={styles.subtitle}>Choose your chat style</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Respond to Message"
                    icon={<Ionicons name="briefcase-outline" size={24} color={colors.white} style={styles.buttonIcon} />}
                    buttonStyle={[styles.button, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                    titleStyle={styles.buttonTitle}
                    onPress={() => router.push("/Context" as any)}
                  />
                  <Text style={styles.buttonSubtext}>Respond to a message</Text>
                  <Button
                    title="Casual"
                    icon={<Ionicons name="chatbubbles-outline" size={24} color={colors.white} style={styles.buttonIcon} />}
                    buttonStyle={[styles.button, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                    titleStyle={styles.buttonTitle}
                    onPress={() => router.push("/CasualChat" as any)}
                  />
                  <Text style={styles.buttonSubtext}>For friends, drama, and fun</Text>
                </View>
              </View>
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>Recent Chats</Text>
                {conversations.length > 0 ? (
                  conversations.map((conversation, index) => (
                    <Button
                      key={conversation.threadId}
                      title={`${conversation.personalityName} - ${conversation.lastMessage}`}
                      buttonStyle={styles.historyButton}
                      titleStyle={styles.historyButtonTitle}
                      icon={<Ionicons name="time-outline" size={24} color={colors.primary} style={styles.historyButtonIcon} />}
                      onPress={() => router.push({ pathname: '/preview', params: { threadId: conversation.threadId } })}
                    />
                  ))
                ) : (
                  <Text style={styles.noConversationsText}>No recent conversations</Text>
                )}
              </View>
              <Button
                title="Sign Out"
                onPress={handleSignOut}
                buttonStyle={styles.signOutButton}
                titleStyle={styles.signOutButtonTitle}
                icon={<Ionicons name="log-out-outline" size={24} color={colors.white} style={styles.signOutButtonIcon} />}
              />
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    paddingBottom: spacing.s,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    fontSize: 32,
  },
  content: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  subtitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
    textAlign: "center",
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.s,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    marginBottom: spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: spacing.m,
  },
  buttonTitle: {
    ...typography.button,
    color: colors.white,
  },
  buttonSubtext: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.m,
    opacity: 0.8,
  },
  historySection: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
  },
  historyTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
  },
  historyButton: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: spacing.m,
    height: 70,
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.m,
  },
  historyButtonTitle: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'left',
  },
  historyButtonIcon: {
    marginRight: spacing.m,
  },
  signOutButton: {
    //backgroundColor: colors.danger,
    marginHorizontal: spacing.l,
    marginTop: spacing.l,
    marginBottom: spacing.xl,
    borderRadius: 30,
    height: 50,
  },
  signOutButtonTitle: {
    ...typography.button,
    color: colors.white,
  },
  signOutButtonIcon: {
    marginRight: spacing.s,
  },
  noConversationsText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.m,
  },
});