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

export default function Home() {
  const router = useRouter();
  const { userObject } = useAuth();
  const { setContextUploaded, setContextMessage } = useUpload(); // Destructure necessary functions
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Define Animated Values for each animatable element
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(20)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;

  const textBoxOpacity = useRef(new Animated.Value(0)).current;
  const textBoxTranslateY = useRef(new Animated.Value(20)).current;

  const generateButtonOpacity = useRef(new Animated.Value(0)).current;
  const generateButtonTranslateY = useRef(new Animated.Value(20)).current;

  const bottomIconsOpacity = useRef(new Animated.Value(0)).current;
  const bottomIconsTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const slowAnimationDuration = 250; // For title and subtitle
    const fastAnimationDuration = 175; // For text box and button

    // Sequence animations: Header -> Subtitle -> TextBox -> GenerateButton -> BottomIcons
    Animated.sequence([
      // Header Animation
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: slowAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: slowAnimationDuration,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle Animation
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: slowAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: slowAnimationDuration,
          useNativeDriver: true,
        }),
      ]),
      // TextBox Animation
      Animated.parallel([
        Animated.timing(textBoxOpacity, {
          toValue: 1,
          duration: fastAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(textBoxTranslateY, {
          toValue: 0,
          duration: fastAnimationDuration,
          useNativeDriver: true,
        }),
      ]),
      // Generate Button Animation
      Animated.parallel([
        Animated.timing(generateButtonOpacity, {
          toValue: 1,
          duration: fastAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(generateButtonTranslateY, {
          toValue: 0,
          duration: fastAnimationDuration,
          useNativeDriver: true,
        }),
      ]),
      // Bottom Icons Animation
      Animated.parallel([
        Animated.timing(bottomIconsOpacity, {
          toValue: 0.4,
          duration: fastAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(bottomIconsTranslateY, {
          toValue: 0,
          duration: fastAnimationDuration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    headerOpacity,
    headerTranslateY,
    subtitleOpacity,
    subtitleTranslateY,
    textBoxOpacity,
    textBoxTranslateY,
    generateButtonOpacity,
    generateButtonTranslateY,
    bottomIconsOpacity,
    bottomIconsTranslateY,
  ]);

  const wordCount = useCallback(() => {
    return message.trim().split(/\s+/).filter(Boolean).length;
  }, [message]);

  const handleGenerateResponse = () => {
    if (message.trim() === "") {
      Alert.alert("Input Required", "Please enter a message to generate a response.");
      return;
    }

    // Start fade-out animation for text and icons
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textBoxOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(generateButtonOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(bottomIconsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Set the context with the entered message
      setContextMessage(message.trim());
      setContextUploaded(true);
      // After animation completes, navigate to StepOne
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
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: headerOpacity,
                  transform: [{ translateY: headerTranslateY }],
                },
              ]}
            >
              <Text style={styles.welcomeText}>
                Welcome, {userObject?.name ? getFirstName(userObject.name) : "User"}.
              </Text>
            </Animated.View>

            {/* Animated View for Subtitle */}
            <Animated.View
              style={[
                styles.subtitleContainer,
                {
                  opacity: subtitleOpacity,
                  transform: [{ translateY: subtitleTranslateY }],
                },
              ]}
            >
              <Text style={styles.subtitle}>
                First, provide the message you received
              </Text>
            </Animated.View>

            {/* Animated View for Text Box */}
            <Animated.View
              style={[
                styles.textBoxContainer,
                {
                  opacity: textBoxOpacity,
                  transform: [{ translateY: textBoxTranslateY }],
                },
              ]}
            >
              <TextInput
                style={[styles.textBox]}
                multiline
                placeholder="Type or paste your message here..."
                value={message}
                onChangeText={setMessage}
              />
              <Text style={styles.wordCount}>{wordCount()}</Text>
            </Animated.View>

            {/* Animated View for Generate Button */}
            <Animated.View
              style={[
                styles.generateButtonContainer,
                {
                  opacity: generateButtonOpacity,
                  transform: [{ translateY: generateButtonTranslateY }],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  message.trim() !== "" ? styles.generateButtonActive : null,
                ]}
                onPress={handleGenerateResponse}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.generateButtonText,
                    message.trim() !== "" ? styles.generateButtonTextActive : null,
                  ]}
                >
                  Generate Response
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>

          {/* Animated View for Bottom Icons */}
          <Animated.View
            style={[
              styles.bottomIcons,
              {
                opacity: bottomIconsOpacity,
                transform: [{ translateY: bottomIconsTranslateY }],
              },
            ]}
          >
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
  textBoxContainer: {
    width: "90%", // Reduced from 100% to 90%
    alignSelf: "center", // Center the container
    marginTop: spacing.s,
    marginBottom: spacing.m,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: "black",
    borderWidth: 1,
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
  generateButtonContainer: {
    width: "100%",
    alignItems: "center",
  },
  generateButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    width: "90%", // Reduced from 100% to 90%
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
  generateButtonActive: {
    backgroundColor: colors.primary,
  },
  generateButtonText: {
    ...typography.button,
    color: colors.primary,
    fontWeight: "bold",
  },
  generateButtonTextActive: {
    color: colors.white,
  },
  bottomIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    // Remove the opacity property from here
    transform: [{ translateY: 20 }], // Initial position for animation
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