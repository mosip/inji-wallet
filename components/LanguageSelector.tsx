import React from 'react';
import i18n, { SUPPORTED_LANGUAGES } from '../i18n';
import { View } from 'react-native';
import { Picker } from './ui/Picker';

export const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  return (
    <View>
      <Picker
        items={SUPPORTED_LANGUAGES}
        selectedValue={i18n.language}
        onValueChange={(value) => i18n.changeLanguage(value)}
        triggerComponent={props.triggerComponent}
      />
    </View>
  );
};

interface LanguageSelectorProps {
  triggerComponent: React.ReactElement;
}
