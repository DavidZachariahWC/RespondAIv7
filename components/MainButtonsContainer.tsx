import React from 'react';
import { View, StyleSheet } from 'react-native';
import PersonalityContainer from './PersonalityContainer';

interface MainButtonsContainerProps {
  contextUploaded: boolean;
  infoUploaded: boolean;
  personalityName: string | null;
  onContextPress: () => void;
  onInfoPress: () => void;
  onPersonalityChange: () => void;
  onEditPersonality: () => void;
  onEditContext: () => void;
  onEditInfo: () => void;
}

const MainButtonsContainer: React.FC<MainButtonsContainerProps> = React.memo(({
  contextUploaded,
  infoUploaded,
  personalityName,
  onContextPress,
  onInfoPress,
  onPersonalityChange,
  onEditPersonality,
  onEditContext,
  onEditInfo
}) => {
  return (
    <View style={styles.container}>
      <PersonalityContainer
        personalityName={personalityName}
        onChangePersonality={onPersonalityChange}
        onEdit={onEditPersonality}
        isCompleted={!!personalityName}
        buttonTitle="Select Personality"
        completedTitle="Personality Selected:"
      />
      <PersonalityContainer
        personalityName={contextUploaded ? "Context" : null}
        onChangePersonality={onContextPress}
        onEdit={onEditContext}
        isContext={true}
        isCompleted={contextUploaded}
        buttonTitle="Upload Message"
        completedTitle="Context Provided:"
      />
      <PersonalityContainer
        personalityName={infoUploaded ? "Response Info" : null}
        onChangePersonality={onInfoPress}
        onEdit={onEditInfo}
        isCompleted={infoUploaded}
        buttonTitle="Response Info"
        completedTitle="Response Info Provided:"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 32,
  },
});

export default MainButtonsContainer;