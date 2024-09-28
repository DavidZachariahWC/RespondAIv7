import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from "../constants/styles";

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'large', 
  color = colors.primary 
}) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LoadingIndicator;