import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { Modal } from '../../components/ui/Modal';
import { Centered, Button, Text, Column } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useQrLogin } from './QrLoginController';
import { QrLoginRef } from '../../machines/QrLoginMachine';
import { APPLICATION_THEME } from 'react-native-dotenv';

export const QrLoginSuccess: React.FC<QrLoginSuccessProps> = (props) => {
  const { t } = useTranslation('QrScreen');
  const controller = useQrLogin(props);
  const clientName: Map<string, any> = new Map<string, any>([
    ['purple', controller.clientName],
    ['default', controller.clientName],
    ['eldoria', 'Eldoria Authentication Platform'],
    ['veridonia', 'Veridonia Authentication Platform'],
  ]);

  return (
    <Modal
      isVisible={controller.isVerifyingSuccesful}
      arrowLeft={<Icon name={''} />}
      headerTitle={t('status')}
      headerElevation={5}
      onDismiss={controller.DISMISS}>
      <Column
        fill
        align="space-between"
        style={{ display: props.isVisible ? 'flex' : 'none' }}>
        <Centered padding={'60 25 0 25'} margin={'60 0'}>
          <Image
            source={controller.logoUrl ? { uri: controller.logoUrl } : null}
            style={{ width: 60, height: 60 }}
          />
          <Text
            style={Theme.Styles.detailsText}
            weight="semibold"
            margin="20 0 0 0"
            align="center">
            {t('successMessage')}
            {clientName.get(APPLICATION_THEME.toLocaleLowerCase())}
          </Text>
        </Centered>
        <Column
          style={{ borderTopRightRadius: 27, borderTopLeftRadius: 27 }}
          padding="10 24"
          margin="2 0 0 0"
          elevation={2}>
          <Button
            type="gradient"
            title={t('okay')}
            margin="0 0 12 0"
            styles={Theme.ButtonStyles.radius}
            onPress={props.onPress}
          />
        </Column>
      </Column>
    </Modal>
  );
};

interface QrLoginSuccessProps {
  isVisible: boolean;
  onPress: () => void;
  service: QrLoginRef;
}
