import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  globalStyles,
  gradientColors,
  colors,
  typography,
  spacing,
} from "../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthContext";
import { updateUserName } from "./api/requests";
import {
  getAuth,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function AccountDetails() {
  const router = useRouter();
  const { userObject, setUserObject, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userObject?.name || "");
  const auth = getAuth();

  // State for Password Modal
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");

  const handleEditName = () => {
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    if (!user || !userObject) return;

    try {
      const updatedUserData = await updateUserName(user.uid, newName);
      setUserObject({
        name: updatedUserData.name,
        personalities: updatedUserData.personalities,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update name:", error);
      Alert.alert("Update Error", "Failed to update name. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      // Router will automatically redirect to SignIn page due to auth state change
    } catch (error) {
      console.error("Sign out error", error);
      Alert.alert("Sign Out Error", "An error occurred while signing out. Please try again.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => setIsPasswordModalVisible(true) },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;

    const email = user.email;

    if (!email) {
      Alert.alert("Error", "User email not found.");
      return;
    }

    try {
      // Reauthenticate and delete user
      await reauthenticateAndDeleteUser(email, password);
      setIsPasswordModalVisible(false);
    } catch (error) {
      console.error("Failed to reauthenticate and delete account:", error);
      Alert.alert("Error", "Failed to delete account. Please check your credentials and try again.");
    }
  };

  const reauthenticateAndDeleteUser = async (email: string, password: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(email, password);

      try {
        // Reauthenticate the user
        await reauthenticateWithCredential(user, credential);
        console.log("Reauthentication successful.");

        // Simulate a delay between 0.5 and 2 seconds
        const delay = Math.random() * 1500 + 500; // Random delay between 500ms and 2000ms
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Delete the user
        await deleteUser(user);
        console.log("User deleted successfully.");

        // Show success message
        Alert.alert("Account Deleted", "Your account has been successfully deleted.");

        // Sign out
        await handleSignOut();
      } catch (error) {
        console.error("Error during reauthentication or deletion:", error);
        Alert.alert("Error", "Failed to delete account. Please ensure your credentials are correct and try again.");
      }
    } else {
      console.log("No authenticated user found.");
      Alert.alert("Error", "No authenticated user found.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <LinearGradient
          colors={gradientColors}
          style={globalStyles.gradientBackground}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.push("/Settings")}
                  style={styles.iconButton}
                >
                  <Ionicons name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Account Details</Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Name Box at the Top */}
              <View style={styles.content}>
                <TouchableOpacity
                  style={styles.nameButton}
                  onPress={isEditing ? undefined : handleEditName}
                  activeOpacity={isEditing ? 1 : 0.7}
                >
                  {isEditing ? (
                    <>
                      <TextInput
                        style={[styles.nameInput, styles.nameInputEditing]}
                        value={newName}
                        onChangeText={setNewName}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.primary}
                        underlineColorAndroid="transparent"
                        autoFocus
                      />
                      <TouchableOpacity
                        onPress={handleSaveName}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name="checkmark-outline"
                          size={24}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.name}>
                        {userObject?.name || "Not available"}
                      </Text>
                      <Ionicons
                        name="create-outline"
                        size={24}
                        color={colors.primary}
                        style={styles.editIcon}
                      />
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Delete Account Button */}
              <TouchableOpacity
                style={styles.deleteAccountButton}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>

        {/* Password Reauthentication Modal */}
        <Modal
          visible={isPasswordModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsPasswordModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Your Password</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter your password"
                placeholderTextColor={colors.primary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsPasswordModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={confirmDeleteAccount}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.l,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  nameButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 15,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    width: "100%",
    marginBottom: spacing.m,
  },
  name: {
    ...typography.h2,
    color: colors.primary,
    flex: 1,
  },
  nameInput: {
    ...typography.h2,
    color: colors.primary,
    flex: 1,
  },
  nameInputEditing: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  iconButton: {
    padding: spacing.s,
  },
  editIcon: {
    marginLeft: spacing.m,
  },
  deleteAccountButton: {
    backgroundColor: '#b23b3b',
    borderRadius: 15,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
    marginTop: spacing.xl,
    width: '95%',
    alignSelf: 'center',
  },
  deleteAccountButtonText: {
    ...typography.button,
    color: colors.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.m,
    color: colors.primary,
  },
  modalTextInput: {
    width: '100%',
    padding: spacing.s,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    marginBottom: spacing.m,
    color: colors.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: spacing.s,
    marginHorizontal: spacing.s,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  deleteButton: {
    backgroundColor: '#b23b3b',
  },
  modalButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
