import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Text, Button, Row } from '../../../components/ui';
import { Theme } from '../../../components/ui/styleUtils';
import { useBindVcStatus, BindVcProps } from './BindVcController';
import { Image } from 'react-native';
import { Modal } from '../../../components/ui/Modal';
import { Icon } from 'react-native-elements';

export const BindStatus: React.FC<BindVcProps> = (props) => {
  const controller = useBindVcStatus(props);
  const { t, i18n } = useTranslation('VcDetails');
  var message: string = controller.walletBindingError;

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      headerElevation={2}
      headerTitle={t('status')}
      headerRight={<Icon name={''} />}>
      <Column fill align="space-around" crossAlign="center" padding={'10'}>
        <Column crossAlign="center">
          {!controller.walletBindingError ? (
            <Image source={Theme.SuccessLogo} resizeMethod="auto" />
          ) : (
            <Row align="center" crossAlign="center" margin={'0 80 0 0'}>
              <Image source={Theme.WarningLogo} resizeMethod="auto" />
              <Text
                margin={'0 0 0 -80'}
                color={Theme.Colors.whiteText}
                weight="bold">
                !
              </Text>
            </Row>
          )}
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

        <Button title={t('ok')} onPress={props.onDone} type="radius" />
      </Column>
    </Modal>
  );
};
