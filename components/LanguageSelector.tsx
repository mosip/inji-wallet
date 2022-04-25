import React from 'react';
import i18n, { SUPPORTED_LANGUAGES } from '../i18n';
import { View } from 'react-native';
import { Picker } from './ui/Picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  const langauges = Object.entries(SUPPORTED_LANGUAGES).map(
    ([value, label]) => ({ label, value })
  );

  const changeLanguage = async (value: string) => {
    await i18n.changeLanguage(value);
    await AsyncStorage.setItem('language', i18n.language);
  };

  return (
    <View>
      <Picker
        items={langauges}
        selectedValue={i18n.language}
        onValueChange={changeLanguage}
        triggerComponent={props.triggerComponent}
      />
    </View>
  );
};

interface LanguageSelectorProps {
  triggerComponent: React.ReactElement;
}
