import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from "../constants/styles";
import { Button } from '@rneui/themed';

interface PageIndicatorProps {
  total: number;
  current: number;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({ total, current }) => {
  return (
    <View style={styles.container}>
      {[...Array(total)].map((_, index) => (
        <Button
          key={index}
          type="clear"
          buttonStyle={[
            styles.dot,
            index === current ? styles.activeDot : styles.inactiveDot,
          ]}
          disabled
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 4,
    padding: 0,
  },
  activeDot: {
    backgroundColor: colors.white,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

export default PageIndicator;