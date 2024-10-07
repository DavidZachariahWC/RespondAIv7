import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, gradientColors } from '../constants/styles';

export default function GeneratingResponse() {
  const router = useRouter();
  const [dots, setDots] = useState('.');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnimX = useRef(new Animated.Value(0)).current;
  const shakeAnimY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Shaking animation
    const shakeSequence = Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnimX, { toValue: 5, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimX, { toValue: -5, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimX, { toValue: 5, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimX, { toValue: 0, duration: 50, useNativeDriver: true })
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnimY, { toValue: 5, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnimY, { toValue: -5, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnimY, { toValue: 5, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnimY, { toValue: 0, duration: 60, useNativeDriver: true })
        ])
      )
    ]);

    shakeSequence.start();

    // Dot animation
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        switch (prevDots) {
          case '.': return '..';
          case '..': return '...';
          case '...': return '.';
          default: return '.';
        }
      });
    }, 500);

    // Generate a random delay between 2.0 and 10.0 seconds
    const randomDelay = Math.random() * (10000 - 2000) + 2000;

    // Navigate to preview after the random delay
    const timeoutId = setTimeout(() => {
      router.push('/preview');
    }, randomDelay);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      shakeSequence.stop();
    };
  }, []);

  const animatedStyle = {
    transform: [
      { translateX: shakeAnimX },
      { translateY: shakeAnimY }
    ]
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Animated.Text style={[styles.text, animatedStyle]}>
              Generating Response{dots}
            </Animated.Text>
          </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
  },
});
