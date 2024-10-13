import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { colors, typography, spacing, globalStyles, gradientColors } from "../constants/styles";
import { Button, Card } from '@rneui/themed';
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signOut } from 'firebase/auth';

export default function Settings() {
  const router = useRouter();
  const auth = getAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
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
                <Text style={styles.title}>Settings</Text>
                <Button
                  icon={<Ionicons name="close-outline" size={24} color={colors.white} />}
                  type="clear"
                  onPress={() => router.push("/Home")}
                />
              </View>

              <Button
                title="Account Details"
                icon={<Ionicons name="person-outline" size={24} color={colors.primary} style={styles.buttonIcon} />}
                buttonStyle={styles.accountButton}
                titleStyle={styles.accountButtonText}
                onPress={() => router.push("/AccountDetails")}
              />

              <Button
                title="View Personalities"
                icon={<Ionicons name="people-outline" size={24} color={colors.primary} style={styles.buttonIcon} />}
                buttonStyle={styles.accountButton}
                titleStyle={styles.accountButtonText}
                onPress={() => router.push("/viewPersonalities")}
              />

              {/* Contact Us Button */}
              <Button
                title="Contact Us"
                icon={<Ionicons name="mail-outline" size={24} color={colors.primary} style={styles.buttonIcon} />}
                buttonStyle={styles.accountButton}
                titleStyle={styles.accountButtonText}
                onPress={openModal}
              />

              <Button
                title="Sign Out"
                icon={<Ionicons name="log-out-outline" size={24} color={colors.white} style={styles.buttonIcon} />}
                buttonStyle={[styles.accountButton, styles.signOutButton]}
                titleStyle={[styles.accountButtonText, styles.signOutButtonText]}
                onPress={handleSignOut}
              />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>

        {/* Modal for Contact Us */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Support: respond@westcoastseller.com
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    paddingBottom: spacing.l,
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
  },
  accountButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    marginHorizontal: spacing.m,
    marginBottom: spacing.m,
    paddingVertical: spacing.m,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  accountButtonText: {
    ...typography.h2,
    color: colors.primary,
    marginLeft: spacing.s,
  },
  buttonIcon: {
    marginRight: spacing.s,
  },
  signOutButton: {
    backgroundColor: '#b23b3b',
  },
  signOutButtonText: {
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.l,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    ...typography.body,
    color: colors.textDark,
    textAlign: "center",
  },
});