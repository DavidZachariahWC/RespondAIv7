// stepOne.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  colors,
  typography,
  spacing,
  gradientColors,
  globalStyles,
} from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUpload } from './ManageUploadContext';
import TextBox from '../components/TextBox';
import { Ionicons } from '@expo/vector-icons';

export default function StepOne() {
  const router = useRouter();
  const { setContextUploaded, contextMessage, setContextMessage } = useUpload();
  const [message, setMessage] = useState(contextMessage);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setContextMessage(message);
  }, [message, setContextMessage]);

  const handleDone = () => {
    if (message.trim() !== '') {
      setContextMessage(message.trim());
      setContextUploaded(true);
      router.push('/stepTwo');
    } else {
      Alert.alert('Input Required', 'Please enter a message to proceed.');
    }
  };

  const wordCount = () => {
    return message.trim().split(/\s+/).filter(Boolean).length;
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.push('/Home')}
                style={styles.headerButton}
                accessibilityLabel="Go back home"
              >
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Step One</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.subtitle}>
                Provide the message that you need to create a response for.
              </Text>

              <View style={styles.content}>
                <TextBox
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Type or paste your message here..."
                  wordCount={wordCount()}
                />
                <TouchableOpacity style={styles.helpContainer} onPress={openModal}>
                  <Ionicons name="help-circle-outline" size={20} color={colors.white} />
                  <Text style={styles.helpText}>What do I do?</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Complete Step One Button */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleDone}
                activeOpacity={0.7}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.doneButtonText}>Complete Step One</Text>
                  <Ionicons name="arrow-forward" size={24} color={colors.white} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Modal */}
            {isModalVisible ? (
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
                        This is where you provide the message you received that you need help responding to.
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            ) : null}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
    backgroundColor: 'transparent',
  },
  headerButton: {
    padding: spacing.s,
  },
  headerTitle: {
    ...typography.h2Bold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.l,
    alignItems: 'center',
  },
  subtitle: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s,
    opacity: 0.8,
  },
  helpText: {
    color: colors.white,
    marginLeft: spacing.xs,
  },
  bottomContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.l,
    backgroundColor: 'transparent',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    justifyContent: 'center',
  },
  doneButtonText: {
    ...typography.button,
    color: colors.white,
    marginRight: spacing.s,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: spacing.l,
    marginHorizontal: spacing.l,
    alignItems: 'center',
  },
  modalText: {
    ...typography.body,
    color: colors.textDark,
    textAlign: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});