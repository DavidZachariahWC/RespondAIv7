import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text, StatusBar, Platform, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import PageIndicator from './PageIndicator';
import { colors, typography, spacing, globalStyles, gradientColors } from "../constants/styles";

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const SLIDES = [
  { id: '1', type: 'welcome', title: 'Welcome to RespondAI', description: 'Swipe right to learn more about your new AI assistant' },
  { id: '2', type: 'regular', title: 'Professional Chat', description: 'Get help with work-related tasks and boost your productivity' },
  { id: '3', type: 'regular', title: 'Casual Chat', description: 'Chat about anything, anytime, and expand your knowledge' },
  { id: '4', type: 'regular', title: 'Personalized Experience', description: 'Tailored responses based on your preferences and history' },
  { id: '5', type: 'regular', title: 'Privacy First', description: 'Your data is secure and your conversations are private' },
  { id: '6', type: 'signup', title: 'Get Started', description: 'Sign up now to begin your AI-assisted journey!' },
];

const IntroSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const renderWelcomeSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.welcomeSlide}>
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>{item.title}</Text>
        <Text style={styles.welcomeDescription}>{item.description}</Text>
        <Icon
          name="chevron-forward-outline"
          type="ionicon"
          color={colors.white}
          size={40}
          containerStyle={styles.swipeIcon}
        />
      </View>
    </View>
  );

  const renderRegularSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.slide}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
      </View>
    </View>
  );

  const renderSignUpSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.slide}>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpCaption}>{item.title}</Text>
        <Text style={styles.signUpDescription}>{item.description}</Text>
        <Button
          title="Sign Up"
          onPress={() => router.push('/SignIn')}
          buttonStyle={styles.signUpButton}
          titleStyle={styles.signUpButtonText}
          icon={
            <Icon
              name="person-add-outline"
              type="ionicon"
              color={colors.white}
              size={24}
              containerStyle={styles.buttonIcon}
            />
          }
        />
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    switch (item.type) {
      case 'welcome':
        return renderWelcomeSlide({ item });
      case 'signup':
        return renderSignUpSlide({ item });
      default:
        return renderRegularSlide({ item });
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
      const newIsLastSlide = newIndex === SLIDES.length - 1;
      setIsLastSlide(newIsLastSlide);
      if (newIsLastSlide || newIndex === 0) {
        fadeOut();
      } else {
        fadeIn();
      }
    }
  }, []);

  const handleSignIn = () => {
    router.push('/SignIn');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={globalStyles.gradientBackground}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
        <Animated.View style={{ ...styles.pageIndicatorContainer, opacity: fadeAnim }}>
          <PageIndicator total={SLIDES.length} current={currentIndex} />
        </Animated.View>
      </LinearGradient>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn}
        activeOpacity={0.7}
        accessibilityLabel="Sign In"
        accessibilityHint="Navigate to sign in page"
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  welcomeSlide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  welcomeTitle: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  welcomeDescription: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: spacing.xl,
  },
  swipeIcon: {
    marginTop: spacing.l,
  },
  imagePlaceholder: {
    width: width,
    height: height * 0.85,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontSize: 14,
  },
  signInButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + spacing.m - 50,
    right: spacing.l - 20,
    zIndex: 10,
    padding: spacing.s,
  },
  signInButtonText: {
    ...typography.button,
    color: '#303831',
    fontSize: 16,
    opacity: 0.5,
  },
  signUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  signUpCaption: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  signUpDescription: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: spacing.xl,
  },
  signUpButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: spacing.m,
  },
  signUpButtonText: {
    ...typography.button,
    color: colors.white,
  },
  buttonIcon: {
    marginRight: spacing.m,
  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: '17%',
    left: 0,
    right: 0,
  },
});

export default IntroSlideshow;