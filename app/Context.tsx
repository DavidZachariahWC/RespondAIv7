import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUpload } from './ManageUploadContext';
import { colors, typography, spacing, gradientColors } from '../constants/styles';
import MainButtonsContainer from '../components/MainButtonsContainer';

export default function Context() {
  const { personalityName: initialPersonalityName } = useLocalSearchParams();
  const [personalityName, setPersonalityName] = useState<string | null>(initialPersonalityName as string | null);
  const router = useRouter();
  const { contextUploaded, infoUploaded, setContextUploaded, setInfoUploaded } = useUpload();

  const handleContextPress = useCallback(() => {
    if (!contextUploaded) {
      router.push("/UploadContext" as any);
    } else {
      setContextUploaded(false);
    }
  }, [router, contextUploaded, setContextUploaded]);

  const handleInfoPress = useCallback(() => {
    if (!infoUploaded) {
      router.push("/UploadResponseInfo" as any);
    } else {
      setInfoUploaded(false);
    }
  }, [router, infoUploaded, setInfoUploaded]);

  const handlePersonalityChange = useCallback(() => {
    if (personalityName) {
      setPersonalityName(null);
    } else {
      router.push("/Respond" as any);
    }
  }, [router, personalityName]);

  const handleEditPersonality = useCallback(() => {
    router.push("/Respond" as any);
  }, [router]);

  const handleEditContext = useCallback(() => {
    router.push("/UploadContext" as any);
  }, [router]);

  const handleEditInfo = useCallback(() => {
    router.push("/UploadResponseInfo" as any);
  }, [router]);

  const progress = React.useMemo(() => {
    return (personalityName ? 33.33 : 0) + (contextUploaded ? 33.33 : 0) + (infoUploaded ? 33.33 : 0);
  }, [personalityName, contextUploaded, infoUploaded]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Button
              icon={<Icon name="arrow-left" type="feather" size={24} color={colors.white} />}
              type="clear"
              onPress={() => router.push("/Home")}
              buttonStyle={styles.backButton}
            />
            <Text style={styles.headerTitle}>Provide Context</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.content}>
            <MainButtonsContainer
              contextUploaded={contextUploaded}
              infoUploaded={infoUploaded}
              personalityName={personalityName}
              onContextPress={handleContextPress}
              onInfoPress={handleInfoPress}
              onPersonalityChange={handlePersonalityChange}
              onEditPersonality={handleEditPersonality}
              onEditContext={handleEditContext}
              onEditInfo={handleEditInfo}
            />
          </View>

          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={[styles.doneButton, progress === 100 && styles.doneButtonActive]} 
              onPress={() => console.log('Done')}
              disabled={progress !== 100}
            >
              <Text style={[styles.doneButtonText, progress === 100 && styles.doneButtonTextActive]}>
                {progress === 100 ? 'Finish' : 'Generate'}
              </Text>
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{`${Math.round(progress)}% Complete`}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  doneButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  doneButtonActive: {
    backgroundColor: '#4CAF50',
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9E9E9E',
  },
  doneButtonTextActive: {
    color: '#ffffff',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});