import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Column, Text } from '../../../components/ui';
import { Theme } from '../../../components/ui/styleUtils';
import { useBindVcStatus, BindVcProps } from './BindVcController';

export const BindStatus: React.FC<BindVcProps> = (props) => {
  const controller = useBindVcStatus(props);
  const { t, i18n } = useTranslation('VcDetails');
  var message: string = controller.walletBindingError;

  return (
    <View style={Theme.OtpVerificationStyles.viewContainer}>
      <Column
        fill
        padding="32"
        backgroundColor={Theme.Colors.whiteBackgroundColor}>
        <View style={Theme.OtpVerificationStyles.close}>
          <Icon name="close" onPress={() => props.onDismiss()} />
        </View>
        <Column fill align="space-between">
          {!controller.walletBindingError && <WalletVerified />}

          {controller.walletBindingError ? (
            <Text
              align="center"
              color={Theme.Colors.errorMessage}
              margin="16 0 0 0">
              {{ message }}
            </Text>
          ) : (
            <Text align="center" margin="16 0 0 0">
              {t('verificationEnabledSuccess')}
            </Text>
          )}

          <Button title={t('goback')} onPress={props.onDone} />
        </Column>
        <Column fill></Column>
      </Column>
    </View>
  );
};

const WalletVerified: React.FC = () => {
  return (
    <Icon
      name="verified-user"
      color={'green'}
      size={40}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};
