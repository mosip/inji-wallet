import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';
import { Column, Text, Button } from '../../../components/ui';
import { Theme } from '../../../components/ui/styleUtils';
import { useBindVcStatus, BindVcProps } from './BindVcController';

export const BindStatus: React.FC<BindVcProps> = (props) => {
  const controller = useBindVcStatus(props);
  const { t, i18n } = useTranslation('VcDetails');
  var message: string = controller.walletBindingError;

  return (
    <Column
      style={Theme.OtpVerificationStyles.viewContainer}
      align="space-around">
      <Column>
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
      </Column>
      <Button title={t('Okay')} onPress={props.onDone} type="radius" />
    </Column>
  );
};

const WalletVerified: React.FC = () => {
  return (
    <Icon name="verified-user" color={Theme.Colors.VerifiedIcon} size={50} />
  );
};
