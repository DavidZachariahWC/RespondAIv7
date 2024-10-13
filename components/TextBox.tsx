import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../constants/styles';

interface TextBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  wordCount: number;
}

const TextBox: React.FC<TextBoxProps> = ({ value, onChangeText, placeholder, wordCount }) => {
  return (
    <View style={styles.textBoxContainer}>
      <TextInput
        style={styles.textBox}
        multiline
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      <Text style={styles.wordCount}>{wordCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textBoxContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: spacing.s,
    marginBottom: spacing.m,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: 'black',
    borderWidth: 1,
  },
  textBox: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    minHeight: 100,
    maxHeight: 200,
    ...typography.body,
    color: colors.textDark,
  },
  wordCount: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    ...typography.caption,
    color: colors.textLight,
  },
});

export default TextBox;

