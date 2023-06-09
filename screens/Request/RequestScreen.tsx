import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';

import { Centered, Button, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useRequestScreen } from './RequestScreenController';

export const RequestScreen: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestScreen();
  const props: RequestScreenProps = { t, controller };

  return (
    <Column
      fill
      padding="24"
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      {controller.isBluetoothDenied && <BluetoothPrompt {...props} />}

      {!controller.isCheckingBluetoothService &&
      !controller.isBluetoothDenied ? (
        <Column align="flex-end" fill>
          {controller.isWaitingForConnection && <SharingQR {...props} />}
          <StatusMessage {...props} />
        </Column>
      ) : null}
    </Column>
  );
};

const BluetoothPrompt: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    <Centered fill>
      <Text color={Theme.Colors.errorMessage} align="center">
        {t('bluetoothDenied')}
      </Text>
      <Button
        margin={[32, 0, 0, 0]}
        title={t('gotoSettings')}
        onPress={controller.GOTO_SETTINGS}
      />
    </Centered>
  );
};

const SharingQR: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    <React.Fragment>
      <Text align="center">{t('showQrCode')}</Text>

      <Centered fill>
        {controller.openId4VpUri !== '' ? (
          <QRCode
            size={200}
            value={controller.openId4VpUri}
            backgroundColor={Theme.Colors.QRCodeBackgroundColor}
          />
        ) : null}
      </Centered>
    </React.Fragment>
  );
};

const StatusMessage: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    controller.statusMessage !== '' && (
      <Column elevation={1} padding="16 24">
        <Text>{controller.statusMessage}</Text>
        {controller.statusHint !== '' && (
          <Text size="small" color={Theme.Colors.textLabel}>
            {controller.statusHint}
          </Text>
        )}
        {controller.isStatusCancellable && (
          <Button
            margin={[8, 0, 0, 0]}
            title={t('cancel', { ns: 'common' })}
            loading={controller.isCancelling}
            onPress={controller.CANCEL}
          />
        )}
      </Column>
    )
  );
};

interface RequestScreenProps {
  t: TFunction;
  controller: ReturnType<typeof useRequestScreen>;
}
