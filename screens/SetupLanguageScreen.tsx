import React from 'react';
import i18n, { SUPPORTED_LANGUAGES } from '../i18n';
import { I18nManager, Dimensions } from 'react-native';
import Storage from '../shared/storage';
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
  const { t } = useTranslation('SetupLanguage');
  const controller = useWelcomeScreen(props);
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
    <Column
      align="space-around"
      crossAlign="center"
      backgroundColor={Theme.Colors.whiteBackgroundColor}
      height={Dimensions.get('window').height * 0.9}>
      <Icon
        name="globe"
        type="simple-line-icon"
        color={Theme.Colors.Icon}
        size={58}
      />
      <Column crossAlign="center">
        <Text margin="0 0 10 0" weight="semibold">
          {t('header')}
        </Text>
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

      <Button
        type="gradient"
        title={t('save')}
        onPress={() => {
          controller.SELECT(), controller.unlockPage;
        }}
      />
    </Column>
  );
};
