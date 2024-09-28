import { ColorSchemeName } from 'react-native';

const primaryColor = '#3b5998';
const secondaryColor = '#4c669f';
const accentColor = '#4CAF50';

export const Colors = {
  light: {
    text: '#ffffff',
    background: '#4c669f',
    tint: primaryColor,
    tabIconDefault: '#ffffff',
    tabIconSelected: accentColor,
    buttonBackground: '#ffffff',
    buttonText: primaryColor,
    gradientStart: '#4c669f',
    gradientMiddle: '#3b5998',
    gradientEnd: '#192f6a',
    progressBar: accentColor,
    statusTextPending: '#757575',
    statusTextDone: accentColor,
  },
  dark: {
    text: '#ffffff',
    background: '#192f6a',
    tint: secondaryColor,
    tabIconDefault: '#9BA1A6',
    tabIconSelected: accentColor,
    buttonBackground: '#4c669f',
    buttonText: '#ffffff',
    gradientStart: '#192f6a',
    gradientMiddle: '#3b5998',
    gradientEnd: '#4c669f',
    progressBar: accentColor,
    statusTextPending: '#9BA1A6',
    statusTextDone: accentColor,
  },
};

export const getThemeColors = (colorScheme: ColorSchemeName) => 
  Colors[colorScheme === 'dark' ? 'dark' : 'light'];

export const gradientColors = [
  Colors.light.gradientStart,
  Colors.light.gradientMiddle,
  Colors.light.gradientEnd
];