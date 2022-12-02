import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Column } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useQrLogin } from './QrLoginController';

export const BindStatus: React.FC = () => {
  const controller = useQrLogin();

  return (
    <View style={Theme.OtpVerificationStyles.viewContainer}>
      <Column
        fill
        padding="32"
        backgroundColor={Theme.Colors.whiteBackgroundColor}>
        <View style={Theme.OtpVerificationStyles.close}>
          <Icon name="close" onPress={() => controller.DISMISS} />
        </View>
        <Column fill align="space-between">
          <Text align="center">{'QR login warning'}</Text>
          <Text align="center" color={Theme.Colors.textLabel} margin="16 0 0 0">
            {'Warning'}
          </Text>
          <Button title={'GO BACK'} onPress={controller.DISMISS} />
        </Column>
        <Column fill></Column>
      </Column>
    </View>
  );
};
