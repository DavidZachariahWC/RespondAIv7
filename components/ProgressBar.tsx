import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/styles';

interface ProgressBarProps {
  progress: number;
  containerStyle?: object;
  barStyle?: object;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, containerStyle, barStyle }) => {
  return (
    <View style={[styles.progressBarContainer, containerStyle]}>
      <View style={[styles.progressBar, { width: `${progress}%` }, barStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
});

export default ProgressBar;