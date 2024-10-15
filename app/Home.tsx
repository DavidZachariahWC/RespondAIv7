import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  typography,
  spacing,
  globalStyles,
  gradientColors,
} from "../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "./AuthContext";
import { useUpload } from "./ManageUploadContext"; // Import the context hook
import TextBox from "../components/TextBox"; // Import the new TextBox component
//import { FadeTransition } from '../components/FadeTransition';

export default function Home() {
  const router = useRouter();
  const { userObject } = useAuth();
  const { setContextUploaded, setContextMessage } = useUpload(); // Destructure necessary functions
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Animated Values
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const bottomIconsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const titleDuration = 500; // Title animation duration
    const otherElementsDuration = 333; // Duration for subtitle, content, and icons
    const delay = 100; // Short delay between title and other elements

    Animated.sequence([
      // Title Animation
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: titleDuration,
        useNativeDriver: true,
      }),
      // Subtitle, Content, and Bottom Icons Animations in Parallel
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: otherElementsDuration,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: otherElementsDuration,
          useNativeDriver: true,
        }),
        Animated.timing(bottomIconsOpacity, {
          toValue: 0.4,
          duration: otherElementsDuration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [titleOpacity, subtitleOpacity, contentOpacity, bottomIconsOpacity]);

  const wordCount = useCallback(() => {
    return message.trim().split(/\s+/).filter(Boolean).length;
  }, [message]);

  const handleGenerateResponse = () => {
    if (message.trim() === "") {
      Alert.alert("Input Required", "Please enter a message to generate a response.");
      return;
    }

    // Start fade-out animation for text and icons
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Set the context with the entered message
      setContextMessage(message.trim());
      setContextUploaded(true);
      // After animation completes, navigate to StepTwo
      router.push("/stepTwo");
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
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={gradientColors} style={globalStyles.gradientBackground}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Animated View for Header Text */}
            <Animated.View style={[styles.header, { opacity: titleOpacity }]}>
              <Text style={styles.welcomeText}>
                Welcome, {userObject?.name ? getFirstName(userObject.name) : "User"}.
              </Text>
            </Animated.View>

            {/* Animated View for Subtitle */}
            <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
              <Text style={styles.subtitle}>
                First, provide the message you received
              </Text>
            </Animated.View>

            {/* Animated View for the rest of the content */}
            <Animated.View style={{ opacity: contentOpacity }}>
              <TextBox
                value={message}
                onChangeText={setMessage}
                placeholder="Type or paste the message here..."
                wordCount={wordCount()}
              />

              <View style={styles.generateButtonContainer}>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleGenerateResponse}
                  activeOpacity={0.7}
                >
                  <Text style={styles.generateButtonText}>
                    Generate Response
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>

          {/* Animated View for Bottom Icons */}
          <Animated.View style={[styles.bottomIcons, { opacity: bottomIconsOpacity }]}>
            <TouchableOpacity onPress={() => router.push("/Settings")}>
              <Ionicons name="settings-outline" size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/RecentChats")}>
              <Ionicons name="chatbubbles-outline" size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openModal}>
              <Ionicons name="help-circle-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </Animated.View>

          {/* Help Modal */}
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
                    {"In this step, please enter the message you've received and need assistance responding to.\n\nThis could be an email, text message, or any form of communication that you're unsure how to reply to.\n\nExamples:\n\nHey, are you available to join the project meeting tomorrow at 10 AM?\n\nCan you cover my shift this weekend?"}
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
    paddingTop: 0,
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
  subtitleContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    alignItems: "center",
  },
  subtitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
    textAlign: "center",
    fontWeight: "normal", // Make subtitle not bold
    paddingBottom: spacing.xl + 20,
    paddingTop: spacing.m,
  },
  generateButtonContainer: {
    width: "100%",
    alignItems: "center",
  },
  generateButton: {
    backgroundColor: colors.white, // Changed to white
    borderRadius: 10,
    padding: spacing.m,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 20,
    borderColor: "black",
    borderWidth: 1,
    transform: [{ translateY: 2 }],
  },
  generateButtonText: {
    ...typography.button,
    color: colors.primary, // Changed to primary color for contrast
    fontWeight: "bold",
  },
  bottomIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    marginBottom: spacing.m - 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
