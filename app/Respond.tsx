// redundant and can probably be deleted
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors, typography, spacing, gradientColors } from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';
// Updated personality type to include an id
type Personality = {
  id: number;
  name: string;
};

const personalities: Personality[] = [
  { id: 1, name: 'Professional' },
  { id: 2, name: 'Casual' },
  { id: 3, name: 'Friendly' },
  { id: 4, name: 'Formal' },
  { id: 5, name: 'Humorous' },
  { id: 6, name: 'Empathetic' },
  { id: 7, name: 'Assertive' },
  { id: 8, name: 'Diplomatic' },
];

// Updated PersonalityButton to accept onPress prop
const PersonalityButton = React.memo(({ name, onPress }: { name: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.personalityButton} onPress={onPress} accessibilityLabel={`Select ${name} personality`}>
    <Text style={styles.personalityButtonText}>{name}</Text>
  </TouchableOpacity>
));

export default function Respond() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [listHeight, setListHeight] = useState(0);
  const { userObject } = useAuth();

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const personalitiesArray = userObject?.personalities ? Object.values(userObject.personalities).map(p => p.personality) : [];
  const indicatorSize = listHeight / (personalitiesArray.length || 1);
  const indicatorTranslate = scrollY.interpolate({
    inputRange: [0, listHeight],
    outputRange: [0, listHeight - indicatorSize],
    extrapolate: 'clamp',
  });

  // Navigation function to Context screen
  const navigateToContext = useCallback((personality: string) => {
    try {
      router.push({
        pathname: "/Context", 
        params: { personalityName: personality }
      });
    } catch (error) {
      console.error("Navigation error:", error);
      // Here you could also show an error message to the user
    }
  }, [router]);

  // Render item function for FlatList
  const renderPersonalityButton = useCallback(({ item }: { item: string }) => (
    <PersonalityButton 
      name={item} 
      onPress={() => navigateToContext(item)} 
    />
  ), [navigateToContext]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Button
                icon={<Icon name="arrow-left" type="feather" size={24} color={colors.white} />}
                type="clear"
                onPress={() => router.back()}
                buttonStyle={styles.backButton}
              />
              <Text style={styles.headerTitle}>Respond to Message</Text>
              <View style={{ width: 40 }} />
            </View>
            <View style={styles.headerSeparator} />

            <Text style={styles.title}>Select Personality</Text>

            <View style={styles.listContainer} onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}>
              {personalitiesArray.length > 0 ? (
                <FlatList
                  data={personalitiesArray}
                  renderItem={renderPersonalityButton}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
              ) : (
                <Text style={globalStyles.emptyMessage}>
                  There are no personalities associated with your profile. Create one below!
                </Text>
              )}
              <View style={styles.customScrollbarContainer}>
                <Animated.View 
                  style={[
                    styles.customScrollbarIndicator, 
                    { 
                      height: indicatorSize,
                      transform: [{ translateY: indicatorTranslate }]
                    }
                  ]} 
                />
              </View>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <Button
              title="Add More Personalities"
              buttonStyle={styles.addMoreButton}
              titleStyle={styles.addMoreButtonText}
            />
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar} />
            </View>
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
  contentContainer: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s + 5, 
    paddingBottom: spacing.s + 20,
    marginLeft: spacing.s - 20, 
  },
  backButton: {
    padding: 0, 
    marginLeft: -spacing.s, 
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    flexShrink: 1,
    marginLeft: -spacing.l, 
  },
  // New style for the header separator
  headerSeparator: {
    height: 1, // Very thin line
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
    marginHorizontal: spacing.m, // Match header padding
    marginBottom: spacing.s, // Add some space below the separator
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.m,
  },
  listContainer: {
    flex: 1, // Allow the list to fill available space
    marginHorizontal: spacing.m,
  },
  personalityButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  personalityButtonText: {
    ...typography.body,
    color: colors.white,
  },
  customScrollbarContainer: {
    position: 'absolute',
    right: 2,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  customScrollbarIndicator: {
    width: 3,
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  bottomContainer: {
    padding: spacing.m,
    paddingBottom: spacing.l, // Extra padding at the bottom
  },
  addMoreButton: {
    backgroundColor: colors.white, // Changed to white
    borderRadius: 10,
    marginBottom: spacing.m,
  },
  addMoreButtonText: {
    color: colors.secondary, // Changed to black for contrast
    ...typography.button, // Ensure consistent typography
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
  },
  progressBar: {
    width: '20%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
});