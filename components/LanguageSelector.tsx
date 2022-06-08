import React from 'react';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { View } from 'react-native';
import { Picker } from './ui/Picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  const { i18n } = useTranslation();
  const languages = Object.entries(SUPPORTED_LANGUAGES).map(
    ([value, label]) => ({ label, value })
  );

  const changeLanguage = async (value: string) => {
    await i18n.changeLanguage(value);
    await AsyncStorage.setItem('language', i18n.language);
  };

  return (
    <View>
      <Picker
        items={languages}
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
