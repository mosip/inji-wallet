import React from 'react';
import {useTranslation} from 'react-i18next';
import {Column, Text, Button} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import { View, ScrollView } from 'react-native';
import { colors } from 'react-native-elements';

export const StaticAuthScreen: React.FC = () => {
  const {t} = useTranslation('AuthScreen');

  return (
    <Column
      fill
      padding={[0, 32, 0, 32]}
      backgroundColor={Theme.Colors.whiteBackgroundColor}
      style={{
        borderRadius: 30,
        maxHeight: 600,
        maxWidth:350,
        minHeight: 600,
        minWidth:350,
        borderColor: Theme.Colors.blackIcon, 
        borderWidth: 12,
        overflow: 'hidden', 
      }}
      >
        <View style={Theme.IntroSliderStyles.biometricIntroNotch}></View>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Column
          align='space-between'
          fill
          backgroundColor={Theme.Colors.whiteBackgroundColor}
          style={{
            borderRadius: 30, 
            overflow: 'hidden', 
          }}>
          <Column crossAlign="center">
            {SvgImage.fingerprintIcon(66)}
            <Column margin="30 0 0 0">
              <Text
                testID="selectAppUnlockMethod"
                style={Theme.TextStyles.header}
                align="center">
                {t('header')}
              </Text>
              <Text
                testID="description"
                align="center"
                weight="semibold"
                color={Theme.Colors.GrayText}
                margin="6 0">
                {t('Description')}
              </Text>
              <Text
                testID="passwordTypeDescription"
                align="center"
                weight="semibold"
                color={Theme.Colors.GrayText}
                margin="6 0">
                {t('PasswordTypeDescription')}
              </Text>
            </Column>
          </Column>

          <Column>
            <Button
              title={t('useBiometrics')}
              type='gradient'
              margin="0 0 8 0"
              onPress={() => {}}
              
            />
            <Button
              testID="usePasscode"
              type="clear"
              title={t('usePasscode')}
              disabled={false}
              onPress={() => {}}
            />
          </Column>
        </Column>
      </ScrollView>
    </Column>
  );
};
