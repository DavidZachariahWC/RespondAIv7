// stepTwo.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
} from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUpload } from './ManageUploadContext';
import TextBox from '../components/TextBox';
import { Ionicons } from '@expo/vector-icons';

export default function StepTwo() {
  const router = useRouter();
  const { infoUploaded, setInfoUploaded, responseInfo, setResponseInfo } = useUpload();
  const [responseInfoText, setResponseInfoText] = useState(responseInfo);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setResponseInfo(responseInfoText);
  }, [responseInfoText, setResponseInfo]);

  const handleDone = useCallback(() => {
    if (responseInfoText.trim() !== '') {
      setResponseInfo(responseInfoText.trim());
      setInfoUploaded(true);
      router.push('/stepThree');
    } else {
      Alert.alert('Input Required', 'Please provide response information.');
    }
  }, [responseInfoText, setResponseInfo, setInfoUploaded, router]);

  const wordCount = useCallback(() => {
    return responseInfoText.trim().split(/\s+/).filter(Boolean).length;
  }, [responseInfoText]);

  const openModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

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
                onPress={() => router.push('/stepOne')}
                style={styles.headerButton}
                accessibilityLabel="Go back to step one"
              >
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Step Two</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.subtitle}>
                Provide the core information you want conveyed. Respondify will do the rest.
              </Text>

              <View style={styles.content}>
                <TextBox
                  value={responseInfoText}
                  onChangeText={setResponseInfoText}
                  placeholder="Provide response info here..."
                  wordCount={wordCount()}
                />
                <TouchableOpacity style={styles.helpContainer} onPress={openModal}>
                  <Ionicons name="help-circle-outline" size={20} color={colors.white} />
                  <Text style={styles.helpText}>What do I do?</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Complete Step Two Button */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleDone}
                activeOpacity={0.8}
              >
                <Text style={styles.doneButtonText}>Complete Step Two</Text>
                <Ionicons name="arrow-forward" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Modal */}
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
                    {"In this step, tell us what you want to convey in your reply.\n\nShare your thoughts, feelings, and any specific points you want to include.\n\nExamples:\n\nAccept meeting but ask for 11am.\n\nI can't make it and need to make up an excuse."}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (styles are similar to stepOne.tsx, adjusted where necessary)
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
});