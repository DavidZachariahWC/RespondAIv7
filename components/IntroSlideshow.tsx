import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, globalStyles, gradientColors } from "../constants/styles";

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const SLIDES = [
  { id: '1', type: 'welcome', title: 'Welcome to Respondify', description: 'Your tool for better and easier communications' },
  { id: '2', type: 'signup', title: 'Get Started', description: 'Sign up now and start responding better!' },
];

const IntroSlideshow: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

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

  const renderSignUpSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.slide}>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpCaption}>{item.title}</Text>
        <Text style={styles.signUpDescription}>{item.description}</Text>
        <Button
          title="Sign Up"
          onPress={() => router.push('/SignUp')}
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
        return null;
    }
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
        />
      </LinearGradient>
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
});

export default IntroSlideshow;
