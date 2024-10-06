import { TextStyle, ViewStyle } from "react-native";
import { Colors, gradientColors } from "./Colors";
import { StyleSheet } from 'react-native';

const lightColors = Colors.light;

export const colors = {
  primary: lightColors.tint,
  secondary: lightColors.background,
  background: lightColors.background,
  text: lightColors.text,
  textSecondary: lightColors.buttonText,
  white: "#FFFFFF",
  black: "#000000",
  grey5: "#E0E0E0",
  accent: lightColors.tabIconSelected,
  border: "#E0E0E0",
  lightGray: "#F5F5F5",
  textDark: "#303831",
  backgroundDark: lightColors.background,
  textLight: lightColors.statusTextPending,
  danger: "#FF0000",
  warning: "#FFA500",
  info: "#0000FF",
  lightGrey: "#F5F5F5",
};

export const spacing = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: 'CustomFont-Bold',
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: 'CustomFont-Bold',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'CustomFont-Regular',
    color: colors.text,
  },
  button: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: 'CustomFont-Bold',
    color: colors.textSecondary,
  },
};

export const globalStyles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
  },
  emptyMessage: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    padding: spacing.m,
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginHorizontal: spacing.m,
    marginVertical: spacing.l,
  },
});

export { gradientColors };