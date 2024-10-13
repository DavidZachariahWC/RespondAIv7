import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../constants/styles';

type PersonalityListProps = {
  personalities: string[];
  selectedPersonality?: string;
  onSelectPersonality: (personality: string) => void;
  onEditPersonality: (personality: string) => void;
  onCreatePersonality: () => void;
};

type PersonalityItemProps = {
  item: string;
  selected: boolean;
  onSelectPersonality: (personality: string) => void;
  onEditPersonality: (personality: string) => void;
};

const PersonalityItem: React.FC<PersonalityItemProps> = React.memo(
  ({ item, selected, onSelectPersonality, onEditPersonality }) => {
    const handleSelect = useCallback(() => onSelectPersonality(item), [onSelectPersonality, item]);
    const handleEdit = useCallback(() => onEditPersonality(item), [onEditPersonality, item]);

    return (
      <TouchableOpacity
        style={[
          styles.personalityItem,
          selected && styles.selectedPersonality,
        ]}
        onPress={handleSelect}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.personalityName,
            selected && styles.selectedPersonalityText,
          ]}
        >
          {item}
        </Text>
        <TouchableOpacity onPress={handleEdit}>
          <Ionicons name="pencil" size={24} color={colors.white} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selected === nextProps.selected &&
    prevProps.item === nextProps.item
);

const PersonalityList: React.FC<PersonalityListProps> = ({
  personalities,
  selectedPersonality,
  onSelectPersonality,
  onEditPersonality,
  onCreatePersonality,
}) => {
  const renderPersonalityItem = useCallback(
    ({ item }: { item: string }) => (
      <PersonalityItem
        item={item}
        selected={selectedPersonality === item}
        onSelectPersonality={onSelectPersonality}
        onEditPersonality={onEditPersonality}
      />
    ),
    [selectedPersonality, onSelectPersonality, onEditPersonality]
  );

  const renderCreatePersonality = useCallback(
    () => (
      <TouchableOpacity style={styles.personalityItem} onPress={onCreatePersonality}>
        <Ionicons name="add-circle-outline" size={24} color={colors.white} />
        <Text style={styles.personalityName}>Create New Personality</Text>
      </TouchableOpacity>
    ),
    [onCreatePersonality]
  );

  return (
    <FlatList
      data={personalities}
      renderItem={renderPersonalityItem}
      keyExtractor={(item) => item}
      ListFooterComponent={renderCreatePersonality}
      contentContainerStyle={styles.listContainer}
      extraData={selectedPersonality}
    />
  );
};

const styles = StyleSheet.create({
    listContainer: {
      paddingHorizontal: spacing.m,
      paddingTop: spacing.l,
      paddingBottom: spacing.m,
    },
    personalityItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: spacing.m,
      marginBottom: spacing.m,
      borderRadius: 10,
    },
    selectedPersonality: {
      backgroundColor: colors.primary,
      borderColor: colors.secondary,
      borderWidth: 2,
    },
    personalityName: {
      ...typography.body,
      color: colors.white,
      flex: 1,
    },
    selectedPersonalityText: {
      fontWeight: 'bold',
    },
  });

export default PersonalityList;
