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

export default function AccountDetails() {
  const router = useRouter();
  const { userObject, setUserObject, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userObject?.name || "");

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
      // Show error message to the user
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
});