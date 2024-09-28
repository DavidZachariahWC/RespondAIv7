import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors, typography, spacing } from "../constants/styles";

interface AuthInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const AuthInput: React.FC<AuthInputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none'
}) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textLight}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textDark,
    paddingVertical: spacing.s,
    ...typography.body,
    color: colors.textDark,
    textAlignVertical: 'center', // This ensures vertical centering on Android
  },
});

export default AuthInput;