import React from 'react';
import { View, StyleSheet } from 'react-native';
import IntroSlideshow from '../components/IntroSlideshow';

export default function Intro() {
  return (
    <View style={styles.container}>
      <IntroSlideshow />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
