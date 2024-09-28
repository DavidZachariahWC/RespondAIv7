import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing } from "../constants/styles";

interface AlertProps {
  message: string;
  onDismiss: () => void;
  severity?: 'error' | 'warning' | 'info';
  actions?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

const AlertComponent: React.FC<AlertProps> = ({
  message,
  onDismiss,
  severity = 'info',
  actions = [{ text: 'OK', onPress: onDismiss }],
}) => {
  const getSeverityPrefix = () => {
    switch (severity) {
      case 'error':
        return 'Error: ';
      case 'warning':
        return 'Warning: ';
      default:
        return '';
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.alertContainer}>
        <Text style={styles.message}>
          {getSeverityPrefix()}{message}
        </Text>
        <View style={styles.actionContainer}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                index !== actions.length - 1 && styles.actionButtonBorder,
              ]}
              onPress={action.onPress}
            >
              <Text style={[
                styles.actionText,
                action.style === 'destructive' && styles.destructiveText,
              ]}>
                {action.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: width * 0.85,
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  message: {
    ...typography.body,
    color: colors.textDark,
    padding: spacing.m,
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonBorder: {
    borderRightWidth: 1,
    borderRightColor: colors.lightGray,
  },
  actionText: {
    ...typography.button,
    color: colors.primary,
    fontWeight: '600',
  },
  destructiveText: {
    color: colors.danger,
  },
});

export default AlertComponent;