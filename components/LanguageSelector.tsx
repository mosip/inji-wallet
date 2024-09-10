import React from 'react';
import {SUPPORTED_LANGUAGES} from '../i18n';
import {I18nManager, View} from 'react-native';
import {Picker} from './ui/Picker';
import {useTranslation} from 'react-i18next';
import i18next, {i18n} from 'i18next';
import RNRestart from 'react-native-restart';
import {setItem} from '../machines/store';

export const LanguageSelector: React.FC<LanguageSelectorProps> = props => {
  const {i18n} = useTranslation();
  const languages = Object.entries(SUPPORTED_LANGUAGES).map(
    ([value, label]) => ({label, value}),
  );

  return (
    <View>
      <Picker
        testID="languages"
        items={languages}
        selectedValue={i18n.language}
        onValueChange={language => changeLanguage(i18n, language)}
        triggerComponent={props.triggerComponent}
      />
    </View>
  );
};

export const changeLanguage = async (i18n: i18n, language: string) => {
  if (language !== i18n.language) {
    await i18n.changeLanguage(language).then(async () => {
      await setItem('language', i18n.language,"");
      const isRTL = i18next.dir(language) === 'rtl';
      if (isRTL !== I18nManager.isRTL) {
        try {
          I18nManager.forceRTL(isRTL);
          setTimeout(() => {
            RNRestart.Restart();
          }, 150);
        } catch (e) {
          console.error('error while changing text direction ', e);
        }
      }
    });
  }
};

interface LanguageSelectorProps {
  triggerComponent: React.ReactElement;
}
