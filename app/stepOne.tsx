// Step 1
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, gradientColors } from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUpload } from './ManageUploadContext';

export default function StepOne() {
  const router = useRouter();
  const { contextUploaded, setContextUploaded, contextMessage, setContextMessage } = useUpload();
  const [message, setMessage] = useState(contextMessage);

  useEffect(() => {
    setContextMessage(message);
  }, [message, setContextMessage]);

  const handleDone = () => {
    if (message.trim() !== '') {
      setContextMessage(message.trim());
      setContextUploaded(true);
      router.push('/stepTwo');
    } else if (contextUploaded) {
      // If a screenshot was uploaded, allow proceeding to next step
      router.push('/stepTwo');
    } else {
      Alert.alert('Input Required', 'Please enter a message or upload a screenshot.');
    }
  };

  const handleUploadScreenshot = () => {
    // Simulate screenshot upload
    setContextUploaded(true);
    Alert.alert('Success', 'Screenshot uploaded successfully!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Button
              icon={<Icon name="arrow-left" type="feather" size={24} color={colors.white} />}
              type="clear"
              onPress={() => router.back()}
              buttonStyle={styles.backButton}
            />
            <Text style={styles.headerTitle}>Upload Context</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.content}>
            <Text style={styles.inputTitle}>Input Message Below</Text>
            <TextInput
              style={[styles.textInput, styles.placeholderStyle]}
              multiline
              placeholder="Paste the message here!..."
              placeholderTextColor={colors.black}
              value={message}
              onChangeText={setMessage}
            />
            <Text style={styles.orText}>Or, upload a screenshot:</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadScreenshot}>
              <Icon name="upload" type="feather" size={24} color={colors.secondary} />
              <Text style={styles.uploadButtonText}>Upload Screenshot</Text>
            </TouchableOpacity>
            {contextUploaded && (
              <Text style={styles.uploadedText}>Context uploaded successfully!</Text>
            )}
          </View>

          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    flexShrink: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.m,
    paddingTop: spacing.l,
  },
  inputTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.s,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    minHeight: 150,
    ...typography.body,
    color: colors.secondary,
    marginBottom: spacing.l,
  },
  placeholderStyle: {
    fontStyle: 'italic',
  },
  orText: {
    ...typography.body,
    color: colors.white,
    marginBottom: spacing.m,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  uploadButtonText: {
    ...typography.button,
    color: colors.secondary,
    marginLeft: spacing.s,
  },
  uploadedText: {
    ...typography.body,
    color: colors.white,
    marginTop: spacing.s,
  },
  bottomContainer: {
    padding: spacing.m,
    paddingBottom: spacing.l,
  },
  doneButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    alignItems: 'center',
  },
  doneButtonText: {
    ...typography.button,
    color: colors.secondary,
  },
});