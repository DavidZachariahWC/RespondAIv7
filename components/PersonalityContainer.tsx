import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../constants/styles';
import { Ionicons } from '@expo/vector-icons';

interface PersonalityContainerProps {
  personalityName: string | null;
  onChangePersonality: () => void;
  onEdit: () => void;
  isContext?: boolean;
  isCompleted?: boolean;
  buttonTitle?: string;
  completedTitle?: string;
}

const PersonalityContainer: React.FC<PersonalityContainerProps> = React.memo(({ 
  personalityName, 
  onChangePersonality, 
  onEdit,
  isContext = false, 
  isCompleted = false,
  buttonTitle = "Select Personality",
  completedTitle = "Completed!"
}) => {
  if (!personalityName) {
    return (
      <TouchableOpacity 
        style={styles.pendingButton} 
        onPress={onChangePersonality}
        accessibilityLabel={buttonTitle}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
          <Text style={styles.pendingButtonText}>{buttonTitle}</Text>
        </View>
        <Text style={styles.statusText}>Pending</Text>
      </TouchableOpacity>
    );
  }

  const containerStyle = [
    styles.container,
    isCompleted && styles.completedContainer
  ];

  const labelStyle = [
    styles.label,
    isCompleted && styles.completedLabel
  ];

  const nameStyle = [
    styles.name,
    isCompleted && styles.completedName
  ];

  const content = (
    <>
      <View style={styles.contentWrapper}>
        <Text style={labelStyle}>
          {isCompleted ? completedTitle : "Selected Personality:"}
        </Text>
        <Text style={nameStyle}>{personalityName}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons 
          name="create-outline" 
          size={24} 
          color={isCompleted ? colors.primary : colors.white} 
          style={styles.editIcon}
        />
        {isCompleted && (
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color={colors.accent} 
            style={styles.checkIcon}
          />
        )}
      </View>
    </>
  );

  if (isCompleted) {
    return (
      <TouchableOpacity 
        style={containerStyle} 
        onPress={onEdit}
        accessibilityLabel={`Edit ${isContext ? 'context' : 'personality'}`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{content}</View>;
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedContainer: {
    backgroundColor: '#E8F5E9',
  },
  contentWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
  },
  completedLabel: {
    color: colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  completedName: {
    color: colors.primary,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    marginRight: 8,
  },
  checkIcon: {
    marginLeft: 8,
  },
  pendingButton: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 16,
  },
  statusText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
});

export default PersonalityContainer;