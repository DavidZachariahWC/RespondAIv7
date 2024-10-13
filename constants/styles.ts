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
  shadow: "rgba(0, 0, 0, 0.1)",
  lightBackground: "rgba(255,255,255,0.2)",
};

export const spacing = {
  xs: 4,
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
    fontWeight: "100",
    fontFamily: 'CustomFont-Regular',
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
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'CustomFont-Regular',
    color: colors.textSecondary,
  },
  h2Bold: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: 'CustomFont-Bold',
    color: colors.text,
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
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'normal',
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  shadowButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.m,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 20,
    borderColor: "black",
    borderWidth: 1,
    transform: [{ translateY: 2 }],
  },
  helpContainer: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.4,
  },
  helpText: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  backBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: 8,
  },
  backText: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  personalityButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalityButtonSelected: {
    backgroundColor: colors.primary,
  },
  personalityButtonText: {
    ...typography.body,
    color: colors.text,
  },
  personalityButtonTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export { gradientColors };