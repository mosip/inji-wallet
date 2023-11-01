import React from 'react';
import i18n, {SUPPORTED_LANGUAGES} from '../i18n';
import {useTranslation} from 'react-i18next';
import {SetupPicker} from '../components/ui/SetupPicker';
import {Button, Column, Text} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {Icon} from 'react-native-elements';
import {RootRouteProps} from '../routes';
import {useWelcomeScreen} from './WelcomeScreenController';
import {changeLanguage} from '../components/LanguageSelector';

export const SetupLanguageScreen: React.FC<RootRouteProps> = props => {
  const {t} = useTranslation('SetupLanguage');
  const controller = useWelcomeScreen(props);
  const languages = Object.entries(SUPPORTED_LANGUAGES).map(
    ([value, label]) => ({label, value}),
  );

  return (
    <Column style={Theme.SetupLanguageScreenStyle.columnStyle}>
      <Icon
        name="globe"
        type="simple-line-icon"
        color={Theme.Colors.Icon}
        size={58}
      />
      <Column crossAlign="center">
        <Text
          testID="chooseLanguage"
          style={{paddingTop: 3}}
          margin="10 0 10 0"
          weight="semibold">
          {t('header')}
        </Text>
        <Text
          weight="semibold"
          style={{paddingTop: 3}}
          align="center"
          color={Theme.Colors.GrayText}>
          {t('description')}
        </Text>
      </Column>

      <SetupPicker
        testID="languagePicker"
        items={languages}
        selectedValue={i18n.language}
        onValueChange={language => changeLanguage(i18n.language, language)}
      />

      <Button
        testID="savePreference"
        type="gradient"
        title={t('save')}
        onPress={() => {
          controller.SELECT(), controller.unlockPage;
        }}
      />
    </Column>
  );
};
