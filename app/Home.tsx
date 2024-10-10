import React, { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, globalStyles, gradientColors } from "../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "./AuthContext";

export default function Home() {
  const router = useRouter();
  const { userObject } = useAuth();
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity value

  const wordCount = useCallback(() => {
    return message.trim().split(/\s+/).filter(Boolean).length;
  }, [message]);

  const handleGenerateResponse = () => {
    // Start fade-out animation for text and icons
    Animated.timing(fadeAnim, {
      toValue: 0, // Fade to opacity 0
      duration: 500, // Duration in milliseconds
      useNativeDriver: true,
    }).start(() => {
      // After animation completes, navigate to StepTwo
      router.push("/stepTwo" as any);
    });
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
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
            {/* Animated View for Header Text */}
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.header}>
                <Text style={styles.welcomeText}>
                  Welcome, {userObject?.name ? getFirstName(userObject.name) : "User"}.
                </Text>
              </View>
            </Animated.View>

            {/* Animated View for Content Text */}
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.content}>
                <Text style={styles.subtitle}>
                  First, provide the message you received
                </Text>
                <View style={styles.textBoxContainer}>
                  <TextInput
                    style={styles.textBox}
                    multiline
                    placeholder="Type or paste your message here..."
                    value={message}
                    onChangeText={setMessage}
                  />
                  <Text style={styles.wordCount}>{wordCount()}</Text>
                </View>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleGenerateResponse}
                  activeOpacity={0.7}
                >
                  <Text style={styles.generateButtonText}>Generate Response</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>

          {/* Animated View for Bottom Icons */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.bottomIcons}>
              <TouchableOpacity onPress={() => router.push("/Settings" as any)}>
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/RecentChats" as any)}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={openModal}>
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

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
                    This is a placeholder for help content.
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "column",
    justifyContent: "center", // Center the welcome header
    alignItems: "center",
    paddingTop: spacing.xl + 50,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m, // Reduced padding to bring subtitle closer
  },
  welcomeText: {
    ...typography.h1,
    color: colors.white,
    fontSize: 36, // Increased font size for the welcome message
    textAlign: "center",
    marginBottom: spacing.s, // Space below the welcome message
  },
  content: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: spacing.l,
    // Removed increased padding to position content appropriately
  },
  subtitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
    textAlign: "center",
    fontWeight: "normal", // Make subtitle not bold
    paddingBottom: spacing.xl + 20,
  },
  textBoxContainer: {
    width: "100%",
    marginTop: spacing.s,
    marginBottom: spacing.m,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6, // Increased shadowOffset for more 3D effect
    },
    shadowOpacity: 0.4, // Increased shadowOpacity for stronger shadow
    shadowRadius: 6, // Increased shadow radius for more spread
    elevation: 12, // Increased elevation for enhanced 3D effect
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: "black", // Add thin black outline
    borderWidth: 1, // Add thin black outline
  },
  textBox: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    minHeight: 100,
    maxHeight: 200,
    ...typography.body,
    color: colors.textDark,
  },
  wordCount: {
    position: "absolute",
    bottom: 5,
    right: 10,
    ...typography.caption,
    color: colors.textLight,
  },
  generateButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10, // Increased shadowOffset for deeper shadow
    },
    shadowOpacity: 0.6, // Increased shadowOpacity for stronger shadow
    shadowRadius: 10, // Increased shadowRadius for more spread
    elevation: 20, // Further increased elevation for enhanced 3D effect
    borderColor: "black", // Add thin black outline
    borderWidth: 1, // Add thin black outline
    transform: [{ translateY: 2 }], // Slight downward translation to mimic depth
  },
  generateButtonText: {
    ...typography.button,
    color: colors.primary,
    fontWeight: "bold",
  },
  bottomIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    opacity: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white overlay
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