import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, gradientColors } from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUpload } from './ManageUploadContext';

export default function UploadResponseInfo() {
  const router = useRouter();
  const { infoUploaded, setInfoUploaded, responseInfo, setResponseInfo } = useUpload();
  const [responseInfoText, setResponseInfoText] = useState(responseInfo);

  useEffect(() => {
    setResponseInfo(responseInfoText);
  }, [responseInfoText, setResponseInfo]);

  const handleDone = () => {
    if (responseInfoText.trim() !== '') {
      setResponseInfo(responseInfoText.trim());
      setInfoUploaded(true);
      router.back();
    } else {
      // Show an error or alert that no input was provided
      console.log('Please provide response information');
      // You might want to show a more user-friendly alert here
    }
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
            <Text style={styles.headerTitle}>Upload Response Info</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.inputTitle}>
              Provide information you want included in your response
            </Text>
            <TextInput
              style={[styles.textInput, styles.placeholderStyle]}
              multiline
              placeholder="Provide response info here..."
              placeholderTextColor={colors.black} // Changed to black
              value={responseInfoText}
              onChangeText={setResponseInfoText}
            />
            <View style={styles.exampleBox}>
              <Text style={styles.exampleText}>Ex: im busy reschedule for the next day</Text>
              <Text style={styles.exampleText}>Ex: need more info on lot c</Text>
              <Text style={styles.exampleText}>Ex: 10:15 sep 22</Text>
            </View>
          </ScrollView>

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
  exampleBox: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    marginBottom: spacing.l,
  },
  exampleText: {
    ...typography.body,
    color: colors.black, // Changed from colors.white to colors.black
    marginBottom: spacing.s,
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