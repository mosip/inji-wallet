import React from 'react';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { Dimensions, I18nManager, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import RNRestart from 'react-native-restart';
import { SetupPicker } from '../components/ui/SetupPicker';
import { Button, Column, Text } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';
import { Icon } from 'react-native-elements';
import { RootRouteProps } from '../routes';
import { useWelcomeScreen } from './WelcomeScreenController';

export const SetupLanguageScreen: React.FC<RootRouteProps> = (props) => {
  const { i18n } = useTranslation();
  const languages = Object.entries(SUPPORTED_LANGUAGES).map(
    ([value, label]) => ({ label, value })
  );
  const { t } = useTranslation('SetupLanguage');
  const controller = useWelcomeScreen(props);
  const changeLanguage = async (language: string) => {
    if (language !== i18n.language) {
      await i18n.changeLanguage(language).then(async () => {
        await AsyncStorage.setItem('language', i18n.language);
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
    <Column
      align="space-between"
      crossAlign="center"
      backgroundColor={Theme.Colors.whiteBackgroundColor}
      height={Dimensions.get('window').height * 0.9}>
      <Icon
        name="globe"
        type="simple-line-icon"
        color={Theme.Colors.Icon}
        size={50}
      />
      <Column crossAlign="center">
        <Text weight="semibold">{t('header')}</Text>
        <Text
          style={{ paddingHorizontal: 35 }}
          weight="regular"
          align="center"
          color={Theme.Colors.GrayText}>
          {t('description')}
        </Text>
      </Column>

      <SetupPicker
        items={languages}
        selectedValue={i18n.language}
        onValueChange={changeLanguage}
      />
      <Column padding="20" backgroundColor={Theme.Colors.whiteBackgroundColor}>
        <Button
          linearGradient
          type="gradient"
          title={t('save')}
          onPress={() => {
            controller.SELECT(), controller.unlockPage;
          }}
          colors={Theme.Colors.gradientBtn}
        />
      </Column>
    </Column>
  );
};
