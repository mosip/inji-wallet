import React from 'react';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { I18nManager, View } from 'react-native';
import { Picker } from './ui/Picker';
import Storage from '../shared/storage';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import RNRestart from 'react-native-restart';
import testIDProps from '../shared/commonUtil';

export const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  const { i18n } = useTranslation();
  const languages = Object.entries(SUPPORTED_LANGUAGES).map(
    ([value, label]) => ({ label, value })
  );

  const changeLanguage = async (language: string) => {
    if (language !== i18n.language) {
      await i18n.changeLanguage(language).then(async () => {
        await Storage.setItem('language', i18n.language);
        const isRTL = i18next.dir(language) === 'rtl' ? true : false;
        if (isRTL !== I18nManager.isRTL) {
          try {
            I18nManager.forceRTL(isRTL);
            setTimeout(() => {
              RNRestart.Restart();
            }, 150);
          } catch (e) {
            console.log('error', e);
          }
        }
      });
    }
  };

  return (
    <View>
      <Picker
        {...testIDProps('language')}
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
